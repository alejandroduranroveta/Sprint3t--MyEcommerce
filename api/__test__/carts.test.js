const { app, server } = require('../../server');
const request = require('supertest');
var sinon = require("sinon");
const db = require('../../database/models');

afterEach(() => {
    server.close();
});

const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RfbmFtZSI6IkJydW5vIiwibGFzdF9uYW1lIjoiRnVsY28iLCJlbWFpbCI6ImJydW5vLmZ1bGNvQG91dGxvb2suY29tIiwidXNlcm5hbWUiOiJicnVub2YiLCJwcm9maWxlX3BpYyI6Imh0dHBzOi8vaWJiLmNvL3pGNW1ydFgiLCJyb2xlIjoiR29kIiwiaWF0IjoxNjY1NTA5MzY2LCJleHAiOjM3NjY1NTA1NzY2fQ.d9BfFQ5jnBGJpNlQWWOHz_BRy3l1GXYyaEWr2yRPj7MTNcUk6TbyV23qX6DoHOSKszcd9cqfD3ebvZIdkRRd8g";
const tokenVencido = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RfbmFtZSI6IkJydW5vIiwibGFzdF9uYW1lIjoiRnVsY28iLCJlbWFpbCI6ImJydW5vLmZ1bGNvQG91dGxvb2suY29tIiwidXNlcm5hbWUiOiJicnVub2YiLCJwcm9maWxlX3BpYyI6Imh0dHBzOi8vaWJiLmNvL3pGNW1ydFgiLCJyb2xlIjoiR29kIiwiaWF0IjoxNjY0Mzc1MDMyLCJleHAiOjE2NjQzNzg2MzJ9.ewdeBDT7nmLNgK0FDT_hn5YMm0ptgKcRbVRPff0NVSL20ekylx9_7IUgwHJhvqVWz7-K-Y8jGko89NPEirv7Nw";
const rutaGet = '/api/v2/carts/1';
const rutaPut = 'api/v2/carts/1';

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
        });
        test('Error de servidor', async () => {
            var stub = sinon.stub(db.carts, 'findByPk').throws();
            const response = await request(app).get(rutaGet).auth(token, { type: 'bearer' });
            stub.restore();
            expect(response.statusCode).toEqual(500);
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
    });

    describe('PUT /carts', () => {
        test('Actualiza a un cart vacio', async () => {
            const response = await request(app).put(rutaGet).auth(token, {type: 'bearer'});
            expect(response.statusCode).toBe(200);
        });
        test('Actualiza a un cart con productos y cantidades', async () => {
            const response = await request(app).put(rutaGet).auth(token, {type: 'bearer'}).send({
                cart : [{
                    product: 1,
                    quantity: 2
                },{
                    product: 2,
                    quantity: 3
                }]
            });
            expect(response.statusCode).toBe(200)
        });
        test('Actualiza a un cart con producto inexistente y cantidades', async () => {
            const response = await request(app).put(rutaGet).auth(token, {type: 'bearer'}).send({
                cart : [{
                    product: 999,
                    quantity: 2
                }]
            });
            expect(response.statusCode).toBe(404)
        });
        test('Actualiza a un cart con producto existente y cantidades muy altas', async () => {
            const response = await request(app).put(rutaGet).auth(token, {type: 'bearer'}).send({
                cart : [{
                    product: 1,
                    quantity: 9000
                }]
            });
            expect(response.statusCode).toBe(400)
        });
        test('Actualiza a un cart con muchos productos y cantidades', async () => {
            const response = await request(app).put(rutaGet).auth(token, {type: 'bearer'}).send({
                cart : [{
                    product: 1,
                    quantity: 2
                },{
                    product: 2,
                    quantity: 3
                },
                {
                    product: 3,
                    quantity: 2
                }]
            });
            expect(response.statusCode).toBe(200)
        });
        test('Error de servidor', async () => {
            var stub = sinon.stub(db.carts_has_products, 'create').throws();
            const response = await request(app).put(rutaGet).auth(token, {type: 'bearer'}).send({
                cart : [{
                    product: 1,
                    quantity: 2
                },{
                    product: 2,
                    quantity: 3
                }]
            });
            stub.restore();
            expect(response.statusCode).toEqual(500);
        })
    })

});
