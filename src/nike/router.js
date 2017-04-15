const express = require('express');
const api = require('./api');
const UserValidation = require('../home/auth');
const NikeValidation = require('./auth');
const router = express.Router();

router.route('/')
	.get(UserValidation.requireAuth, api.login);

router.route('/activities')
	.post(UserValidation.requireAuth, api.activities);

module.exports = router;
