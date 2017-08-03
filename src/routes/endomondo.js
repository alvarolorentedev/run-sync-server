const router = require('express').Router()
const endomondo = require('endomondo-unofficial-api')
const wrap = require('../helpers/exception-wrap')
const AppError = require('../helpers/exception-custom')

router.post('/login', wrap(async (req, res) => {
    if(!req.body.email || !req.body.password)
        throw new AppError('Wrong Parameter', 400)
    let result = await endomondo.authenticate(req.body)
    return res.send(result)
}))

router.get('/workouts', wrap(async (req, res) => {
    if(!req.body.authToken)
        throw new AppError('Wrong Parameter', 400)
    let result = await endomondo.workouts(req.body)
    return res.send(result)
    
}))

router.post('/workouts', wrap(async (req, res) => {
    let uploads = req.body.map(upload)
    await Promise.all(uploads)
    return res.sendStatus(200)
}))

async function upload(run){
    if(!run.authToken || !run.userId || !run.duration || !run.time)
        throw new AppError('Wrong Parameter', 400)
    return await endomondo.workout.set(run)
}

module.exports = router;