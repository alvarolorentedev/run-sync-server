jest.mock('endomondo-unofficial-api', () => ({
    authenticate: jest.fn(),
    workouts : jest.fn(),
    workout : {
        set : jest.fn()
    }
}))

const endomondo = require('endomondo-unofficial-api')
const request = require('./route-initializer')('../../src/routes/endomondo','/endomondo')

describe('Test the endomondo endpoit', () => {
    beforeEach(() => {
        endomondo.authenticate.mockReset()
        endomondo.workouts.mockReset()
        endomondo.workout.set.mockReset()
        endomondo.authenticate.mockImplementation(() => { return Promise.resolve( { works: true } ) })
        endomondo.workouts.mockImplementation(() => { return Promise.resolve( [ { works: true } ] ) })
        endomondo.workout.set.mockImplementation(() => { return Promise.resolve( { works: true } ) })
    })

    test('endomondo login is called with correct parameters', async () => {
        let randomEmail = Math.random().toString(36).substr(0, 5)
        let randomPassword = Math.random().toString(36).substr(0, 5)
        let result = await request.post('/endomondo/login').send({email: randomEmail, password: randomPassword})
        expect(endomondo.authenticate.mock.calls.length).toBe(1)
        expect(endomondo.authenticate.mock.calls[0][0].email).toBe(randomEmail)
        expect(endomondo.authenticate.mock.calls[0][0].password).toBe(randomPassword)
    })

    test('endomondo login returns error if empty request', async () => {
        endomondo.authenticate.mockImplementation(() => { throw "exception" })
        let result = await request.post('/endomondo/login').send()
        expect(result.statusCode).toBe(400)
    })

    test('endomondo login returns correct response if service resolves', async () => {
        let result = await request.post('/endomondo/login').send({email:'pepe',password:'perez'})
        expect(result.body).toEqual({ works: true })
        expect(result.statusCode).toBe(200)
    })

    test('endomondo login returns error if incorrect service rejects', async () => {
        endomondo.authenticate.mockImplementation(() => { return Promise.reject() })
        let result = await request.post('/endomondo/login').send({email:'pepe',password:'perez'})
        expect(endomondo.authenticate.mock.calls.length).toBe(1)
        expect(result.statusCode).toBe(500)
    })

    test('endomondo get list of workouts with correct parameters', async () => {
        let randomToken = Math.random().toString(36).substr(0, 5)
        let result = await request.get('/endomondo/workouts').send({authToken: randomToken})
        expect(endomondo.workouts.mock.calls.length).toBe(1)
        expect(endomondo.workouts.mock.calls[0][0].authToken).toBe(randomToken)
        expect(result.statusCode).toBe(200)
    })

    test('endomondo get list of workouts returns correct result', async () => {
        let result = await request.get('/endomondo/workouts').send({authToken: 'pepe'})
        expect(result.body).toEqual([ { works: true } ])
        expect(result.statusCode).toBe(200)
    })

    test('endomondo get list of workouts returns error if empty request', async () => {
        let result = await request.get('/endomondo/workouts').send()
        expect(result.statusCode).toBe(400)
    })

    test('endomondo get list of workouts returns error if incorrect service rejects', async () => {
        endomondo.workouts.mockImplementation(() => { return Promise.reject() })
        let result = await request.get('/endomondo/workouts').send({authToken: 'pepe'})
        expect(endomondo.workouts.mock.calls.length).toBe(1)
        expect(result.statusCode).toBe(500)
    })

    test('endomondo post calls workouts with correct parameters', async () => {
        let randomToken = Math.random().toString(36).substr(0, 5)
        let randomUserId = Math.random().toString(36).substr(0, 5)
        let randomDuration = Math.random()
        let randomTime = Math.random()
        let result = await request.post('/endomondo/workouts').send([{authToken: randomToken, userId : randomUserId, duration: randomDuration , time : randomTime}])
        expect(endomondo.workout.set.mock.calls.length).toBe(1)
        expect(endomondo.workout.set.mock.calls[0][0].authToken).toBe(randomToken)
        expect(endomondo.workout.set.mock.calls[0][0].duration).toBe(randomDuration)
        expect(endomondo.workout.set.mock.calls[0][0].time).toBe(randomTime)
        expect(result.statusCode).toBe(200)
    })

    test('endomondo post workouts cause a reject', async () => {
        endomondo.workout.set.mockReset()
        endomondo.workout.set.mockImplementation(() => { return Promise.reject() })
        let result = await request.post('/endomondo/workouts').send([{authToken: "pepe", userId : "pepe", duration: 10, time : 10}])
        expect(endomondo.workout.set.mock.calls.length).toBe(1)
        expect(result.statusCode).toBe(500)
    })

    test('endomondo post calls without authToken', async () => {
        let randomToken = Math.random().toString(36).substr(0, 5)
        let result = await request.post('/endomondo/workouts').send([{userId: "pepe", duration: 10, time : 10}])
        expect(result.statusCode).toBe(400)
    })

    test('endomondo post calls without userId', async () => {
        let result = await request.post('/endomondo/workouts').send([{authToken: "pepe", duration: 10, time : 10}])
        expect(result.statusCode).toBe(400)
    })

    test('endomondo post calls without duration', async () => {
        let result = await request.post('/endomondo/workouts').send([{authToken: "pepe", userId: "pepe", time : 10}])
        expect(result.statusCode).toBe(400)
    })

    test('endomondo post calls without time', async () => {
        let result = await request.post('/endomondo/workouts').send([{authToken: "pepe", userId: "pepe" , duration: 10}])
        expect(result.statusCode).toBe(400)
    })
})