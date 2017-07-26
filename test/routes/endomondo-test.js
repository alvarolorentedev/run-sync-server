jest.mock('endomondo-unofficial-api', () => ({
  authenticate: jest.fn()
}));

const endomondo = require('endomondo-unofficial-api')

const bodyParser = require('body-parser')
const app = require('express')()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/endomondo', require('../../src/routes/endomondo'));
const request = require('supertest')(app)

describe('Test the endomondo endpoit', () => {
    beforeEach(() => {
        endomondo.authenticate.mockReset()
        endomondo.authenticate.mockImplementation(() => { return Promise.resolve( { works: true } ) })
    })

    test('endomondo login is called with correct parameters', () => {
        var randomEmail = Math.random().toString(36).substr(0, 5)
        var randomPassword = Math.random().toString(36).substr(0, 5)
        return request.post('/endomondo/login').send({email: randomEmail, password: randomPassword}).then(result => {
            expect(endomondo.authenticate.mock.calls.length).toBe(1)
            expect(endomondo.authenticate.mock.calls[0][0].email).toBe(randomEmail)
            expect(endomondo.authenticate.mock.calls[0][0].password).toBe(randomPassword)
        })
    })
})