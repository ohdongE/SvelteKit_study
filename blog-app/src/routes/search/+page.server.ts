import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const query = url.searchParams.get('q');

  if (!query) {
    return { posts: [], query: '' };
  }

  const posts = await prisma.posts.findMany({
    where: {
      title: { contains: query }
    },
    include: { users: true }
  });

  return { posts, query };
};