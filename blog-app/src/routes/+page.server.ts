import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const posts = await prisma.posts.findMany({
    include: { users: true },
    orderBy: { created_at: 'desc' }
  });

  return { posts };
};