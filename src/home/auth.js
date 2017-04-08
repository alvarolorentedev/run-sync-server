const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('config');

module.exports = {
	requireAuth: (request, response, next) => {

		// console.log('request.headers: ' + JSON.stringify(request.headers));

		if (request.headers && request.headers['x-access-token']) {
			const token = request.headers['x-access-token'];
			if (token) {
	            jwt.verify(token, config.SECRET, function (err, payload) {
	                if (err) {
	                    return response.status(401).json({
							error: 'Invalid token supplied.'
						});
	                } else {
	                    next();
	                }
	            });
	        } else {
	            return response.status(401).json({
					error: 'Invalid token supplied.'
				});
	        }
		} else {
			return response.status(401).json({
				error: 'Invalid token supplied.'
			});
		}
	}
};