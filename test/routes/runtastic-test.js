jest.mock('runtastic-unofficial-api', () => ({
    authenticate: jest.fn(),
    workouts : jest.fn(),
    workout : {
        set : jest.fn()
    }
}))

const runtastic = require('runtastic-unofficial-api')
const bodyParser = require('body-parser')
const app = require('express')()
var exceptionHandler = require('express-exception-handler')
exceptionHandler.handle()
const request = require('supertest')(app)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/runtastic', require('../../src/routes/runtastic'))
app.use(exceptionHandler.middleware)


describe('Test the runtastic endpoit', () => {
    beforeEach(() => {
        runtastic.authenticate.mockReset()
        runtastic.workouts.mockReset()
        runtastic.workout.set.mockReset()
        runtastic.authenticate.mockImplementation(() => { return Promise.resolve( { works: true } ) })
        runtastic.workouts.mockImplementation(() => { return Promise.resolve( [ { works: true } ] ) })
        runtastic.workout.set.mockImplementation(() => { return Promise.resolve( { works: true } ) })
    })

    test('runtastic login is called with correct parameters', async () => {
        let randomEmail = Math.random().toString(36).substr(0, 5)
        let randomPassword = Math.random().toString(36).substr(0, 5)
        let result = await request.post('/runtastic/login').send({email: randomEmail, password: randomPassword})
        expect(runtastic.authenticate.mock.calls.length).toBe(1)
        expect(runtastic.authenticate.mock.calls[0][0].email).toBe(randomEmail)
        expect(runtastic.authenticate.mock.calls[0][0].password).toBe(randomPassword)
    })

    test('runtastic login returns error if empty request', async () => {
        runtastic.authenticate.mockImplementation(() => { throw "exception" })
        let result = await request.post('/runtastic/login').send()
        expect(result.statusCode).toBe(400)
    })

    test('runtastic login returns correct response if service resolves', async () => {
        let result = await request.post('/runtastic/login').send({email:'pepe',password:'perez'})
        expect(result.body).toEqual({ works: true })
        expect(result.statusCode).toBe(200)
    })

    test('runtastic login returns error if incorrect service rejects', async () => {
        runtastic.authenticate.mockImplementation(() => { return Promise.reject() })
        let result = await request.post('/runtastic/login').send({email:'pepe',password:'perez'})
        expect(runtastic.authenticate.mock.calls.length).toBe(1)
        expect(result.statusCode).toBe(500)
    })

    test('runtastic get list of workouts with correct parameters', async () => {
        let randomToken = Math.random().toString(36).substr(0, 5)
        let randomUserId = Math.random().toString(36).substr(0, 5)
        let result = await request.get('/runtastic/workouts').send({authToken: randomToken, user: { id: randomUserId}})
        expect(runtastic.workouts.mock.calls.length).toBe(1)
        expect(runtastic.workouts.mock.calls[0][0].authToken).toBe(randomToken)
        expect(runtastic.workouts.mock.calls[0][0].user.id).toBe(randomUserId)
        expect(result.statusCode).toBe(200)
    })

    test('runtastic get list of workouts returns correct result', async () => {
        let result = await request.get('/runtastic/workouts').send({authToken: 'pepe', user: { id: 'pepe'}})
        expect(result.body).toEqual([ { works: true } ])
        expect(result.statusCode).toBe(200)
    })

    test('runtastic get list of workouts returns error if missing authToken', async () => {
        let result = await request.get('/runtastic/workouts').send({user: { id: 'pepe'}})
        expect(result.statusCode).toBe(400)
    })

    test('runtastic get list of workouts returns error if missing user', async () => {
        let result = await request.get('/runtastic/workouts').send({authToken: 'pepe'})
        expect(result.statusCode).toBe(400)
    })

    test('runtastic get list of workouts returns error if missing user ID', async () => {
        let result = await request.get('/runtastic/workouts').send({authToken: 'pepe', user: {}})
        expect(result.statusCode).toBe(400)
    })

    test('runtastic get list of workouts returns error if incorrect service rejects', async () => {
        runtastic.workouts.mockImplementation(() => { return Promise.reject() })
        let result = await request.get('/runtastic/workouts').send({authToken: 'pepe', user: { id: 'pepe'}})
        expect(runtastic.workouts.mock.calls.length).toBe(1)
        expect(result.statusCode).toBe(500)
    })

    test('runtastic post calls workouts with correct parameters', async () => {
        let randomToken = Math.random().toString(36).substr(0, 5)
        let randomPath = Math.random().toString(36).substr(0, 5)
        let result = await request.post('/runtastic/workouts').send([{user: {run_sessions_path: randomPath}, params: { authToken: randomToken }}])
        expect(runtastic.workout.set.mock.calls.length).toBe(1)
        expect(runtastic.workout.set.mock.calls[0][0].params.authToken).toBe(randomToken)
        expect(runtastic.workout.set.mock.calls[0][0].user.run_sessions_path).toBe(randomPath)
        expect(result.statusCode).toBe(200)
    })

    test('runtastic post workouts cause a reject', async () => {
        runtastic.workout.set.mockReset()
        runtastic.workout.set.mockImplementation(() => { return Promise.reject() })
        let result = await request.post('/runtastic/workouts').send([{user: {run_sessions_path: "pepe"}, params: { authToken: "pepe" }}])
        expect(runtastic.workout.set.mock.calls.length).toBe(1)
        expect(result.statusCode).toBe(500)
    })

    test('runtastic post calls without params', async () => {
        let randomToken = Math.random().toString(36).substr(0, 5)
        let result = await request.post('/runtastic/workouts').send([{user: {run_sessions_path: "pepe"}}])
        expect(result.statusCode).toBe(400)
    })

        test('runtastic post calls without params authToken', async () => {
        let randomToken = Math.random().toString(36).substr(0, 5)
        let result = await request.post('/runtastic/workouts').send([{user: {run_sessions_path: "pepe", params: {}}}])
        expect(result.statusCode).toBe(400)
    })

    test('runtastic post calls without user', async () => {
        let result = await request.post('/runtastic/workouts').send([{params: { authToken: "pepe" }}])
        expect(result.statusCode).toBe(400)
    })

    test('runtastic post calls without user run_sessions_path', async () => {
        let result = await request.post('/runtastic/workouts').send([{user: {}, params: { authToken: "pepe" }}])
        expect(result.statusCode).toBe(400)
    })

})