const { app, server } = require('../../server');
const request = require('supertest');
var sinon = require('sinon');
var responseMock = sinon.mock(response);

afterEach(() => {
    server.close();
});

const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RfbmFtZSI6IkJydW5vIiwibGFzdF9uYW1lIjoiRnVsY28iLCJlbWFpbCI6ImJydW5vLmZ1bGNvQG91dGxvb2suY29tIiwidXNlcm5hbWUiOiJicnVub2YiLCJwcm9maWxlX3BpYyI6Imh0dHBzOi8vaWJiLmNvL3pGNW1ydFgiLCJyb2xlIjoiR29kIiwiaWF0IjoxNjY0OTk4MTQyLCJleHAiOjM3NjY0OTk0NTQyfQ.EPHXEEKuoxX01w9dhYv7n2LbgPSwrNSf4JzynCxm_FrT3Vgtoum1u9NoNGbAeqwIk85P8CWTYgweF5UQCk2KNw";
const tokenVencido = "123";


describe('TEST EXITO 200 ', () => {
    describe('GET', () => {
        
        test('get /products', async () => {
            const response = await request(app).get('/api/v2/products').auth(token,{ type: 'bearer' });
            expect(response.statusCode).toBe(200);
        });
        
        test('get /products/ID', async () => {
            const response = await request(app).get('/api/v2/products/1').auth(token, { type: 'bearer' });
            expect(response.statusCode).toBe(200);
        });
        
        test('get /search', async () => {
            const response = await request(app).get('/api/v2/products/search?q=alcon').auth(token, { type: 'bearer' });
            expect(response.statusCode).toBe(200);
        });
        test('get /category', async () => {
            const response = await request(app).get('/api/v2/products?category=1').auth(token, { type: 'bearer' });
            expect(response.statusCode).toBe(200);
        });

        test('get /mostwanted', async () => {
            const response = await request(app).get('/api/v2/products/mostwanted').auth(token, { type: 'bearer' });
            expect(response.statusCode).toBe(200);
        });
    });
    describe('POST', () => {
        test.skip('/products', async () => {
            const response = await request(app).post('/api/v2/products').send({
                "title": "unProducto",
                "description": "1",
                "category_id": 1,
                "price": 1,
                "stock": 1,
                "most_wanted": 1,
            }).auth(token, { type: 'bearer' });
            expect(response.statusCode).toBe(200);
        });
    });
    describe('PUT', () => {
        test('/products', async () => {
            const response = await request(app).put('/api/v2/products/50').send({
                "title": "unProductoModificado",
                "description": "1",
                "category_id": 1,
                "price": 1,
                "stock": 1,
                "most_wanted": 1,
            }).auth(token, { type: 'bearer' });
            expect(response.statusCode).toBe(200);
        })
    });
    describe('DELETE', () => {
        test.skip('Route status-ruta /products', async () => {
            const response = await request(app).delete('/api/v2/products/1').auth(token, { type: 'bearer' });
            expect(response.statusCode).toBe(200);
        });
    });
});

/******************************************************** */


describe('TOKEN VENCIDO ', () => {
    describe('GET', () => {
        test('ruta /products espera 401', async () => {
            const response = await request(app).get('/api/v2/products').auth(tokenVencido, { type: 'bearer' });
            expect(response.statusCode).toBe(401);
        });
        test('ruta /search espera 401', async () => {
            const response = await request(app).get('/api/v2/products/search/?q=&').auth(tokenVencido, { type: 'bearer' });
            expect(response.statusCode).toBe(401);
        });
        test('ruta /category espera 401', async () => {
            const response = await request(app).get('/api/v2/products?category=1').auth(tokenVencido, { type: 'bearer' });
            expect(response.statusCode).toBe(401);
        });

        test('ruta /mostwanted espera 401', async () => {
            const response = await request(app).get('/api/v2/products/mostwanted').auth(tokenVencido, { type: 'bearer' });
            expect(response.statusCode).toBe(401);
        });
    });
    describe('POST', () => {
        test('POST/products espera 401', async () => {
            const response =  await request(app).post('/api/v2/products').auth(tokenVencido,{ type: 'bearer' });
            expect(response.statusCode).toBe(401);
        });
    });
    describe('PUT', () => {
        test('PUT/products espera 401', async () => {
            const response =  await request(app).put('/api/v2/products/1000004').auth(tokenVencido,{ type: 'bearer' });
            expect(response.statusCode).toBe(401);
        });
    });

    describe('DELETE', () => {
        test('DELETE/products espera 401', async () => {
            const response = await request(app).delete('/api/v2/products/1').auth(tokenVencido,{ type: 'bearer' });;
            expect(response.statusCode).toBe(401);
        });
    });
});
    /******************************************************** */
    
