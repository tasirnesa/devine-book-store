const request = require('supertest');
const app = require('../../src/app');

describe('GET /api/health', () => {
    it('should return status ok', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
    });
});

describe('GET /api/books', () => {
    it('should return paginated book list', async () => {
        const res = await request(app).get('/api/books');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('pagination');
    });
});

describe('GET /api/languages', () => {
    it('should return list of languages', async () => {
        const res = await request(app).get('/api/languages');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});
