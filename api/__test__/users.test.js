const { app, server } = require('../../server');
const request = require('supertest');

afterEach(() => {
    server.close();
});
const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZmlyc3RfbmFtZSI6IkJydW5vIiwibGFzdF9uYW1lIjoiRnVsY28iLCJlbWFpbCI6ImJydW5vLmZ1bGNvQG91dGxvb2suY29tIiwidXNlcm5hbWUiOiJicnVub2YiLCJwcm9maWxlX3BpYyI6Imh0dHBzOi8vaWJiLmNvL3pGNW1ydFgiLCJyb2xlIjoiR29kIiwiaWF0IjoxNjY1NDMxMDU4LCJleHAiOjM3NjY1NDI3NDU4fQ.9n1hYoOu0RhP2vh_nthpB5Hs7fAnzlfvjfdiS_G7TY_iUdziNJFyaAYSWDtXGQA74-vTf-St4bSlDaEPifEnxA";

describe('TEST USERS ENDPOINTS STATUS OK', () => {
    describe('GET', () => {
        test('Route status OK /users', async () => {
            const response = await request(app).get('/api/v2/users').auth(token , { type: 'bearer' });
            expect(response.statusCode).toBe(200);
        });
        test('Route status OK /users/id', async () => {
            const response = await request(app).get('/api/v2/users/11').auth(token , { type: 'bearer' });
            expect(response.statusCode).toBe(200);
        });
    });
    describe('POST', () => {
        test('Route status OK /users/login', async () => {
            const response = await request(app).post('/api/v2/users/login').send({
                username:"v",
                password:"123456"
            }).auth(token , { type: 'bearer' });
            expect(response.statusCode).toBe(200);
        })});
    describe('POST', () => {
        test('Route status OK /users', async () => {
            const response = await request(app).post('/api/v2/users').send({
                first_name:"q",
                last_name:"q",
                email:"q@outlook.com",
                username:"q",
                password:"123456",
                profile_pic:"https://ibb.co/zF5mrtX",
                role:"God"
            }).auth(token , { type: 'bearer' });
            expect(response.statusCode).toBe(201);
        })});
    describe('PUT', () => {
        test('Route status OK /users/login/id', async () => {
            const response = await request(app).put('/api/v2/users/4').send({
                first_name:"w",
                last_name:"w",
                email:"w@outlook.com",
                username:"w",
                password:"123456",
                profile_pic:"https://ibb.co/zF5mrtX",
                role:"God"
            }).auth(token , { type: 'bearer' });
            expect(response.statusCode).toBe(200);
        });});  
    describe('DELETE', () => {
        test('Route status OK /users/id', async () => {
            const response = await request(app).delete('/api/v2/users/11').auth(token , { type: 'bearer' });
            expect(response.statusCode).toBe(200);
        });
    });
});

describe.skip('TEST USERS ENDPOINTS STATUS ERROR', () => {
    describe('GET', () => {
        test('Route status ERROR /users/id', async () => {
            const response = await request(app).get('/api/v2/users/99').auth(token , { type: 'bearer' });
            expect(response.statusCode).toBe(404);
        });
    });
    describe('POST', () => {
        test('Route status ERROR /users/login', async () => {
            const response = await request(app).post('/api/v2/users/login').auth(token , { type: 'bearer' })
            expect(response.statusCode).toBe(500);
        })});
    describe('POST', () => {
        test('Route status ERROR /users', async () => {
            const response = await request(app).post('/api/v2/users').auth(token , { type: 'bearer' })
            expect(response.statusCode).toBe(500);
        })});
    describe('PUT', () => {
        test('Route status ERROR /users/id', async () => {
            const response = await request(app).put('/api/v2/users/').auth(token , { type: 'bearer' })
            expect(response.statusCode).toBe(404);
        });});
    describe('DELETE', () => {
        test('Route status ERROR /users/id', async () => {
            const response = await request(app).delete('/api/v2/users').auth(token , { type: 'bearer' });
            expect(response.statusCode).toBe(404);
        });
    });
});

describe.skip('TEST USERS ENDPOINT DATA', () => {
    describe('GET', () => {
        test('Is array in /api/v2/users', async() => {
            const response = await request(app).get('/api/v2/users').auth(token , { type: 'bearer' });
            expect(response.body).toBeInstanceOf(Array);
        })
        test('Data type in /api/v2/users',async() => {
            const response = await request(app).get('/api/v2/users').auth(token , { type: 'bearer' });
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
        test('Data type in /api/v2/users/id',async() => {
            const response = await request(app).get('/api/v2/users/4').auth(token , { type: 'bearer' });
                    expect(response).toEqual(expect.objectContaining({
                    id: expect.any(Number),
                    first_name: expect.any(String),
                    last_name: expect.any(String),
                    email: expect.any(String),
                    username: expect.any(String),
                    profile_pic: expect.any(String),
                    role: expect.any(String)
                    })
                );
        })
    });
    describe('POST', () => {
        test('Data type /api/v2/users', async() => {
            const response = await request(app).post('/api/v2/users').send({
                first_name:"e",
                last_name:"e",
                email:"e@outlook.com",
                username:"e",
                password:"123456",
                profile_pic:"https://ibb.co/zF5mrtX",
                role:"God"
            }).auth(token , { type: 'bearer' });
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
                    username:"yatusane",
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
        test('Data type in /api/v2/users/4',async() => {
            const response = await request(app).put('/api/v2/users/2').send({
                first_name:"f",
                last_name:"f",
                email:"f@outlook.com",
                username:"f",
                password:"123456",
                profile_pic:"https://ibb.co/zF5mrtX",
                role:"God"
            }).auth(token , { type: 'bearer' });
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
            const response = await request(app).delete('/api/v2/users/13').auth(token , { type: 'bearer' });
            expect(response.body).toEqual(expect.objectContaining({
                first_name: expect.any(String),
                last_name: expect.any(String),
                email: expect.any(String),
                username: expect.any(String),
                profile_pic: expect.any(String),
                password: expect.any(String),
                role: expect.any(String)
            })).auth(token , { type: 'bearer' }); 
        })
    })
});

describe('TEST TOKEN USERS',()=>{
    test('ERROR', async ()=>{
        const response = await request(app).get("/api/v2/users/").auth("123" , { type: 'bearer' });
        expect(response.statusCode).toEqual(401);
    });
    test('OK', async ()=>{
        const response = await request(app).get("/api/v2/users/").auth(token , { type: 'bearer' });
        expect(response.statusCode).toEqual(200);
    });
});