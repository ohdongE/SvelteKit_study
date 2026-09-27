import { homeOf } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/** 로그인 여부에 따라 역할 페이지 또는 로그인으로 이동 */
export const load: PageServerLoad = async ({ locals }) => {
	throw redirect(303, locals.user ? homeOf(locals.user.role) : '/login');
};
