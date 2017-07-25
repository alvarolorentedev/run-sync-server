const router = require('express').Router()
const nike = require('nike-unofficial-api')

router.post('/login', function(req, res) {
    nike.authenticate({email:'pepe',password:'12345'}).then(
        result => res.send(result)
    ).catch(
        err => res.sendStatus(400)
    )
})

module.exports = router;