import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';


export const load: PageServerLoad = async ({ locals }) => {
    const comments = await prisma.comments.findMany({
        include: { users: true, posts: true },
        orderBy: { created_at: 'desc' }
    });
    return { comments };
}

export const actions : Actions = {
    deleteComment: async ({params, request, locals}) => {
        if (["SUPER_ADMIN", "COMMENT_ADMIN"].includes(locals.user?.roles ?? '')){
            return fail(404, { message: '권한이 없습니다' });
        }

        const formData = await request.formData();
        const commentId = formData.get('commentId');

        if (!commentId || typeof commentId !== 'string'){
            return fail(400, { message: '잘못된 댓글 ID입니다' });
        }

        await prisma.comments.delete({
            where: { id: Number(commentId) }
        });
    }
}