describe('GET 404 TEST =', () => {
    describe('GET', () => {
        test.skip('lista de todos los productos vacia ', async () => {
            const response = await request(app).get('/api/v2/products').auth(token, { type: 'bearer' });
            expect(response.statusCode).toBe(404);
        });
        test('id producto not found ', async () => {
            const response = await request(app).get('/api/v2/products/98989898').auth(token, { type: 'bearer' });
            expect(response.statusCode).toBe(404);
        });
        test('/search sin resultados', async () => {
            const response = await request(app).get('/api/v2/products/search?q=*').auth(token, { type: 'bearer' });
            expect(response.statusCode).toBe(404);
            });
        });
        test('/category sin resultados ', async () => {
            const response = await request(app).get('/api/v2/products?category=6868686').auth(token, { type: 'bearer' });
            expect(response.statusCode).toBe(404);
        });
    });    

    
    /************************** */
    describe('PUT 400 TEST', () => {
            test('id invalido para modificar ', async () => {
                const response = (await request(app).put('/api/v2/products/9898')
                .send({
                    "title": "un product",
                    "price": 1,
                })
                .auth(token, { type: 'bearer' }));
                expect(response.statusCode).toBe(404);
            });    
            test('id null para modificar ', async () => {
                const response = (await request(app).put('/api/v2/products/a')
                .send({
                    "title": "un product",
                    "price": 1,
                })
                .auth(token, { type: 'bearer' }));
                expect(response.statusCode).toBe(404);
            });      
});
describe('NEED CORRECT INFO TEST - ERROR 400', () => {
        describe('POST - c', () => {
            test('sin titulo - se espera 400 ', async () => {
                const response = await request(app).post('/api/v2/products').send({
                        "title": "",
                        "price": 1,
                })
                .auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(400);
            });
            test('sin precio - se espera 400 ', async () => {
                const response = await request(app).post('/api/v2/products').send({
                        "title": "sin precio"
                })
                .auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(400);
            });
            test('precio negativo - se espera 400 ', async () => {
                const response = await request(app).post('/api/v2/products').send({
                        "title": "sin precio",
                        "price": -2,
                })
                .auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(400);
            });
            
            test('ruta /products', async () => {
                const response = await request(app).post('/api/v2/products').send({
                        "title": "productinho",
                        "description": "una description",
                        "price": 10,
                        "category_id": 696969,
                        "most_wanted": 0,
                        "stock": 1
                });
                expect(response.statusCode).toBe(400);
            });
            test('ruta /products', async () => {
                const response = await request(app).post('/api/v2/products').send({
                        "title": "productinho",
                        "description": "",
                        "price": -1,
                        "category_id": 1999999,
                        "most_wanted": 0,
                        "stock": -1
                });
                expect(response.statusCode).toBe(400);
            });
        });

        describe('PUT', () => {
            test.skip('Route status-ruta /products', async () => {
                const response = (await request(app).put('/api/v2/products/1'))
                expect(response.statusCode).toBe(404);
            });
        });
        describe('DELETE', () => {
            test.skip('Route status-ruta /products', async () => {
                const response = await request(app).delete('/api/v2/products/114');
                expect(response.statusCode).toBe(404);
            });
        });
    });




    describe('TEST FAIL 500 - Interrupcion ', () => {
        describe('GET', () => {
            
            test.skip('get /products', async () => {
                const response = await request(app).get('/api/v2/products').auth(token,{ type: 'bearer' });
                expect(response.statusCode).toBe(500);
            });
            
            test.skip('get /products/ID', async () => {
                const response = await request(app).get('/api/v2/products/1').auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(500);
            });
            
            test.skip('get /search', async () => {
                const response = await request(app).get('/api/v2/products/search?q=alcon').auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(500);
            });
            test.skip('get /category', async () => {
                const response = await request(app).get('/api/v2/products?category=1').auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(500);
            });
    
            test.skip('get /mostwanted', async () => {
                const response = await request(app).get('/api/v2/products/mostwanted').auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(500);
            });
        });
        describe('POST', () => {
            test.skip('/products', async () => {
                const response = await request(app).post('/api/v2/products').send({
                    "title": "unProducto",
                    "description": "1",
                    "category_id": 1,
                    "price": 1,
                    "stock": 1,
                    "most_wanted": 1,
                }).auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(500);
            });
        });
        describe('PUT', () => {
            test.skip('/products', async () => {
                const response = await request(app).put('/api/v2/products/50').send({
                    "title": "unProductoModificado",
                    "description": "1",
                    "category_id": 1,
                    "price": 1,
                    "stock": 1,
                    "most_wanted": 1,
                }).auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(500);
            })
        });
        describe('DELETE', () => {
            test.skip('Route status-ruta /products', async () => {
                const response = await request(app).delete('/api/v2/products/1').auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(500);
            });
        });
    });
 
//errores 500 hay que ver como hacerlo

    // test.skip('ruta /products', async () => {
        //     const response = await request(app).get('/api/v2/products');
        //     expect(response.statusCode).toBe(500);
 //});
 //create error 500

 //put modify 500 linea 138

 //mostwantes sin ninguno correcto


//  describe('/api/search route', () => {
//     it('should return a 500 when an error is encountered', async () => {
//       // stub an error
//       sinon.stub(itemQueries, 'search').throws(Error('db query failed'))
  
//       await request(app) // pass Express app to supertest
//         .post('/api/search') // call Express route we want to test
//         .send({term: 'blah', num: 1}) // pass normally expected, valid data in request body
//         .expect(500) // assert that we return a HTTP 500 response status code
//     })