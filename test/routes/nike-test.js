jest.mock('nike-unofficial-api', () => ({
  authenticate: jest.fn(),
  workouts: jest.fn()
}))

const nike = require('nike-unofficial-api')

const bodyParser = require('body-parser')
const app = require('express')()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/nike', require('../../src/routes/nike'))
const request = require('supertest')(app)

describe('Test the nike endpoit', () => {
    beforeEach(() => {
        nike.authenticate.mockReset()
        nike.workouts.mockReset()
        nike.authenticate.mockImplementation(() => { return Promise.resolve( { works: true } ) })
        nike.workouts.mockImplementation(() => { return Promise.resolve( [ { works: true } ] ) })
    })

    test('nike login is called with correct parameters', () => {
        var randomEmail = Math.random().toString(36).substr(0, 5)
        var randomPassword = Math.random().toString(36).substr(0, 5)
        return request.post('/nike/login').send({email: randomEmail, password:randomPassword}).then(result => {
            expect(nike.authenticate.mock.calls.length).toBe(1)
            expect(nike.authenticate.mock.calls[0][0].email).toBe(randomEmail)
            expect(nike.authenticate.mock.calls[0][0].password).toBe(randomPassword)
        })
    })

    test('nike login returns error if empty request', () => {
        nike.authenticate.mockImplementation(() => { throw "exception" })
        return request.post('/nike/login').send().then(result => {
            expect(result.statusCode).toBe(400)
        })
    })

    test('nike login returns correct response if service resolves', () => {
        return request.post('/nike/login').send({email:'pepe',password:'perez'}).then(result => {
            expect(result.body).toEqual({ works: true })
            expect(result.statusCode).toBe(200)
        })
    })

    test('nike login returns error if incorrect service rejects', () => {
        nike.authenticate.mockImplementation(() => { return Promise.reject() })
        return request.post('/nike/login').send({email:'pepe',password:'perez'}).then(result => {
            expect(nike.authenticate.mock.calls.length).toBe(1)
            expect(result.statusCode).toBe(400)
        })
    })

    test('nike get list of workouts with correct parameters', () => {
        var randomToken = Math.random().toString(36).substr(0, 5)
        return request.post('/nike/workouts').send({token: randomToken}).then(result => {
            expect(nike.workouts.mock.calls.length).toBe(1)
            expect(nike.workouts.mock.calls[0][0].token).toBe(randomToken)
            expect(result.statusCode).toBe(200)
        })
    })

    test('nike get list of workouts returns correct result', () => {
        return request.post('/nike/workouts').send({token: 'pepe'}).then(result => {
            expect(result.body).toEqual([ { works: true } ])
            expect(result.statusCode).toBe(200)
        })
    })

    test('nike get list of workouts returns error if empty request', () => {
        return request.post('/nike/workouts').send().then(result => {
            expect(result.statusCode).toBe(400)
        })
    })

    test('nike get list of workouts returns error if incorrect service rejects', () => {
        nike.workouts.mockImplementation(() => { return Promise.reject() })
        return request.post('/nike/workouts').send({token: 'pepe'}).then(result => {
            expect(nike.workouts.mock.calls.length).toBe(1)
            expect(result.statusCode).toBe(400)
        })
    })

})