const router = require('express').Router()
const endomondo = require('endomondo-unofficial-api')
var AppError = require('express-exception-handler').exception

router.post('/login', async (req, res) => {
    if(!req.body.email || !req.body.password)
        throw new AppError('Wrong Parameter', 400)
    let result = await endomondo.authenticate(req.body)
    res.send(result)
})

router.get('/workouts', async (req, res) => {
    if(!req.body.authToken)
        throw new AppError('Wrong Parameter', 400)
    let result = await endomondo.workouts(req.body)
    res.send(result)
})

router.post('/workouts', async (req, res) => {
    let uploads = req.body.map(upload)
    await Promise.all(uploads)
    res.sendStatus(200)
})

async function upload(run){
    if(!run.authToken || !run.userId || !run.duration || !run.time)
        throw new AppError('Wrong Parameter', 400)
    await endomondo.workout.set(run)
}

module.exports = router