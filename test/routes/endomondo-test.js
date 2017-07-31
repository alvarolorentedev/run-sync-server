jest.mock('endomondo-unofficial-api', () => ({
  authenticate: jest.fn(),
  workouts : jest.fn()
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
        endomondo.workouts.mockReset()
        endomondo.authenticate.mockImplementation(() => { return Promise.resolve( { works: true } ) })
        endomondo.workouts.mockImplementation(() => { return Promise.resolve( [ { works: true } ] ) })
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

    test('endomondo login returns error if empty request', () => {
        endomondo.authenticate.mockImplementation(() => { throw "exception" })
        return request.post('/endomondo/login').send().then(result => {
            expect(result.statusCode).toBe(400)
        })
    })

    test('endomondo login returns correct response if service resolves', () => {
        return request.post('/endomondo/login').send({email:'pepe',password:'perez'}).then(result => {
            expect(result.body).toEqual({ works: true })
            expect(result.statusCode).toBe(200)
        })
    })

    test('endomondo login returns error if incorrect service rejects', () => {
        endomondo.authenticate.mockImplementation(() => { return Promise.reject() })
        return request.post('/endomondo/login').send({email:'pepe',password:'perez'}).then(result => {
            expect(endomondo.authenticate.mock.calls.length).toBe(1)
            expect(result.statusCode).toBe(400)
        })
    })

    test('endomondo get list of workouts with correct parameters', () => {
        var randomToken = Math.random().toString(36).substr(0, 5)
        return request.post('/endomondo/workouts').send({token: randomToken}).then(result => {
            expect(endomondo.workouts.mock.calls.length).toBe(1)
            expect(endomondo.workouts.mock.calls[0][0].token).toBe(randomToken)
            expect(result.statusCode).toBe(200)
        })
    })

    test('endomondo get list of workouts returns correct result', () => {
        return request.post('/endomondo/workouts').send({token: 'pepe'}).then(result => {
            expect(result.body).toEqual([ { works: true } ])
            expect(result.statusCode).toBe(200)
        })
    })

    test('endomondo get list of workouts returns error if empty request', () => {
        return request.post('/endomondo/workouts').send().then(result => {
            expect(result.statusCode).toBe(400)
        })
    })

    test('endomondo get list of workouts returns error if incorrect service rejects', () => {
        endomondo.workouts.mockImplementation(() => { return Promise.reject() })
        return request.post('/endomondo/workouts').send({token: 'pepe'}).then(result => {
            expect(endomondo.workouts.mock.calls.length).toBe(1)
            expect(result.statusCode).toBe(400)
        })
    })
})