const { app, server } = require('../../server');
const request = require('supertest');

afterEach(() => {
    server.close();
});

const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RfbmFtZSI6IkJydW5vIiwibGFzdF9uYW1lIjoiRnVsY28iLCJlbWFpbCI6ImJydW5vLmZ1bGNvQG91dGxvb2suY29tIiwidXNlcm5hbWUiOiJicnVub2YiLCJwcm9maWxlX3BpYyI6Imh0dHBzOi8vaWJiLmNvL3pGNW1ydFgiLCJyb2xlIjoiR29kIiwiaWF0IjoxNjY0OTk0ODAwLCJleHAiOjE2Njg1OTEyMDB9.MYZRKjddfmmIbnIqu8QcSjS2BPEdnuAu8VJm_ciMXDYQlIsOiNfUuqFB3z09VwsS7J1_IhhBpaf2f4AP3d-hbw";
const tokenVencido = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RfbmFtZSI6IkJydW5vIiwibGFzdF9uYW1lIjoiRnVsY28iLCJlbWFpbCI6ImJydW5vLmZ1bGNvQG91dGxvb2suY29tIiwidXNlcm5hbWUiOiJicnVub2YiLCJwcm9maWxlX3BpYyI6Imh0dHBzOi8vaWJiLmNvL3pGNW1ydFgiLCJyb2xlIjoiR29kIiwiaWF0IjoxNjY0Mzc1MDMyLCJleHAiOjE2NjQzNzg2MzJ9.ewdeBDT7nmLNgK0FDT_hn5YMm0ptgKcRbVRPff0NVSL20ekylx9_7IUgwHJhvqVWz7-K-Y8jGko89NPEirv7Nw";
let randomNum = Math.random(100);

