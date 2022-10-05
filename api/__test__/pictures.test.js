const { app, server } = require('../../server');
const request = require('supertest');

afterEach(() => {
    server.close();
});

const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RfbmFtZSI6IkJydW5vIiwibGFzdF9uYW1lIjoiRnVsY28iLCJlbWFpbCI6ImJydW5vLmZ1bGNvQG91dGxvb2suY29tIiwidXNlcm5hbWUiOiJicnVub2YiLCJwcm9maWxlX3BpYyI6Imh0dHBzOi8vaWJiLmNvL3pGNW1ydFgiLCJyb2xlIjoiR29kIiwiaWF0IjoxNjY0OTk0ODAwLCJleHAiOjE2Njg1OTEyMDB9.MYZRKjddfmmIbnIqu8QcSjS2BPEdnuAu8VJm_ciMXDYQlIsOiNfUuqFB3z09VwsS7J1_IhhBpaf2f4AP3d-hbw";
const tokenVencido = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RfbmFtZSI6IkJydW5vIiwibGFzdF9uYW1lIjoiRnVsY28iLCJlbWFpbCI6ImJydW5vLmZ1bGNvQG91dGxvb2suY29tIiwidXNlcm5hbWUiOiJicnVub2YiLCJwcm9maWxlX3BpYyI6Imh0dHBzOi8vaWJiLmNvL3pGNW1ydFgiLCJyb2xlIjoiR29kIiwiaWF0IjoxNjY0Mzc1MDMyLCJleHAiOjE2NjQzNzg2MzJ9.ewdeBDT7nmLNgK0FDT_hn5YMm0ptgKcRbVRPff0NVSL20ekylx9_7IUgwHJhvqVWz7-K-Y8jGko89NPEirv7Nw";

describe('ENDPOINTS TEST', () => {


    describe('GET', () => {

        describe('Status 200', () => {
            test('Devuelve imágen con ID 10 si existe, RUTA /pictures/10', async () => {
                const response = await request(app).get('/api/v2/pictures/10').auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(200);
            });
            test('Devuelve las imágenes asociadas al producto con ID 3, RUTA /products/3/pictures', async () => {
                const response = await request(app).get('/api/v2/products/3/pictures').auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(200);
            });
            test('Devuelve las imágenes asociadas al producto con ID 3, QUERY /pictures/?product_id=3', async () => {
                const response = await request(app).get('/api/v2/pictures/?product_id=3').auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(200);
            });
        });

        describe('Status 400', () => {
            test('El ID "abc" no es un número válido, RUTA /pictures/abc', async () => {
                const response = await request(app).get('/api/v2/pictures/abc').auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(400);
            });
            test('El ID "abc" no es un número válido, RUTA /products/abc/pictures', async () => {
                const response = await request(app).get('/api/v2/products/abc/pictures').auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(400);
            });
            test('El ID "abc" no es un número válido, por QUERY /pictures/?product_id=abc', async () => {
                const response = await request(app).get('/api/v2/pictures/?product_id=abc').auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(400);
            });

        });

        describe('Status 404', () => {
            test('No existe picture con ID 999, RUTA /pictures/9999', async () => {
                const response = await request(app).get('/api/v2/pictures/9999').auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(404);
            });
        });
    });
    /*----------------------------------------------------------------*/
    /*----------------------------------------------------------------*/
    describe('POST', () => {

        describe('Status 200', () => {
            test.skip('Crear una imagen, RUTA /pictures', async () => {
                const pictureTest = {
                    img: "www.imagen.com",
                    description: "una descripción",
                    product_id: 1
                };
                const response = await request(app).post('/api/v2/pictures').send(pictureTest).auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(201);
            });
        });

        describe('Status 400', () => {
            test('Falta URL de imagen, RUTA /pictures', async () => {
                const pictureTest = {
                    img: "",
                    description: "imagen de prueba",
                    product_id: 1
                };
                const response = await request(app).post('/api/v2/pictures').send(pictureTest).auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(400);
            });
            test('Product_id no es un número válido, RUTA /pictures', async () => {
                const pictureTest = {
                    img: "www.abcabcabc.com/123123",
                    description: "imagen de prueba",
                    product_id: "abc"
                };
                const response = await request(app).post('/api/v2/pictures').send(pictureTest).auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(400);
            });
        });
        /*----------------------------------------------------------------*/
        /*----------------------------------------------------------------*/
        describe('PUT', () => {
            describe('Status 200', () => {
                test.skip('Modificar una imágen, RUTA /pictures/10', async () => {
                    const pictureTest = {
                        img: "www.probandoandoimg.com/abcabc",
                        description: "imagen de prueba",
                        product_id: 2
                    };
                    const response = await request(app).put('/api/v2/pictures/10').send(pictureTest).auth(token, { type: 'bearer' });
                    expect(response.statusCode).toBe(200);
                });
            });

            describe('Status 400', () => {
                test('El ID no es un número válido, RUTA /pictures/abc', async () => {
                    const response = await request(app).get('/api/v2/pictures/abc').auth(token, { type: 'bearer' });
                    expect(response.statusCode).toBe(400);
                });
                test('Falta product_id', async () => {
                    const pictureTest = {
                        img: "www.probandoandoimg.com/abcabc",
                        description: "imagen de prueba",
                        product_id: ""
                    };
                    const response = await request(app).put('/api/v2/pictures/10').send(pictureTest).auth(token, { type: 'bearer' });
                    expect(response.statusCode).toBe(400);
                });
                test('La URL es obligatoria (img), RUTA /pictures/10', async () => {
                    const pictureTest = {
                        img: "",
                        description: "imagen de prueba",
                        product_id: 2
                    };
                    const response = await request(app).put('/api/v2/pictures/10').send(pictureTest).auth(token, { type: 'bearer' });
                    expect(response.statusCode).toBe(400);
                });
            });

            describe('Status 404', () => {
                test('No existe picture con ID 3333, RUTA /pictures/3333', async () => {
                    const response = await request(app).get('/api/v2/pictures/3333').auth(token, { type: 'bearer' });
                    expect(response.statusCode).toBe(404);
                });
            });

        });

        /*----------------------------------------------------------------*/
        /*----------------------------------------------------------------*/
        describe('DELETE', () => {
            describe('Status 200', () => {
                test.skip('ruta /:id', async () => {
                    const response = await request(app).delete('/api/v2/pictures/10').auth(token, { type: 'bearer' });
                    expect(response.statusCode).toBe(200);
                });
            });
            describe('Status 400', () => {
                test('No existe picture con ID 3333', async () => {
                    const response = await request(app).get('/api/v2/pictures/3333').auth(token, { type: 'bearer' });
                    expect(response.statusCode).toBe(404);
                });
            });
        });
    });
});




