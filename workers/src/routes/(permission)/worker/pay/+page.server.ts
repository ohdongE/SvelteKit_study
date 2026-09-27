import { prisma } from '$lib/server/prisma';
import { requireRole } from '$lib/server/auth';
import {
	currentMonth,
	isMonth,
	isPayUnit,
	monthRange,
	summarizePay,
	type PayUnit
} from '$lib/server/payroll';
import type { PageServerLoad } from './$types';

/** 선택한 단위(일/주/월)별 내 급여 */
export const load: PageServerLoad = async ({ locals, url }) => {
	const user = requireRole(locals.user, 'WORKER');

	const unitParam = url.searchParams.get('unit');
	const unit: PayUnit = isPayUnit(unitParam) ? unitParam : 'day';
	const monthParam = url.searchParams.get('month');
	const month = isMonth(monthParam) ? monthParam : currentMonth();
	const { start, end } = monthRange(month);

	const me = await prisma.users.findUnique({
		where: { id: user.id },
		select: { hourly_wage: true }
	});
	const hourlyWage = Number(me?.hourly_wage ?? 0);

	const records = await prisma.attendance.findMany({
		where: {
			user_id: user.id,
			check_in: unit === 'month' ? undefined : { gte: start, lt: end }
		},
		select: { check_in: true, check_out: true }
	});

	return { unit, month, hourlyWage, ...summarizePay(records, hourlyWage, unit) };
};
