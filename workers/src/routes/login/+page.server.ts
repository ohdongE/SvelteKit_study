import { prisma } from '$lib/server/prisma';
import { homeOf, SESSION_COOKIE, SESSION_TTL_MS } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// 이미 로그인 상태면 자기 역할 페이지로
	if (locals.user) throw redirect(303, homeOf(locals.user.role));
	return {};
};

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const formData = await request.formData();
		const input_id = formData.get('login_id');
		const input_phone = formData.get('phone');

		if (!input_id || typeof input_id !== 'string') {
			return fail(400, { message: '아이디를 입력해 주세요.', login_id: '' });
		}
		if (!input_phone || typeof input_phone !== 'string') {
			return fail(400, { message: '전화번호를 입력해 주세요.', login_id: input_id });
		}

		const user = await prisma.users.findUnique({
			where: { login_id: input_id.trim() },
			include: { roles: true }
		});

		if (!user || user.phone !== input_phone.trim()) {
			return fail(400, {
				message: '아이디 또는 전화번호가 올바르지 않습니다.',
				login_id: input_id
			});
		}

		const sessionId = randomUUID();
		const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

		await prisma.sessions.create({
			data: {
				id: sessionId,
				user_id: user.id,
				expired_at: expiresAt
			}
		});

		cookies.set(SESSION_COOKIE, sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			expires: expiresAt
		});

		throw redirect(303, homeOf(user.roles.name));
	}
};
