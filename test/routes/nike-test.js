jest.mock('nike-unofficial-api', () => ({
  authenticate: jest.fn()
}));

const authenticate = require('nike-unofficial-api').authenticate

const bodyParser = require('body-parser')
const app = require('express')()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/nike', require('../../src/routes/nike'));
const request = require('supertest')(app)

describe('Test the nike endpoit', () => {
    beforeEach(() => {
        authenticate.mockReset()
        authenticate.mockImplementation(() => { return Promise.resolve() })
    });

    test('nike login is called with correct parameters', () => {
        
        return request.post('/nike/login').send({email:'pepe',password:'12345'}).then(result => {
            expect(authenticate.mock.calls.length).toBe(1)
            expect(authenticate.mock.calls[0][0].email).toBe('pepe')
            expect(authenticate.mock.calls[0][0].password).toBe('12345')
            expect(result.statusCode).toBe(200)
        })
    });

    test('nike login returns 200 if correct service response', () => {
        return request.post('/nike/login').send({username:'pepe',password:'perez'}).then(result => {
            expect(authenticate.mock.calls.length).toBe(1)
            expect(result.statusCode).toBe(200)
        })
    });

    test('nike login returns 400 if incorrect service response', () => {
        authenticate.mockImplementation(() => { return Promise.reject() })
        return request.post('/nike/login').send({username:'pepe',password:'perez'}).then(result => {
            expect(authenticate.mock.calls.length).toBe(1)
            expect(result.statusCode).toBe(400)
        })
    });
})