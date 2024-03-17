import { it, expect } from 'vitest';
import { app as server } from './app';
import request from 'supertest';

const app = request(server);

it('should be able to reach healthz end point', async () => {
	const response = await app.get('/healthz');
	expect(response.status).toBe(200);
	expect((response as any).req.path).toBe('/healthz');
});
