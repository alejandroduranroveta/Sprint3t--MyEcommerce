const { app, server } = require('../../server');
const request = require('supertest');

afterEach(() => {
    server.close();
});

//const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RfbmFtZSI6IkJydW5vIiwibGFzdF9uYW1lIjoiRnVsY28iLCJlbWFpbCI6ImJydW5vLmZ1bGNvQG91dGxvb2suY29tIiwidXNlcm5hbWUiOiJicnVub2YiLCJwcm9maWxlX3BpYyI6Imh0dHBzOi8vaWJiLmNvL3pGNW1ydFgiLCJyb2xlIjoiR29kIiwiaWF0IjoxNjY0NTY3NDAyLCJleHAiOjE2NjYwNzk0MDJ9.Vdo0zQ9T-BCCUVRII3133wnYaT5CC0jZ_zVBRNYDvZyMdLbU896pHT03lLWg2qWN2iajKbbmSnzGBwrNKhns2Q";

describe('TEST PRODUCTS', () => {
    describe('GET', () => {

        test('ruta /products', async () => {
            const response = await request(app).get('/api/v2/products');
            expect(response.statusCode).toBe(200);
        });
        test('ruta /search', async () => {
            const response = await request(app).get('/api/v2/products/search');
            expect(response.statusCode).toBe(200);
        });
        test('ruta /mostwanted', async () => {
            const response = await request(app).get('/api/v2/products/mostwanted');
            expect(response.statusCode).toBe(200);
        });
    });
    describe('POST', () => {
        test('ruta /products', async () => {
            const response = await request(app).post('/api/v2/products');
            expect(response.statusCode).toBe(200);
        });
    });
    describe('PUT', () => {
        test('ruta /products', async () => {
            const response = await request(app).put('/api/v2/products/id');
            expect(response.statusCode).toBe(200);
        });
    });
    describe('DELETE', () => {
        test('ruta /products', async () => {
            const response = await request(app).delete('/api/v2/products/id');
            expect(response.statusCode).toBe(200);
        });
    });
});
