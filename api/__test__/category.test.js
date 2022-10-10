const { app, server } = require('../../server');
const request = require('supertest');

afterEach(() => {
    server.close();
});

// router.get('/',categoryController.list);
// router.post('/',categoryController.create);
// router.delete('/:id',categoryController.delete);

const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RfbmFtZSI6IkJydW5vIiwibGFzdF9uYW1lIjoiRnVsY28iLCJlbWFpbCI6ImJydW5vLmZ1bGNvQG91dGxvb2suY29tIiwidXNlcm5hbWUiOiJicnVub2YiLCJwcm9maWxlX3BpYyI6Imh0dHBzOi8vaWJiLmNvL3pGNW1ydFgiLCJyb2xlIjoiR29kIiwiaWF0IjoxNjY1NDMwNjM1LCJleHAiOjM3NjY1NDI3MDM1fQ.FC6M8KOAIAvzLxmRHeWElP6ZFU_UUBpKgFYLp1avZyZ7F5OoyNNj46R_ufugWz2msk_2YiDDdQiNCaiKjrRHYA";
const tokenVencido = "123";

describe('TEST EXITO 200 ', () => {
    describe('GET', () => {
        test('get /category', async () => {
            const response = await request(app).get('/api/v2/category').auth(token,{ type: 'bearer' });
            expect(response.statusCode).toBe(200);
            });
    var Idproducts
    describe('POST', () => {
        test('/category', async () => {
            const response = await request(app).post('/api/v2/category').send({
                "name": "Fruta",
            }).auth(token, { type: 'bearer' });
            Idcategory = response._body.id
            
            expect(response.statusCode).toBe(200);
        });
    describe('DELETE', () => {
        test('delete category   ', async () => {
                const response = await request(app).delete(`/api/v2/category/${Idcategory}`).auth(token, { type: 'bearer' });
                expect(response.statusCode).toBe(200);
            });
        });
    });