describe('ENDPOINTS TEST', () => {


    describe('GET', () => {

        describe('Status 200', () => {
            test('Devuelve imágen con ID 1 si existe, RUTA /pictures/1', async () => {
                const response = await request(app).get('/api/v2/pictures/1').auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(200);
            });
            test('Devuelve las imágenes asociadas al producto con ID 1, RUTA /products/1/pictures', async () => {
                const response = await request(app).get('/api/v2/products/3/pictures').auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(200);
            });
            test('Devuelve las imágenes asociadas al producto con ID 1, QUERY /pictures/?product_id=1', async () => {
                const response = await request(app).get('/api/v2/pictures/?product_id=1').auth(token, { type: 'bearer' });
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
            test('No existe picture con ID 9999, RUTA /pictures/9999', async () => {
                const response = await request(app).get('/api/v2/pictures/9999').auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(404);
            });
        });
    });
    /*----------------------------------------------------------------*/
    /*----------------------------------------------------------------*/
    describe('POST', () => {

        describe('Status 201', () => {
            test('Crear una imagen, RUTA /pictures', async () => {
                const pictureTest = {
                    img: "www.imagen.com/" + randomNum,
                    description: "Ejemplo de una descriptción",
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
                test('Modificar una imágen, RUTA /pictures/3', async () => {
                    const pictureTest = {
                        img: "www.exampleimg.com/abcabc" + randomNum,
                        description: "imagen de prueba",
                        product_id: 2
                    };
                    const response = await request(app).put('/api/v2/pictures/3').send(pictureTest).auth(token, { type: 'bearer' });
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
                    const response = await request(app).put('/api/v2/pictures/3').send(pictureTest).auth(token, { type: 'bearer' });
                    expect(response.statusCode).toBe(400);
                });
                test('La URL es obligatoria (img), RUTA /pictures/3', async () => {
                    const pictureTest = {
                        img: "",
                        description: "imagen de prueba",
                        product_id: 2
                    };
                    const response = await request(app).put('/api/v2/pictures/3').send(pictureTest).auth(token, { type: 'bearer' });
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
            let newPicture;
            describe('Status 200', () => {
                test('Eliminar imagen creada, Ruta /:id', async () => {
                    const pictureTest = {
                        img: "www.imagen.com/" + randomNum,
                        description: "Ejemplo de una descriptción",
                        product_id: 1
                    }
                    newPicture = await request(app).post('/api/v2/pictures').send(pictureTest).auth(token, { type: 'bearer' });
                    const id = newPicture._body.pic.id;
                    const response = await request(app).delete(`/api/v2/pictures/${id}`).auth(token, { type: 'bearer' });
                    expect(response.statusCode).toBe(200);
                });
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







describe('TOKEN TEST', () => {


    describe('GET', () => {
        describe('Status 200', () => {
            test('Token correcto', async () => {
                const response = await request(app).get("/api/v2/pictures/1").auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(200);
            });
        });
        describe('Status 401', () => {
            test('Token vencido', async () => {
                const response = await request(app).get("/api/v2/pictures/1").auth(tokenVencido, { type: 'bearer' });
                expect(response.statusCode).toBe(401);
            });
        });
        describe('Status 400', () => {
            test('Token faltante', async () => {
                const response = await request(app).get("/api/v2/pictures/1");
                expect(response.statusCode).toBe(400);
            });
        });

    });

    describe('POST', () => {

        const pictureTest = {
            img: "www.imagen.com",
            description: "una descripción",
            product_id: 1
        };
        describe('Status 201', () => {
            test('Token correcto', async () => {
                const response = await request(app).post("/api/v2/pictures").send(pictureTest).auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(201);
            });
        });
        describe('Status 401', () => {
            test('Token vencido', async () => {
                const response = await request(app).post("/api/v2/pictures").send(pictureTest).auth(tokenVencido, { type: 'bearer' });
                expect(response.statusCode).toBe(401);
            });
        });
        describe('Status 400', () => {
            test('Token faltante', async () => {
                const response = await request(app).post("/api/v2/pictures").send(pictureTest);
                expect(response.statusCode).toBe(400);
            });
        });
    });

    describe('PUT', () => {

        const pictureTest = {
            img: "www.probandoandoimg.com/abcabc/" + randomNum,
            description: "imagen de prueba",
            product_id: 2
        };
        test('Token correcto', async () => {
            const response = await request(app).put('/api/v2/pictures/3').send(pictureTest).auth(token, { type: 'bearer' });
            expect(response.statusCode).toBe(200);
        });
        test('Token vencido', async () => {
            const response = await request(app).put('/api/v2/pictures/3').send(pictureTest).auth(tokenVencido, { type: 'bearer' });
            expect(response.statusCode).toBe(401);
        });
        test('Token faltante', async () => {
            const response = await request(app).put('/api/v2/pictures/3').send(pictureTest);
            expect(response.statusCode).toBe(400);
        });
    });

    describe('DELETE', () => {
        let newPicture;
        let id;
        test('Token correcto', async () => {
            const pictureTest = {
                img: "www.imagen.com/" + randomNum,
                description: "Ejemplo de una descriptción",
                product_id: 1
            }
            newPicture = await request(app).post('/api/v2/pictures').send(pictureTest).auth(token, { type: 'bearer' });
            id = newPicture._body.pic.id;
            const response = await request(app).delete(`/api/v2/pictures/${id}`).auth(token, { type: 'bearer' });
            expect(response.statusCode).toBe(200);
        });
        test('Token vencido', async () => {
            const response = await request(app).delete(`/api/v2/pictures/${id}`).auth(tokenVencido, { type: 'bearer' });
            expect(response.statusCode).toBe(401);
        });
        test('Token faltante', async () => {
            const response = await request(app).delete(`/api/v2/pictures/${id}`)
            expect(response.statusCode).toBe(400);
        });
    });
});




describe('DATA TYPES TEST', () => {

    describe('GET', () => {
        test('Tipos de datos correctos en body (PIC)', async () => {
            const response = await request(app).get('/api/v2/pictures/200').send({
            }).auth(token, { type: 'bearer' });
            expect(response.body.pic).toEqual(expect.objectContaining({
                img: expect.any(String),
                description: expect.any(String),
                product_id: expect.any(Number),
            }));
        });
    });

    describe('POST', () => {
        test('Tipos de datos correctos en body (PIC)', async () => {
            const response = await request(app).post('/api/v2/pictures').send({
                img: "www.example.com",
                description: "example description",
                product_id: 3,
            }).auth(token, { type: 'bearer' });
            expect(response.body.pic).toEqual(expect.objectContaining({
                img: expect.any(String),
                description: expect.any(String),
                product_id: expect.any(Number),
            }));
        });
    });

    describe('PUT', () => {
        test('Tipos de datos correctos en body (diferentes a la bd)', async () => {
            let randomNum = Math.random(100);
            const response = await request(app).put('/api/v2/pictures/13').send({
                product_id: 3,
                img: "www.example.com/" + randomNum,
                description: "example description",
            }).auth(token, { type: 'bearer' });
            expect(response.body).toEqual(expect.objectContaining({
                img: expect.any(String),
                description: expect.any(String),
                product_id: expect.any(Number),
                msg: expect.any(String)
            }));
        });

    });
    describe('DELETE', () => {
        let newPicture;
        describe('Status 200', () => {
            test('Eliminar imagen creada, Ruta /pictures/:id', async () => {
                const pictureTest = {
                    img: "www.imagen.com/" + randomNum,
                    description: "Ejemplo de una descriptción",
                    product_id: 1
                }
                newPicture = await request(app).post('/api/v2/pictures').send(pictureTest).auth(token, { type: 'bearer' });
                const id = newPicture._body.pic.id;
                const response = await request(app).delete(`/api/v2/pictures/${id}`).auth(token, { type: 'bearer' });
                console.log(response.body)
                expect(response.body).toEqual(expect.objectContaining({
                    msg: expect.any(String),
                    picDel: expect.any(Number)
                }));
            });
        });
    });
});


describe('SERVER ERROR', () => {


    describe('GET', () => {

        test.skip('Status 500, RUTA /pictures/23', async () => {
            const response = await request(app).get('/api/v2/pictures/23').auth(token, { type: 'bearer' });
            expect(response.statusCode).toBe(500);
        });
        test.skip('Status 500, RUTA /products/23/pictures', async () => {
            const response = await request(app).get('/api/v2/products/23/pictures').auth(token, { type: 'bearer' });
            expect(response.statusCode).toBe(500);
        });
        test.skip('Status 500, QUERY /pictures/?product_id=23', async () => {
            const response = await request(app).get('/api/v2/pictures/?product_id=23').auth(token, { type: 'bearer' });
            expect(response.statusCode).toBe(500);
        });
    });

    describe('POST', () => {

        test.skip('Status 500, RUTA /pictures', async () => {
            const pictureTest = {
                img: "www.imagen.com/" + randomNum,
                description: "Ejemplo de una descriptción",
                product_id: 1
            };
            const response = await request(app).post('/api/v2/pictures').send(pictureTest).auth(token, { type: 'bearer' });
            expect(response.statusCode).toBe(201);
        });
    });
    describe('PUT', () => {

        const pictureTest = {
            img: "www.probandoandoimg.com/abcabc/" + randomNum,
            description: "imagen de prueba",
            product_id: 2
        };
        test.skip('Status 500', async () => {
            const response = await request(app).put('/api/v2/pictures/23').send(pictureTest).auth(token, { type: 'bearer' });
            expect(response.statusCode).toBe(500);
        });

    });
    describe('DELETE', () => {
        test.skip('Status 500, Ruta /:id', async () => {
            const response = await request(app).delete('/api/v2/pictures/23').auth(token, { type: 'bearer' });
            expect(response.statusCode).toBe(500);
        });
    });
});
