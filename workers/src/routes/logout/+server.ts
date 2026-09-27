import { prisma } from '$lib/server/prisma';
import { SESSION_COOKIE } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/** 세션 삭제 후 로그인 페이지로 이동 */
export const POST: RequestHandler = async ({ cookies }) => {
	const sessionId = cookies.get(SESSION_COOKIE);

	if (sessionId) {
		await prisma.sessions.deleteMany({ where: { id: sessionId } });
		cookies.delete(SESSION_COOKIE, { path: '/' });
	}

	throw redirect(303, '/login');
};
