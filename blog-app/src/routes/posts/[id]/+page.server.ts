import {prisma} from '$lib/server/prisma';
import { error, fail } from '@sveltejs/kit';
import type {Actions, PageServerLoad} from './$types';

export const load: PageServerLoad = async ({params}) => {
    const post = await prisma.posts.findUnique({
        where:{ 
            id : Number(params.id)
        },
        include: {
            users: true,
            comments: {
                include: {
                    users: true
                }
            }
        }
    });

    if (!post) {
        throw error(404, '게시글을 찾을 수 없습니다');
    }
    return { post };
}

export const actions : Actions = {
    createComment: async ({request, params, locals}) => {    
        if(!locals.user){
            return fail(401, { message: '로그인이 필요합니다' });
        }

        const formData = await request.formData();
        const content = formData.get('content');
        
        if (!content || typeof content !== 'string') {
            return fail(400, { message: '댓글 내용을 입력해주세요' });
        }

        await prisma.comments.create({
            data: {
                content: content,
                post_id: Number(params.id),
                user_id: locals.user.id
            }
        });


    }
}