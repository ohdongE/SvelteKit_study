import { prisma } from '$lib/server/prisma';
import { requireRole } from '$lib/server/auth';
import { currentMonth, isMonth, monthRange, summarizePay } from '$lib/server/payroll';
import type { PageServerLoad } from './$types';

/** 선택한 달의 그룹 멤버별 월급 */
export const load: PageServerLoad = async ({ locals, url }) => {
	const user = requireRole(locals.user, 'LEADER');

	const monthParam = url.searchParams.get('month');
	const month = isMonth(monthParam) ? monthParam : currentMonth();

	if (user.group_id === null) {
		return { month, members: [], totalMinutes: 0, totalPay: 0 };
	}

	const { start, end } = monthRange(month);

	const users = await prisma.users.findMany({
		where: { group_id: user.group_id },
		orderBy: [{ role_id: 'asc' }, { id: 'asc' }],
		select: {
			id: true,
			name: true,
			login_id: true,
			hourly_wage: true,
			attendance: {
				where: { check_in: { gte: start, lt: end } },
				select: { check_in: true, check_out: true }
			}
		}
	});

	const members = users.map((u) => {
		const hourlyWage = Number(u.hourly_wage);
		const s = summarizePay(u.attendance, hourlyWage, 'month');
		return {
			id: u.id,
			name: u.name,
			login_id: u.login_id,
			hourlyWage,
			count: s.totalCount,
			minutes: s.totalMinutes,
			pay: s.totalPay
		};
	});

	return {
		month,
		members,
		totalMinutes: members.reduce((s, m) => s + m.minutes, 0),
		totalPay: members.reduce((s, m) => s + m.pay, 0)
	};
};