describe('TOKEN TEST', () => {


    describe('GET', () => {

        test('Token correcto', async () => {
            const response = await request(app).get("/api/v2/pictures/10").auth(token, { type: 'bearer' });
            expect(response.statusCode).toBe(200);
        });
        test('Token vencido', async () => {
            const response = await request(app).get("/api/v2/pictures/10").auth(tokenVencido, { type: 'bearer' });
            expect(response.statusCode).toBe(401);
        });
        test('Token faltante', async () => {
            const response = await request(app).get("/api/v2/pictures/10");
            expect(response.statusCode).toBe(400);
        });
    });

    describe('POST', () => {

        const pictureTest = {
            img: "www.imagen.com",
            description: "una descripción",
            product_id: 1
        };
        test.skip('Token correcto', async () => {
            const response = await request(app).post("/api/v2/pictures").send(pictureTest).auth(token, { type: 'bearer' });
            expect(response.statusCode).toBe(201);
        });
        test('Token vencido', async () => {
            const response = await request(app).post("/api/v2/pictures").send(pictureTest).auth(tokenVencido, { type: 'bearer' });
            expect(response.statusCode).toBe(401);
        });
        test('Token faltante', async () => {
            const response = await request(app).post("/api/v2/pictures").send(pictureTest);
            expect(response.statusCode).toBe(400);
        });
    });

    describe('PUT', () => {

        const pictureTest = {
            img: "www.probandoandoimg.com/abcabc",
            description: "imagen de prueba",
            product_id: 2
        };
        test.skip('Token correcto', async () => {
            const response = await request(app).put('/api/v2/pictures/10').send(pictureTest).auth(token, { type: 'bearer' });
            expect(response.statusCode).toBe(200);
        });
        test('Token vencido', async () => {
            const response = await request(app).put('/api/v2/pictures/10').send(pictureTest).auth(tokenVencido, { type: 'bearer' });
            expect(response.statusCode).toBe(401);
        });
        test('Token faltante', async () => {
            const response = await request(app).put('/api/v2/pictures/10').send(pictureTest);
            expect(response.statusCode).toBe(400);
        });
    });

    describe('DELETE', () => {
            test.skip('Token correcto', async () => {
                const response = await request(app).delete('/api/v2/pictures/10').auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(200);
            });
            test.skip('Token vencido', async () => {
                const response = await request(app).delete('/api/v2/pictures/10').auth(tokenVencido, { type: 'bearer' });
                expect(response.statusCode).toBe(200);
            });
            test.skip('Token faltante', async () => {
                const response = await request(app).delete('/api/v2/pictures/10')
                expect(response.statusCode).toBe(200);
            });

    });
});

