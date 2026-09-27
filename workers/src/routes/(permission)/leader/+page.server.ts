import { prisma } from '$lib/server/prisma';
import { requireRole } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = requireRole(locals.user, 'LEADER');

	// 소속 그룹이 없으면 (group_id: null 로 조회하면 무소속 전체가 나오므로) 빈 목록
	if (user.group_id === null) {
		return { group: null, members: [] };
	}

	const [group, members] = await Promise.all([
		prisma.groups.findUnique({ where: { id: user.group_id } }),
		prisma.users.findMany({
			where: { group_id: user.group_id },
			include: { roles: true },
			orderBy: [{ role_id: 'asc' }, { id: 'asc' }]
		})
	]);

	return {
		group,
		members: members.map((m) => ({ ...m, hourly_wage: Number(m.hourly_wage) }))
	};
};
