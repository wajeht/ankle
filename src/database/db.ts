import { PrismaClient } from '@prisma/client';
import { redis as redisConfig } from '../config/config';
import Redis from 'ioredis';
import { logger } from '../utils/utils';

declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

const prisma =
	global.prisma ||
	new PrismaClient({
		log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
	});

if (process.env.NODE_ENV !== 'production') {
	global.prisma = prisma;
}

const redis = new Redis({
	port: redisConfig.port,
	host: redisConfig.host,
	password: redisConfig.password,
	maxRetriesPerRequest: null,
});

redis.on('error', (error: Error) => {
	logger.error('Error initializing Redis:', error);
	process.exit(1);
});

export { redis };
export const db = prisma;
