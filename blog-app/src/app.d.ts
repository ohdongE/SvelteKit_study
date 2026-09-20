// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: {
				id: number;
				name: string;
				email: string;
				roles: string;
			},
			post?: {
				id: number;
				user_id: number;
				title: string;
				subtitle: string;
				content: string;
				created_at: Date;
			}
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
