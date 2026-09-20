import {prisma} from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({locals}) => {
    if(!locals.user){
        throw redirect(303, '/login');
    }
    return {};
};

export const actions: Actions = {
    createPost: async ({request, locals}) => {
        if(!locals.user){
            return { status: 401, body: { message: '로그인이 필요합니다' } };
        }

        const formData = await request.formData();
        const title = formData.get('title');
        const subtitleValue = formData.get('subtitle');

        const subtitle = subtitleValue && typeof subtitleValue === 'string' ? subtitleValue : null;

        const content = formData.get('content');

        if (!title || typeof title !== 'string' || !content || typeof content !== 'string') {
            return { status: 400, body: { message: '제목과 내용은 필수 입력값 입니다.' } };
        }

        const post = await prisma.posts.create({
            data: {
                title : title,
                subtitle : subtitle, 
                content : content,
                user_id : locals.user.id
            }
        });

        throw redirect(303, `/posts/${post.id}`);
    }
}
