const { app, server } = require('../../server');
const request = require('supertest');

afterEach(() => {
    server.close();
});

let randomNum = Math.floor(Math.random()*100);

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
            test.skip('get /category', async () => {
                const response = await request(app).get('/api/v2/category');
                expect(response.statusCode).toBe(500);
            });
            describe('POST', () => {
                test.skip('Crear con nombre existente', async () => {
                    const response = await request(app).post('/api/v2/category/').send({
                    });
                    expect(response.statusCode).toBe(500);
                });
                describe('DELETE', () => {
                    test.skip('delete category   ', async () => {
                        const response = await request(app).delete(`/api/v2/category/${Idcategory}`);
                        expect(response.statusCode).toBe(500);
                    });
                });
            })
        });
        })
    });