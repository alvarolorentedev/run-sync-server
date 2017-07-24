
const app = require('../../src/routes/nike')
const request = require('supertest')(app);

describe('Test the nike endpoit', () => {
    test('It should response the GET method', () => {
        return request.get('/login').expect(200);
    });
})