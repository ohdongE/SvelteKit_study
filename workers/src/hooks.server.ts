import { prisma } from '$lib/server/prisma';
import { SESSION_COOKIE } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

/** 세션 쿠키로 로그인 유저를 locals에 설정 (만료 세션은 삭제) */
export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(SESSION_COOKIE);

	if (sessionId) {
		const session = await prisma.sessions.findUnique({
			where: { id: sessionId },
			include: {
				users: {
					include: { roles: true }
				}
			}
		});

		if (session && session.expired_at > new Date()) {
			event.locals.user = {
				id: session.users.id,
				name: session.users.name,
				login_id: session.users.login_id,
				role: session.users.roles.name,
				group_id: session.users.group_id
			};
		} else {
			if (session) await prisma.sessions.deleteMany({ where: { id: sessionId } });
			event.cookies.delete(SESSION_COOKIE, { path: '/' });
		}
	}

	return resolve(event);
};
