declare global {
	declare namespace Express {
		export interface Request {
			headers: {
				'x-forwarded-for': string | string[];
			};
			socket: {
				remoteAddress: string;
			};
		}
	}
}
