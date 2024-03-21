import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(path.join(process.cwd(), '.env')) });

export const redis = {
	port: process.env.REDIS_PORT as unknown as number,
	host: process.env.REDIS_HOST as string,
	password: process.env.REDIS_PASSWORD as string,
};
