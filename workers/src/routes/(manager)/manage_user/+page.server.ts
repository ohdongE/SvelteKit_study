import { prisma } from '$lib/server/prisma';
import { requireRole, ROLE_ID, toId } from '$lib/server/auth';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

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

	// Decimal은 직렬화가 안 되므로 number로 변환
	const users = usersRaw.map((u) => ({
		...u,
		hourly_wage: Number(u.hourly_wage)
	}));

	return { groups, users, groupId };
};

export const actions: Actions = {
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

		// 정책: 강등 시 group_id는 유지 (같은 그룹의 WORKER로 남음), 그룹의 leader_id만 해제
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
	}
};
