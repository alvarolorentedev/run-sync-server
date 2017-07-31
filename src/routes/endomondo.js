const router = require('express').Router()
const endomondo = require('endomondo-unofficial-api')

router.post('/login', function(req, res) {
    if(!req.body.email || !req.body.password)
        res.sendStatus(400)
    endomondo.authenticate(req.body).then(
        result => res.send(result)
    ).catch(
        err => res.sendStatus(400)
    )
})

router.get('/workouts', function(req, res) {
    if(!req.body.token)
        res.sendStatus(400)
    endomondo.workouts(req.body).then(
        result => res.send(result)
    ).catch(
        err => res.sendStatus(400)
    )
})

module.exports = router;