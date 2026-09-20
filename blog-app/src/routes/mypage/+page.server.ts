import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types"
import {prisma} from '$lib/server/prisma';

export const load: PageServerLoad = async ({locals}) => {
    if(!locals.user){
        throw redirect(303, '/login');
    }
    const user = await prisma.users.findUnique({
        where: { id: locals.user.id },
        select: { created_at: true }
    });

    return { createdAt: user?.created_at };
}