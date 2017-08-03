const router = require('express').Router()
const nike = require('nike-unofficial-api')
const wrap = require('../helpers/exception-wrap')
const AppError = require('../helpers/exception-custom')

router.post('/login', wrap(async (req, res) => {
    if(!req.body.email || !req.body.password)
        throw new AppError('Wrong Parameter', 400)
    let result = await nike.authenticate(req.body)
    res.send(result)
}))

router.get('/workouts', wrap(async (req, res) => {
    if(!req.body.token)
        throw new AppError('Wrong Parameter', 400)
    let result = await nike.workouts(req.body)
    res.send(result)
}))

module.exports = router