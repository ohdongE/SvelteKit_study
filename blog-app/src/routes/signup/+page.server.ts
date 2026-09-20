import { prisma } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const actions: Actions = {
  checkEmail: async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const name = formData.get('name');

    if (!email || typeof email !== 'string') {
      return fail(400, { action: 'checkEmail', message: '이메일을 입력해주세요' });
    }

    if (!emailRegex.test(email)) {
      return fail(400, { action: 'checkEmail', message: '올바른 이메일 형식이 아닙니다', email });
    }

    const user = await prisma.users.findUnique({
      where: { email }
    });

    return { action: 'checkEmail', exists: !!user, email, name };
  },

  signup: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');

    if (
      !name || typeof name !== 'string' ||
      !email || typeof email !== 'string' ||
      !password || typeof password !== 'string'
    ) {
      return fail(400, { action: 'signup', message: '모든 항목을 입력해주세요' });
    }

    const existing = await prisma.users.findUnique({ where: { email } });
    if (existing) {
      return fail(400, { action: 'signup', message: '이미 사용 중인 이메일입니다' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await prisma.users.create({
        data: { name, email, password: hashedPassword }
      });
    } catch (err) {
      return fail(400, { action: 'signup', message: '회원가입에 실패했습니다' });
    }

    throw redirect(303, '/login');
  }
};