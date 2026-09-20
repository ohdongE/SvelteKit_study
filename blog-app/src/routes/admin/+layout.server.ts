import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(303, '/login');
  }

  const allowedRoles = ['SUPER_ADMIN', 'POST_ADMIN', 'COMMENT_ADMIN'];
  if (!allowedRoles.includes(locals.user.roles)) {
    throw redirect(303, '/');
  }

  return { user: locals.user };
};