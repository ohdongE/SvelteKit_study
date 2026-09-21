import { fail, redirect, type Actions } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"
import type { PageServerLoad } from "./$types";

export const load : PageServerLoad = async() => {
    const groups = await prisma.groups.findMany();
    return {groups};
}
export const actions : Actions = {
    createUser: async ({request, locals}) =>{
        if(!locals.user || (locals.user.role !== "ADMIN" && locals.user.role !== "LEADER")){
            return fail(403, {message:"권한이 없습니다."});
        }

        const formData = await request.formData();
        const input_name = formData.get('input_name');
        const input_id = formData.get('input_id');
        const input_pw = formData.get('input_pw');
        const input_group = formData.get('select_group');
        
        if((!input_name || typeof input_name !== 'string') || (!input_id || typeof input_id !== 'string') || (!input_pw || typeof input_pw !== 'string')){
            return fail(403, {message:"이름 아이디 패스워드를 모두 입력 해주세요."});
        }

        let groupId: number | null;
        
        if(locals.user.role === "LEADER"){
            groupId = locals.user.group_id;
        } else{
            if(!input_group || typeof input_group !== 'string'){
                return fail(403,{message:"그룹을 선택하고 다시 시도해주세요."});
            }
            groupId = Number(input_group);
        }

        try{
            await prisma.users.create({
                data:{
                    name : input_name as string,
                    login_id : input_id as string,
                    phone : input_pw as string,
                    role_id : 3,
                    group_id : Number(groupId),
                    hourly_wage : 0
                }
            });
        } catch(err){
            if (err instanceof Error) {
                console.log(err.message);
            }
            return fail(400,{message:'이미 사용중인 로그인 ID 또는 전화번호 입니다.'});
        }       
        

        throw redirect(303, `/${locals.user.role.toLowerCase()}`);
    }
}