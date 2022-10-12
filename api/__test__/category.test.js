const { app, server } = require('../../server');
const request = require('supertest');
var sinon = require("sinon");
const db = require('../../database/models');

afterEach(() => {
    server.close();
});

let randomNum = Math.floor(Math.random()*9999);

describe('TEST EXITO 200 ', () => {
    describe('GET', () => {
        test('get /category', async () => {
            const response = await request(app).get('/api/v2/category');
            expect(response.statusCode).toBe(200);
            });
        });
    describe('POST', () => {
        test('/category', async () => {
            const response = await request(app).post('/api/v2/category').send({
                "name": 'prueba '+ randomNum,
            });
            expect(response.statusCode).toBe(200);
        });
    });

    describe('DELETE', () => {
        test('delete category  ', async () => {
            const newCategory = await request(app).post('/api/v2/category').send({
                "name": 'prueba  15',
            });
            const id =newCategory._body.id;
                const response = await request(app).delete(`/api/v2/category/${id}`);
                expect(response.statusCode).toBe(200);
            });
        });
});
describe('TEST VALORES INVALIDOS',() => {
    describe('DELETE', () => {
        test('delete category id invalida  ', async () => {
            const response = await request(app).delete(`/api/v2/category/696969`);
            expect(response.statusCode).toBe(404);
        });
    });
    
    describe('TEST 500 ', () => {
        describe('GET', () => {
            test('get /category', async () => {
                let stub = sinon.stub(db.category,'findAll').throws();
                const response = await request(app).get('/api/v2/category');
                stub.restore();
                expect(response.statusCode).toBe(500);
            });
            describe('POST', () => {
                test('Crear con nombre existente', async () => {
                    let stub = sinon.stub(db.category,'create').throws();
                    const response = await request(app).post('/api/v2/category/').send({
                    });
                    stub.restore();
                    expect(response.statusCode).toBe(500);
                });
                describe('DELETE', () => {
                    test('delete category   ', async () => {
                        let stub = sinon.stub(db.category,'destroy').throws();
                        const response = await request(app).delete(`/api/v2/category/2`);
                        stub.restore();
                        expect(response.statusCode).toBe(500);
                    });
                });
            })
        });
        })
    });