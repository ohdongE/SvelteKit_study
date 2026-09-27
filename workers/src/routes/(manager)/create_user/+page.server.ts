import { prisma } from '$lib/server/prisma';
import { requireRole, ROLE_ID, toId } from '$lib/server/auth';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

/** 선택 가능한 그룹 목록 (LEADER는 자기 그룹만) */
export const load: PageServerLoad = async ({ locals }) => {
	const user = requireRole(locals.user, 'ADMIN', 'LEADER');

	const groups =
		user.role === 'ADMIN'
			? await prisma.groups.findMany({ orderBy: { id: 'asc' } })
			: await prisma.groups.findMany({ where: { id: user.group_id ?? -1 } });

	return { groups };
};

export const actions: Actions = {
	/** WORKER 계정 생성 */
	createUser: async ({ request, locals }) => {
		const me = locals.user;
		if (!me || (me.role !== 'ADMIN' && me.role !== 'LEADER')) {
			return fail(403, { message: '권한이 없습니다.', name: '', login_id: '', phone: '' });
		}

		const formData = await request.formData();
		const str = (key: string) => {
			const v = formData.get(key);
			return typeof v === 'string' ? v.trim() : '';
		};
		const values = { name: str('name'), login_id: str('login_id'), phone: str('phone') };
		const groupIdInput = formData.get('group_id');

		/** 입력값을 유지한 채 에러 반환 */
		const invalid = (message: string, status = 400) => fail(status, { message, ...values });

		if (!values.name) return invalid('이름을 입력해주세요.');
		if (!values.login_id) return invalid('로그인 ID를 입력해주세요.');
		if (!values.phone) return invalid('전화번호를 입력해주세요.');

		if (values.name.length > 10) return invalid('이름은 10자 이하로 입력해주세요.');
		if (values.phone.length > 20) return invalid('전화번호 형식이 올바르지 않습니다.');
		if (values.login_id.length > 100) return invalid('로그인 ID가 너무 깁니다.');

		let groupId: number | null;

		if (me.role === 'LEADER') {
			if (me.group_id === null) {
				return invalid('소속 그룹이 없어 사용자를 생성할 수 없습니다.');
			}
			groupId = me.group_id;
		} else {
			groupId = toId(groupIdInput);
			if (groupId === null) {
				return invalid('그룹을 선택해주세요.');
			}
			const group = await prisma.groups.findUnique({ where: { id: groupId } });
			if (!group) {
				return invalid('존재하지 않는 그룹입니다.');
			}
		}

		try {
			await prisma.users.create({
				data: {
					...values,
					role_id: ROLE_ID.WORKER,
					group_id: groupId,
					hourly_wage: 0
				}
			});
		} catch (err) {
			console.error(err);
			return invalid('이미 사용 중인 로그인 ID 또는 전화번호입니다.');
		}

		return { success: true };
	}
};
