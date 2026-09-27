import { homeOf } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// 로그인 상태면 자기 역할 페이지로, 아니면 로그인 페이지로
export const load: PageServerLoad = async ({ locals }) => {
	throw redirect(303, locals.user ? homeOf(locals.user.role) : '/login');
};
