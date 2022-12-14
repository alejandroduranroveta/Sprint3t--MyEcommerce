const { app, server } = require('../../server');
const request = require('supertest');
var sinon = require('sinon');
const db = require('../../database/models');

afterEach(() => {
    server.close();
});

const token = process.env.TOKEN;
const tokenVencido = process.env.TOKEN_VENCIDO;
let randomNum = Math.floor(Math.random()*9999);

describe('ENDPOINTS TEST', () => {

    /*----------------------------------------------------------------*/
    /*----------------------------------------------------------------*/
    describe('GET', () => {

        describe('Status 200', () => {
            test('Devuelve imágen con ID 1, RUTA /pictures/1', async () => {
                const response = await request(app).get('/api/v2/pictures/1').auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(200);
            });
            test('Devuelve las imágenes asociadas al producto con ID 1, RUTA /products/1/pictures', async () => {
                const response = await request(app).get('/api/v2/products/1/pictures').auth(token, { type: 'bearer' });
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
            test('Product_id no es un número válido, RUTA /pictures', async () => {
                const pictureTest = {
                    img: "www.abcabcabc.com/123123",
                    description: "imagen de prueba",
                    product_id: 99999
                };
                const response = await request(app).post('/api/v2/pictures').send(pictureTest).auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(400);
            });
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
                    const response = await request(app).put('/api/v2/pictures/abc').auth(token, { type: 'bearer' });
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
                test('No existe picture con ID 3333, RUTA /pictures/3333', async () => {
                    const response = await request(app).put('/api/v2/pictures/3333').auth(token, { type: 'bearer' });
                    expect(response.statusCode).toBe(400);
                });
                test('No se puede modificar imagen igual a existente, RUTA /pictures/3', async () => {
                    const pictureTest = {
                        img: "https://ibb.co/tpJVMgY",
                        description: "Platanos extrañamente amarillos",
                        product_id: 2
                    };
                    const response = await request(app).put('/api/v2/pictures/2').send(pictureTest).auth(token, { type: 'bearer' });
                    expect(response.statusCode).toBe(400);
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
                    };
                    newPicture = await request(app).post('/api/v2/pictures').send(pictureTest).auth(token, { type: 'bearer' });
                    const id = newPicture._body.pic.id;
                    const response = await request(app).delete(`/api/v2/pictures/${id}`).auth(token, { type: 'bearer' });
                    expect(response.statusCode).toBe(200);
                });
            });
        });

        describe('Status 400', () => {
            test('No existe picture con ID 3333', async () => {
                const response = await request(app).delete('/api/v2/pictures/3333').auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(400);
            });
        });
    });






describe('TOKEN TEST', () => {

    /*----------------------------------------------------------------*/
    /*----------------------------------------------------------------*/
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

        /*----------------------------------------------------------------*/
        /*----------------------------------------------------------------*/
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

    /*----------------------------------------------------------------*/
    /*----------------------------------------------------------------*/
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

    /*----------------------------------------------------------------*/
    /*----------------------------------------------------------------*/
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

    /*----------------------------------------------------------------*/
    /*----------------------------------------------------------------*/
    describe('GET', () => {
        test('Tipos de datos correctos en body (PIC)', async () => {
            const response = await request(app).get('/api/v2/pictures/3').send({
            }).auth(token, { type: 'bearer' });
            expect(response.body.pic).toEqual(expect.objectContaining({
                img: expect.any(String),
                description: expect.any(String),
                product_id: expect.any(Number),
            }));
        });
    });

    /*----------------------------------------------------------------*/
    /*----------------------------------------------------------------*/
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

    /*----------------------------------------------------------------*/
    /*----------------------------------------------------------------*/
    describe('PUT', () => {
        test('Tipos de datos correctos en body (diferentes a la bd)', async () => {
            const response = await request(app).put('/api/v2/pictures/3').send({
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
        test('Si ID no es válido, Devuleve String', async () => {
            const response = await request(app).put('/api/v2/pictures/abc').send()
            .auth(token, { type: 'bearer' });
            expect(response.body).toEqual(expect.objectContaining({
                msg: expect.any(String)
            }));
        });
    });

    /*----------------------------------------------------------------*/
    /*----------------------------------------------------------------*/
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
                expect(response.body).toEqual(expect.objectContaining({
                    msg: expect.any(String),
                    picDel: expect.any(Number)
                }));
            });
        });
    });
});






describe('SERVER ERROR', () => {
    var stub;
        /*----------------------------------------------------------------*/
        /*----------------------------------------------------------------*/
    describe('GET', () => {
        
        test('Status 500, RUTA /pictures/1', async () => {
            stub = sinon.stub(db.pictures, 'findByPk').throws();
            const response = await request(app).get('/api/v2/pictures/1').auth(token, { type: 'bearer' });
            stub.restore();
            expect(response.statusCode).toBe(500);
        });
        test('Status 500, RUTA /products/1/pictures', async () => {
            stub = sinon.stub(db.pictures, 'findAll').throws();
            const response = await request(app).get('/api/v2/products/1/pictures').auth(token, { type: 'bearer' });
            stub.restore();
            expect(response.statusCode).toBe(500);
        });
        test('Status 500, QUERY /pictures/?product_id=1', async () => {
            stub = sinon.stub(db.pictures, 'findOne').throws();
            const response = await request(app).get('/api/v2/pictures/?product_id=1').auth(token, { type: 'bearer' });
            stub.restore();
            expect(response.statusCode).toBe(500);
        });
    });

    describe('POST', () => {

        /*----------------------------------------------------------------*/
        /*----------------------------------------------------------------*/
        test('Status 500, RUTA /pictures', async () => {
            const pictureTest = {
                img: "www.imagen.com/" + randomNum,
                description: "Ejemplo de una descriptción",
                product_id: 1
            };
            stub = sinon.stub(db.pictures, 'create').throws();
            const response = await request(app).post('/api/v2/pictures').send(pictureTest).auth(token, { type: 'bearer' });
            stub.restore();
            expect(response.statusCode).toBe(500);
        });
    });

    /*----------------------------------------------------------------*/
    /*----------------------------------------------------------------*/
    describe('PUT', () => {

        const pictureTest = {
            img: "www.probandoandoimg.com/abcabc/" + randomNum,
            description: "imagen de prueba",
            product_id: 2
        };
        test('Status 500', async () => {
            stub = sinon.stub(db.pictures, 'findByPk').throws();
            const response = await request(app).put('/api/v2/pictures/4').send(pictureTest).auth(token, { type: 'bearer' });
            stub.restore();
            expect(response.statusCode).toBe(500);
        });

    });

    /*----------------------------------------------------------------*/
    /*----------------------------------------------------------------*/
    describe('DELETE', () => {
        let newPicture;
        const pictureTest = {
            img: "www.imagen.com/" + randomNum,
            description: "Ejemplo de una descriptción",
            product_id: 1
        }
        test('Status 500, Ruta /:id', async () => {
            stub = sinon.stub(db.pictures, 'destroy').throws();
            newPicture = await request(app).post('/api/v2/pictures').send(pictureTest).auth(token, { type: 'bearer' });
                const id = newPicture._body.pic.id;
                const response = await request(app).delete(`/api/v2/pictures/${id}`).auth(token, { type: 'bearer' });
                stub.restore();
                expect(response.statusCode).toBe(500);
        });


    });
});
