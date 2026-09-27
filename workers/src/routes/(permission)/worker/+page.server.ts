import { prisma } from '$lib/server/prisma';
import { requireRole } from '$lib/server/auth';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = requireRole(locals.user, 'WORKER');

	const records = await prisma.attendance.findMany({
		where: { user_id: user.id },
		orderBy: { check_in: 'desc' }
	});

	// 아직 퇴근 안 한(진행중인) 기록이 있는지
	const activeRecord = records.find((r) => r.check_out === null) ?? null;

	return { records, activeRecord };
};

export const actions: Actions = {
	checkIn: async ({ locals }) => {
		if (!locals.user) return fail(401, { message: '로그인이 필요합니다.' });
		if (locals.user.role !== 'WORKER') return fail(403, { message: '권한이 없습니다.' });

		const active = await prisma.attendance.findFirst({
			where: { user_id: locals.user.id, check_out: null }
		});

		if (active) {
			return fail(400, { message: '이미 출근 중입니다.' });
		}

		await prisma.attendance.create({
			data: { user_id: locals.user.id }
		});

		return { success: true, message: '출근 처리되었습니다.' };
	},

	checkOut: async ({ locals }) => {
		if (!locals.user) return fail(401, { message: '로그인이 필요합니다.' });
		if (locals.user.role !== 'WORKER') return fail(403, { message: '권한이 없습니다.' });

		const active = await prisma.attendance.findFirst({
			where: { user_id: locals.user.id, check_out: null },
			orderBy: { check_in: 'desc' }
		});

		if (!active) {
			return fail(400, { message: '출근 기록이 없습니다.' });
		}

		await prisma.attendance.update({
			where: { id: active.id },
			data: { check_out: new Date() }
		});

		return { success: true, message: '퇴근 처리되었습니다.' };
	}
};
