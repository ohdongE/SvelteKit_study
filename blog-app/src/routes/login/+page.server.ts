import { prisma } from '$lib/server/prisma';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import bycrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const DUMMY_HASH = await bycrypt.hash('dummy-password', 10);

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
			return fail(400, { message: '이메일과 비밀번호를 입력해주세요' });
		}

		const user = await prisma.users.findUnique({ where: { email } });

		const isMatch = await bycrypt.compare(password, user?.password ?? DUMMY_HASH);

		if (!user || !isMatch) {
			return fail(400, { message: '이메일 또는 비밀번호가 올바르지 않습니다' });
		}

		let sessionId = randomUUID();
		let expiresAt = new Date(Date.now() + 1000 * 60 * 60);

		await prisma.sessions.create({
			data: {
				id: sessionId,
				user_id: user.id,
				expires_at: expiresAt
			}
		});

		cookies.set('session', sessionId, {
			path: '/',
			sameSite: 'strict',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			expires: expiresAt
		});

		throw redirect(303, '/');
	}
};