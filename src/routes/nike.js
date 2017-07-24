const express = require('express');
const router = express.Router();

router.get('/login', function(req, res) {
    res.send('hola')
})

module.exports = router;