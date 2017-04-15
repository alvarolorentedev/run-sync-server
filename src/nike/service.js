const nikeplus = require('../../libraries/nike-unofficial-api');

module.exports = {

	activities: function (query, callback) {
		var params = {
				email: query.email,
				password: query.password
			},
			token = null,
			profile_img_url = null;

		nikeplus.authenticate(params)
			.then((result) => {
				console.log(result)
		        token = result.access_token
		        profile_img_url = result.profile_img_url
		        return result
			})
			.then((result) => {return nikeplus.workouts({access_token: token})})
		    .then((result) => {
		        callback(null, result);
		    })
		    .catch((result) => {
		    	console.log(result);
		    	result.token = token;
		    	result.profile_img_url = profile_img_url;
		    	callback(result, null);
			});
	}

};