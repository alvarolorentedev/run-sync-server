const moment = require('moment');
const config = require('config');

module.exports = {
	requireNike: (request, response, next) => {

		if (request.headers && request.headers['x-access-token-nike']) {
			const token = request.headers['x-access-token-nike'];
			if (token) {
                next();
	        } else {
	            return response.status(401).json({
					error: 'Invalid nike token supplied.'
				});
	        }
		} else {
			return response.status(401).json({
				error: 'Invalid nike token supplied.'
			});
		}
	}
};