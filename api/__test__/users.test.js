const { app, server } = require('../../server');
const request = require('supertest');

afterEach(() => {
    server.close();
});

describe('TEST USERS ENDPOINTS STATUS OK', () => {
    describe('GET', () => {
        test('Route status OK /users', async () => {
            const response = await request(app).get('/api/v2/users');
            expect(response.statusCode).toBe(200);
        });
        test('Route status OK /users/id', async () => {
            const response = await request(app).get('/api/v2/users/11');
            expect(response.statusCode).toBe(200);
        });
    });
    describe('POST', () => {
        test('Route status OK /users/login', async () => {
            const response = await request(app).post('/api/v2/users/login').send({
                username:"jeffg",
                password:"123456"
            });
            expect(response.statusCode).toBe(200);
        })});
    describe('POST', () => {
        test('Route status OK /users', async () => {
            const response = await request(app).post('/api/v2/users').send({
                first_name:"Cvcvcvc",
                last_name:"Lucas",
                email:"yukuyk@outlook.com",
                username:"adwad",
                password:"123456",
                profile_pic:"https://ibb.co/zF5mrtX",
                role:"God"
            });;
            expect(response.statusCode).toBe(201);
            
        })});
    describe('PUT', () => {
        test('Route status OK /users/login/id', async () => {
            const response = await request(app).put('/api/v2/users/13').send({
                first_name:"Juan",
                last_name:"Sape",
                email:"wqjdbqwbl@outlook.com",
                username:"adsdacw",
                password:"123456",
                profile_pic:"https://ibb.co/zF5mrtX",
                role:"God"
            });
            expect(response.statusCode).toBe(200);
        });});
    describe('DELETE', () => {
        test.only('Route status OK /users/id', async () => {
            const response = await request(app).delete('/api/v2/users/16');
            expect(response.statusCode).toBe(200);
        });
    });
});
describe('TEST USERS ENDPOINTS STATUS ERROR', () => {
    describe('GET', () => {
        test('Route status ERROR /users/id', async () => {
            const response = await request(app).get('/api/v2/users/99');
            expect(response.statusCode).toBe(404);
        });
    });
    describe('POST', () => {
        test('Route status ERROR /users/login', async () => {
            const response = await request(app).post('/api/v2/users/login')
            expect(response.statusCode).toBe(500);
        })});
    describe('POST', () => {
        test('Route status ERROR /users', async () => {
            const response = await request(app).post('/api/v2/users')
            expect(response.statusCode).toBe(500);
        })});
    describe('PUT', () => {
        test('Route status ERROR /users/login/id', async () => {
            const response = await request(app).put('/api/v2/users')
            expect(response.statusCode).toBe(404);
        });});
    describe('DELETE', () => {
        test('Route status ERROR /users/id', async () => {
            const response = await request(app).delete('/api/v2/users');
            expect(response.statusCode).toBe(404);
        });
    });
});
describe('TEST USERS ENDPOINT DATA', () => {
    describe('GET', () => {
        test('Is array in /api/v2/users', async() => {
            const response = await request(app).get('/api/v2/users');
            expect(response.body).toBeInstanceOf(Array);
        })
        test('Data type in /api/v2/users',async() => {
            const response = await request(app).get('/api/v2/users');
                response.body.forEach((user) => {
                    expect(user).toEqual(expect.objectContaining({
                    id: expect.any(Number),
                    first_name: expect.any(String),
                    last_name: expect.any(String),
                    email: expect.any(String),
                    username: expect.any(String),
                    profile_pic: expect.any(String),
                    role: expect.any(String)
                    })
                );
            });
        })
    });
    describe('POST', () => {
        test('Data type /api/v2/users', async() => {
            const response = await request(app).post('/api/v2/users').send({
                first_name:"sxdcd",
                last_name:"dcdcd",
                email:"adsacaccd@outlook.com",
                username:"xcx",
                password:"123456",
                profile_pic:"https://ibb.co/zF5mrtX",
                role:"God"
            });
            expect(response.body).toEqual(expect.objectContaining({
                first_name: expect.any(String),
                last_name: expect.any(String),
                email: expect.any(String),
                username: expect.any(String),
                profile_pic: expect.any(String),
                password: expect.any(String),
                role: expect.any(String)}))          
            });
            test('Data type in /api/v2/users/login',async() => {
                const response = await request(app).post('/api/v2/users/login').send({
                    username:"jeffg",
                    password:"123456"
                });
                expect(response.body).toEqual(expect.objectContaining({
                    success: expect.any(Boolean),
                    message: expect.any(String),
                    user: expect.objectContaining({
                        idUser: expect.any(Number),
                        username: expect.any(String),
                    }),
                    token: expect.any(String)
                }));
            });
    });
    describe('PUT', () =>{
        test.skip('Data type in /api/v2/users/4',async() => {
            const response = await request(app).post('/api/v2/users').send({
                first_name:"fvfv",
                last_name:"fvfv",
                email:"awdadadadawdwadasc@outlook.com",
                username:"fvf",
                password:"123456",
                profile_pic:"https://ibb.co/zF5mrtX",
                role:"God"
            });
            expect(response.body).toEqual(expect.objectContaining({
                first_name: expect.any(String),
                last_name: expect.any(String),
                email: expect.any(String),
                username: expect.any(String),
                profile_pic: expect.any(String),
                password: expect.any(String),
                role: expect.any(String)
            }));          
        });
    });
    describe('DELETE', () =>{
        test('Data type in /api/v2/users/',async() => {
            const response = await request(app).delete('/api/v2/users/35');
            expect(response.body).toEqual(expect.objectContaining({
                first_name: expect.any(String),
                last_name: expect.any(String),
                email: expect.any(String),
                username: expect.any(String),
                profile_pic: expect.any(String),
                password: expect.any(String),
                role: expect.any(String)
            })); 
        })
    })
})