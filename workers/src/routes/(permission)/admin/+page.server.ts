import { requireRole } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

/** ADMIN 전용 */
export const load: PageServerLoad = async ({ locals }) => {
	requireRole(locals.user, 'ADMIN');
	return {};
};
