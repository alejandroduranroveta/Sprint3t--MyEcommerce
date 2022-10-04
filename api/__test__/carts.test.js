const { app, server } = require('../../server');
const request = require('supertest');

afterEach(() => {
    server.close();
});

const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RfbmFtZSI6IkJydW5vIiwibGFzdF9uYW1lIjoiRnVsY28iLCJlbWFpbCI6ImJydW5vLmZ1bGNvQG91dGxvb2suY29tIiwidXNlcm5hbWUiOiJicnVub2YiLCJwcm9maWxlX3BpYyI6Imh0dHBzOi8vaWJiLmNvL3pGNW1ydFgiLCJyb2xlIjoiR29kIiwiaWF0IjoxNjY0ODI2MTk2LCJleHAiOjE2NjU2OTAxOTZ9.p202gFqeJop5Qs6kpbSL5e-9VFFEZRPWG7AczE9UhxxeF7TB5b-U0lWyiY0oWIv9OrtadEvBF77oESRJFGiSAw";
const tokenVencido = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RfbmFtZSI6IkJydW5vIiwibGFzdF9uYW1lIjoiRnVsY28iLCJlbWFpbCI6ImJydW5vLmZ1bGNvQG91dGxvb2suY29tIiwidXNlcm5hbWUiOiJicnVub2YiLCJwcm9maWxlX3BpYyI6Imh0dHBzOi8vaWJiLmNvL3pGNW1ydFgiLCJyb2xlIjoiR29kIiwiaWF0IjoxNjY0Mzc1MDMyLCJleHAiOjE2NjQzNzg2MzJ9.ewdeBDT7nmLNgK0FDT_hn5YMm0ptgKcRbVRPff0NVSL20ekylx9_7IUgwHJhvqVWz7-K-Y8jGko89NPEirv7Nw";
const rutaGet = '/api/v2/carts/1';

describe('Carts /api/v2/carts', () => {
    describe('GET /carts Autenticacion', () => {
        test('Caso exito', async () => {
            const response = await request(app).get(rutaGet).auth(token, { type: 'bearer' });
            expect(response.statusCode).toBe(200);
        });
        test('Sin token', async () => {
            const response = await request(app).get(rutaGet);
            expect(response.statusCode).toBe(400);
        });
        test('Token vencido', async () => {
            const response = await request(app).get(rutaGet).auth(tokenVencido, {type: 'bearer'});
            expect(response.statusCode).toEqual(401);
        });
        test('Token sin especificar bearer', async () => {
            const response = await request(app).get(rutaGet).auth(token);
            expect(response.statusCode).toEqual(401);
        })
    });
    describe('GET /carts DataTypes', () => {
        test('Devuelve un objeto', async () => {
            const response = await request(app).get(rutaGet).auth(token, {type: 'bearer'});
            expect(response.body).toEqual(expect.objectContaining({}));
        });
        test('Tiene propiedad user', async () => {
            const response = await request(app).get(rutaGet).auth(token, {type: 'bearer'});
            expect(response.body).toEqual(expect.objectContaining({ id: expect.any(Number)}));
        });
        test('Usuario sin autenticar no tiene propiedades de cart', async () => {
            const response = await request(app).get(rutaGet);
            expect(response.body).not.toEqual(expect.objectContaining({ id: expect.any(Number)}));
        });
        test('Tiene propiedad cart', async () => {
            const response = await request(app).get(rutaGet).auth(token, {type: 'bearer'});
            expect(response.body).toEqual(expect.objectContaining({ cart: expect.any(Object)}));
        });
        test('La propiedad cart es un array de producto cantidad', async () => {
            const response = await request(app).get(rutaGet).auth(token, {type: 'bearer'});
            const carts = response.body.cart;
            carts.forEach(i =>{
                expect(i).toEqual(expect.objectContaining({
                    product: expect.any(Number),
                    quantity: expect.any(Number)})
                )
            })
        });
    })
});
