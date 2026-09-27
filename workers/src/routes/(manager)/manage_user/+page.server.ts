import { prisma } from '$lib/server/prisma';
import { requireRole, ROLE_ID, toId } from '$lib/server/auth';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

/** 그룹 목록과 선택한 그룹의 멤버 */
export const load: PageServerLoad = async ({ url, locals }) => {
	requireRole(locals.user, 'ADMIN');

	const groupId = toId(url.searchParams.get('select_group'));
	const groups = await prisma.groups.findMany({
		orderBy: { id: 'asc' },
		include: { leader: { select: { id: true, name: true } } }
	});

	const usersRaw = groupId
		? await prisma.users.findMany({
				where: { group_id: groupId },
				include: { roles: true },
				orderBy: [{ role_id: 'asc' }, { id: 'asc' }]
			})
		: [];

	const users = usersRaw.map((u) => ({
		...u,
		hourly_wage: Number(u.hourly_wage)
	}));

	return { groups, users, groupId };
};

export const actions: Actions = {
	/** WORKER를 그룹 팀장으로 임명 */
	promoteToLeader: async ({ request, locals }) => {
		if (locals.user?.role !== 'ADMIN') {
			return fail(403, { message: '권한이 없습니다.' });
		}

		const formData = await request.formData();
		const userId = toId(formData.get('user_id'));
		const groupId = toId(formData.get('group_id'));

		if (!userId || !groupId) {
			return fail(400, { message: '잘못된 요청입니다.' });
		}

		const [group, target] = await Promise.all([
			prisma.groups.findUnique({ where: { id: groupId } }),
			prisma.users.findUnique({ where: { id: userId } })
		]);

		if (!group) {
			return fail(404, { message: '그룹을 찾을 수 없습니다.' });
		}
		if (!target || target.group_id !== groupId) {
			return fail(400, { message: '해당 그룹 소속 사용자가 아닙니다.' });
		}
		if (target.role_id !== ROLE_ID.WORKER) {
			return fail(400, { message: '일반 작업자만 팀장으로 임명할 수 있습니다.' });
		}
		if (group.leader_id !== null) {
			return fail(400, { message: '이미 해당 그룹에 팀장이 존재합니다.' });
		}

		await prisma.$transaction([
			prisma.users.update({
				where: { id: userId },
				data: { role_id: ROLE_ID.LEADER }
			}),
			prisma.groups.update({
				where: { id: groupId },
				data: { leader_id: userId }
			})
		]);

		return { success: true, message: `${target.name}님을 팀장으로 임명했습니다.` };
	},

	/** 팀장을 WORKER로 변경 (소속 그룹은 유지) */
	demoteToWorker: async ({ request, locals }) => {
		if (locals.user?.role !== 'ADMIN') {
			return fail(403, { message: '권한이 없습니다.' });
		}

		const formData = await request.formData();
		const userId = toId(formData.get('user_id'));
		if (!userId) {
			return fail(400, { message: '잘못된 요청입니다.' });
		}

		const target = await prisma.users.findUnique({ where: { id: userId } });
		if (!target || target.role_id !== ROLE_ID.LEADER) {
			return fail(400, { message: '팀장만 일반 작업자로 변경할 수 있습니다.' });
		}

		await prisma.$transaction([
			prisma.users.update({
				where: { id: userId },
				data: { role_id: ROLE_ID.WORKER }
			}),
			prisma.groups.updateMany({
				where: { leader_id: userId },
				data: { leader_id: null }
			})
		]);

		return { success: true, message: `${target.name}님을 일반 작업자로 변경했습니다.` };
	},

	/** 시급 변경 (원 단위 정수) */
	updateWage: async ({ request, locals }) => {
		if (locals.user?.role !== 'ADMIN') {
			return fail(403, { message: '권한이 없습니다.' });
		}

		const formData = await request.formData();
		const userId = toId(formData.get('user_id'));
		const wage = Number(formData.get('hourly_wage'));

		if (!userId || !Number.isInteger(wage) || wage < 0 || wage > 99_999_999) {
			return fail(400, { message: '시급을 올바르게 입력해주세요.' });
		}

		const { count } = await prisma.users.updateMany({
			where: { id: userId },
			data: { hourly_wage: wage }
		});
		if (count === 0) {
			return fail(404, { message: '사용자를 찾을 수 없습니다.' });
		}

		return { success: true, message: `시급을 ${wage.toLocaleString('ko-KR')}원으로 변경했습니다.` };
	}
};
