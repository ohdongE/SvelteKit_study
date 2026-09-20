import {prisma} from '$lib/server/prisma';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }) => {
    const sessionId = cookies.get('session');
    if (sessionId) {
        await prisma.sessions.deleteMany({
            where: { id: sessionId }
        });
        cookies.delete('session', { path: '/' });
    }
    throw redirect(303, '/');
}