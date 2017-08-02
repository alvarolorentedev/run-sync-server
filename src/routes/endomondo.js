const router = require('express').Router()
const endomondo = require('endomondo-unofficial-api')

router.post('/login', async (req, res) => {
    try {
        if(!req.body.email || !req.body.password)
            res.sendStatus(400)
        let result = await endomondo.authenticate(req.body)
        res.send(result)
    } 
    catch (err) {
        res.sendStatus(400)
    }
})

router.get('/workouts', async (req, res) => {
    try {
        if(!req.body.authToken)
            res.sendStatus(400)
        let result = await endomondo.workouts(req.body)
        res.send(result)
    } 
    catch (err) {
        res.sendStatus(400)
    }
    
})

router.post('/workouts', async (req, res) => {
    try {
        let uploads = req.body.map(upload)
        await Promise.all(uploads)
        res.sendStatus(200)
    } 
    catch (error) {
        res.sendStatus(400)
    }
})

async function upload(run){
    try {
        if(!run.authToken || !run.userId || !run.duration || !run.time)
            return Promise.reject()
        let result = await endomondo.workout.set(run)
        return Promise.resolve(result)
    }
    catch(err) {
        return Promise.reject()
    }
}

module.exports = router;