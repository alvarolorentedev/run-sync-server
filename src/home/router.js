const express = require('express');
const router = express.Router();
const auth = require ('./auth');



router.route('/').get(auth.requireAuth, function (req, res) {
	res.send( {message: 'Super secret code is ABC123'});
});

module.exports = router;