const router = require('express').Router()
const endomondo = require('endomondo-unofficial-api')

router.post('/login', function(req, res) {
    endomondo.authenticate(req.body).then(
        result => res.send(result)
    )
})

module.exports = router;