import type { LayoutServerLoad } from './$types';

/** 모든 페이지에 로그인 유저 전달 */
export const load: LayoutServerLoad = async ({ locals }) => {
	return { user: locals.user };
};
