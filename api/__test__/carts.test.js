const { app, server } = require('../../server');
const request = require('supertest');

afterEach(() => {
    server.close();
});

const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RfbmFtZSI6IkJydW5vIiwibGFzdF9uYW1lIjoiRnVsY28iLCJlbWFpbCI6ImJydW5vLmZ1bGNvQG91dGxvb2suY29tIiwidXNlcm5hbWUiOiJicnVub2YiLCJwcm9maWxlX3BpYyI6Imh0dHBzOi8vaWJiLmNvL3pGNW1ydFgiLCJyb2xlIjoiR29kIiwiaWF0IjoxNjY0ODI2MTk2LCJleHAiOjE2NjU2OTAxOTZ9.p202gFqeJop5Qs6kpbSL5e-9VFFEZRPWG7AczE9UhxxeF7TB5b-U0lWyiY0oWIv9OrtadEvBF77oESRJFGiSAw"
describe('Carts /api/v2/carts', () => {
    describe('GET', () => {

        test('ruta /products', async () => {
            const response = await request(app).get('/api/v2/carts/1').auth(token, { type: 'bearer' });
            expect(response.statusCode).toBe(200);
        });
    });
});
