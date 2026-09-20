import type {PageServerLoad, Actions} from './$types';
import { prisma } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    const users = await prisma.users.findMany({
        include : { roles : true }
    });
    const roles = await prisma.roles.findMany();

    return { roles, users };
};

export const actions : Actions = {
    updateRole: async ({ request, locals }) => {
        if (locals.user?.roles !== "SUPER_ADMIN"){
            return fail(404, { message:"권한이 없습니다."});
        }

        const formData = await request.formData();
        const userId = Number(formData.get('userId'));
        const roleId = Number(formData.get('roleId'));

        await prisma.users.update({
            where : { id: userId },
            data : {role_id : roleId}
        })

        return {success:true};
    }
}