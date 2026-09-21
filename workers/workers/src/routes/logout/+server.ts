import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
  const sessionId = cookies.get('session');

  if (sessionId) {
    await prisma.sessions.deleteMany({ where: { id: sessionId } });
    cookies.delete('session', { path: '/' });
  }
  throw redirect(303, '/');
};