const { app, server } = require('../../server');
const request = require('supertest');
var sinon = require("sinon");
const db = require('../../database/models');

afterEach(() => {
    server.close();
});

const token = process.env.TOKEN;
const tokenVencido = process.env.TOKEN_VENCIDO;
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
    })

});
