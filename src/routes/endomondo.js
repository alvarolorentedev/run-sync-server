const router = require('express').Router()
const endomondo = require('endomondo-unofficial-api')
const wrap = require('../helpers/exception-wrap')

router.post('/login', wrap(async (req, res) => {
    if(!req.body.email || !req.body.password)
        return res.sendStatus(400)
    let result = await endomondo.authenticate(req.body)
    return res.send(result)
}))

router.get('/workouts', wrap(async (req, res) => {
    if(!req.body.authToken)
        return res.sendStatus(400)
    let result = await endomondo.workouts(req.body)
    return res.send(result)
    
}))

router.post('/workouts', wrap(async (req, res) => {
    try {
        let uploads = req.body.map(upload)
        await Promise.all(uploads)
        return res.sendStatus(200)
    } catch (err) {
        if(err)
            return res.sendStatus(400)
        throw err
    }
    
}))

async function upload(run){
    try {
        if(!run.authToken || !run.userId || !run.duration || !run.time)
            return Promise.reject(new Error('Wrong Parameter'))
        let result = await endomondo.workout.set(run)
        return Promise.resolve(result)
    }
    catch(err) {
        return Promise.reject(err)
    }
}

module.exports = router;