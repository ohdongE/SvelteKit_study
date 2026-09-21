import { prisma } from "$lib/server/prisma";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    const sessionId = event.cookies.get('session');

    if(sessionId){
        const session = await prisma.sessions.findUnique({
            where:{ id : sessionId },
                include:{ 
                    users:{
                        include: { roles: true }
                    }
                }
        });
        if(session && session.expired_at > new Date()){
            event.locals.user = {
                id: session.users.id,
                name : session.users.name, 
                login_id : session.users.login_id,
                role : session.users.roles.name,
                group_id : session.users.group_id
            };
        }else{
            event.cookies.delete('session', {path:'/'});
        }
    }
    return resolve(event);
};