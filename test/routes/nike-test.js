jest.mock('nike-unofficial-api', () => ({
  authenticate: jest.fn(),
  workouts: jest.fn()
}))

const nike = require('nike-unofficial-api')
const bodyParser = require('body-parser')
require('../../src/helpers/exception-handle')
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

    test('nike login is called with correct parameters', async () => {
        let randomEmail = Math.random().toString(36).substr(0, 5)
        let randomPassword = Math.random().toString(36).substr(0, 5)
        let result = await request.post('/nike/login').send({email: randomEmail, password:randomPassword})
        expect(nike.authenticate.mock.calls.length).toBe(1)
        expect(nike.authenticate.mock.calls[0][0].email).toBe(randomEmail)
        expect(nike.authenticate.mock.calls[0][0].password).toBe(randomPassword)
    })

    test('nike login returns error if empty request', async () => {
        nike.authenticate.mockImplementation(() => { throw "exception" })
        let result = await request.post('/nike/login').send()
        expect(result.statusCode).toBe(400)
    })

    test('nike login returns correct response if service resolves', async () => {
        let result = await request.post('/nike/login').send({email:'pepe',password:'perez'})
        expect(result.body).toEqual({ works: true })
        expect(result.statusCode).toBe(200)
    })

    test('nike login returns error if incorrect service rejects', async () => {
        nike.authenticate.mockImplementation(() => { return Promise.reject() })
        let result = await request.post('/nike/login').send({email:'pepe',password:'perez'})
        expect(nike.authenticate.mock.calls.length).toBe(1)
        expect(result.statusCode).toBe(500)
    })

    test('nike get list of workouts with correct parameters', async () => {
        let randomToken = Math.random().toString(36).substr(0, 5)
        let result = await request.get('/nike/workouts').send({token: randomToken})
        expect(nike.workouts.mock.calls.length).toBe(1)
        expect(nike.workouts.mock.calls[0][0].token).toBe(randomToken)
        expect(result.statusCode).toBe(200)
    })

    test('nike get list of workouts returns correct result', async () => {
        let result = await request.get('/nike/workouts').send({token: 'pepe'})
        expect(result.body).toEqual([ { works: true } ])
        expect(result.statusCode).toBe(200)
    })

    test('nike get list of workouts returns error if empty request', async () => {
        let result = await request.get('/nike/workouts').send()
        expect(result.statusCode).toBe(400)
    })

    test('nike get list of workouts returns error if incorrect service rejects', async () => {
        nike.workouts.mockImplementation(() => { return Promise.reject() })
        let result = await request.get('/nike/workouts').send({token: 'pepe'})
        expect(nike.workouts.mock.calls.length).toBe(1)
        expect(result.statusCode).toBe(500)
    })
})