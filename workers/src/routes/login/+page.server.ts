import { prisma } from "$lib/server/prisma"
import { fail, type Actions } from '@sveltejs/kit';
import { randomUUID } from 'crypto';

export const actions : Actions = {
    login: async ({ request, cookies }) => {
        const formData = await request.formData();
        const input_id = formData.get("input_id");
        const input_pw = formData.get("input_pw");

        if((!input_id || typeof input_id !== 'string') || (!input_pw || typeof input_pw !== 'string')){
            return fail(400,{message:"아이디 또는 패스워드를 입력해 주세요."});
        }

        const user = await prisma.users.findUnique({ where:{ login_id : input_id} });

        if(!user || user.phone !== input_pw){
            return fail(400, {message:"아이디 또는 패스워드가 틀렸습니다."});
        }

        const sessionId = randomUUID();
        const expiredAt = new Date(Date.now() + 1000 * 60 * 60);

        await prisma.sessions.create({
            data:{
                id : sessionId,
                user_id : user.id,
                expired_at : expiredAt
            }
        });

        cookies.set('session', sessionId, {
            path : '/',
            httpOnly : true,
            sameSite : 'strict',
            secure : process.env.NODE_ENV === 'production',
            expires : expiredAt
        });
        
        
    }
}