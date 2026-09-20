import type {PageServerLoad, Actions} from './$types';
import { prisma } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  const posts = await prisma.posts.findMany({
    include: { users: true },
    orderBy: { created_at: 'desc' }
  });

  return { posts };
};
export const actions : Actions = {
    deletePost: async ({params, request,locals}) => {
        if (["SUPER_ADMIN", "POST_ADMIN"].includes(locals.user?.roles ?? '')){
            return fail(404, { message: '권한이 없습니다' });
        }
        const formData = await request.formData();
        const postId = formData.get('postId');

        if (!postId || typeof postId !== 'string') {
            return fail(400, { message: '잘못된 게시물 ID입니다' });
        }
        
        await prisma.posts.delete({
            where: { id: Number(postId) }
        });
    }
};