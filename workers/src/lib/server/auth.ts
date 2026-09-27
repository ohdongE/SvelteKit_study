import { redirect } from '@sveltejs/kit';

export const ROLE_ID = {
	ADMIN: 1,
	LEADER: 2,
	WORKER: 3
} as const;

export type RoleName = keyof typeof ROLE_ID;

export const SESSION_COOKIE = 'session';
export const SESSION_TTL_MS = 1000 * 60 * 60;

const roleHome: Record<string, '/admin' | '/leader' | '/worker'> = {
	ADMIN: '/admin',
	LEADER: '/leader',
	WORKER: '/worker'
};

/** 역할별 홈 경로 */
export function homeOf(role: string) {
	return roleHome[role] ?? '/login';
}

/** 로그인·역할 확인 후 유저 반환, 실패 시 리다이렉트 */
export function requireRole(user: App.Locals['user'], ...roles: RoleName[]) {
	if (!user) throw redirect(303, '/login');
	if (!roles.includes(user.role as RoleName)) throw redirect(303, homeOf(user.role));
	return user;
}

/** FormData 값을 양의 정수 ID로 변환 (실패 시 null) */
export function toId(value: FormDataEntryValue | string | null) {
	if (typeof value !== 'string' || value.trim() === '') return null;
	const n = Number(value);
	return Number.isInteger(n) && n > 0 ? n : null;
}
