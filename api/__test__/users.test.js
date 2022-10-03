const { app, server } = require('../server');
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
        test.skip('Route status OK /users/id', async () => {
            const response = await request(app).get('/api/v2/users/11');
            expect(response.statusCode).toBe(200);
        });
    });
    describe('POST', () => {
        test.skip('Route status OK /users/login', async () => {
            const response = await request(app).post('/api/v2/users/login').send({
                username:"jeffg",
                password:"123456"
            });
            expect(response.statusCode).toBe(200);
        })});
    describe('POST', () => {
        test.skip('Route status OK /users', async () => {
            const response = await request(app).post('/api/v2/users').send({
                first_name:"Pepeishon",
                last_name:"Lucas",
                email:"xxxxxxx@outlook.com",
                username:"adwad",
                password:"123456",
                profile_pic:"https://ibb.co/zF5mrtX",
                role:"God"
            });;
            expect(response.statusCode).toBe(201);
            
        })});
    describe('PUT', () => {
        test.skip('Route status OK /users/login/id', async () => {
            const response = await request(app).put('/api/v2/users/11').send({
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
        test.skip('Route status OK /users/id', async () => {
            const response = await request(app).delete('/api/v2/users/7');
            expect(response.statusCode).toBe(200);
        });
    });
});
describe('TEST USERS ENDPOINTS STATUS ERROR', () => {
    describe('GET', () => {
        test.skip('Route status ERROR /users', async () => {
            const response = await request(app).get('/api/v2/users');
            expect(response.statusCode).toBe(500);
        });
        test('Route status ERROR /users/id', async () => {
            const response = await request(app).get('/api/v2/users/99');
            expect(response.statusCode).toBe(404);
        });
    });
    describe('POST', () => {
        test.skip('Route status ERROR /users/login', async () => {
            const response = await request(app).post('/api/v2/users/login')
            expect(response.statusCode).toBe(500);
        })});
    describe('POST', () => {
        test.skip('Route status ERROR /users', async () => {
            const response = await request(app).post('/api/v2/users')
            expect(response.statusCode).toBe(500);
        })});
    describe('PUT', () => {
        test.skip('Route status ERROR /users/login/id', async () => {
            const response = await request(app).put('/api/v2/users')
            expect(response.statusCode).toBe(404);
        });});
    describe('DELETE', () => {
        test.skip('Route status ERROR /users/id', async () => {
            const response = await request(app).delete('/api/v2/users');
            expect(response.statusCode).toBe(404);
        });
    });
});
