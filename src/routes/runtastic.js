const router = require('express').Router()
const runtastic = require('runtastic-unofficial-api')
var AppError = require('express-exception-handler').exception

router.post('/login', async (req, res) => {
    if(!req.body.email || !req.body.password)
        throw new AppError('Wrong Parameter', 400)
    let result = await runtastic.authenticate(req.body)
    res.send(result)
})

router.get('/workouts', async (req, res) => {
    if(!req.body.authToken|| !req.body.user || !req.body.user.id)
        throw new AppError('Wrong Parameter', 400)
    let result = await runtastic.workouts(req.body)
    res.send(result)
})

router.post('/workouts', async (req, res) => {
    let uploads = req.body.map(upload)
    await Promise.all(uploads)
    res.sendStatus(200)
})

async function upload(run){
    if(!run.user || !run.user.run_sessions_path || !run.params || !run.params.authToken)
        throw new AppError('Wrong Parameter', 400)
    await runtastic.workout.set(run)
}

module.exports = router