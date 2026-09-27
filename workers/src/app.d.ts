declare global {
	namespace App {
		interface Locals {
			user?: {
				id: number;
				name: string;
				login_id: string;
				role: string;
				group_id: number | null;
			};
		}
	}
}

export {};
