import { prisma } from '$lib/server/prisma';
import { SESSION_COOKIE } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

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
			// 만료된 세션은 DB에서도 정리
			if (session) await prisma.sessions.deleteMany({ where: { id: sessionId } });
			event.cookies.delete(SESSION_COOKIE, { path: '/' });
		}
	}

	return resolve(event);
};
