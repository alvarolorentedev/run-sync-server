const _ = require('lodash');
const User = require('./model');

module.exports = {
	create: (request, response, next) => {
		if (Object.keys(request.body).length === 0) {
			return response.status(400).json({
				error: 'Invalid parameters supplied.'
			});
		}
		let errors;
		new User(request.body).validate((error) => {
			if (error) {
				errors = _.transform(error.errors, (result, value, key) => {
					result[key] = {
						reason: value.kind === 'user defined' ? 'invalid' : value.kind,
						value: value.value || null
					};
				return result;
				});

				return response.status(400).json({
					error: error.message,
					errors: errors
				});
			}

		next();
		});
	},
	update: (request, response, next) => {
		if (Object.keys(request.body).length === 0) {
			return response.status(400).json({
				error: 'Invalid parameters supplied.'
			});
		}
		next();
	}
};
