const router = require('express').Router()
const nike = require('nike-unofficial-api')

router.post('/login', function(req, res) {
    if(!req.body.email || !req.body.password)
        res.sendStatus(400)
    nike.authenticate(req.body).then(
        result => res.send(result)
    ).catch(
        err => res.sendStatus(400)
    )
})

router.post('/workouts', function(req, res) {
    if(!req.body.token)
        res.sendStatus(400)
    nike.workouts(req.body).then(
        result => res.send(result)
    ).catch(
        err => res.sendStatus(400)
    )
})

module.exports = router;