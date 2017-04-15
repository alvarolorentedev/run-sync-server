const NikePlusService = require ('./service');
const Parser = require('../common/parser');

module.exports = {
  login: (request, response, next) => {
  },
  activities: (request, response, next) => {
  	NikePlusService.activities({email: request.body.email, password: request.body.password}, (err, result) => {
  		if (err) {
			return response.status(500).json({
				error: `Error on nike Service: ${err}`
			});
		}
		return response.status(200).json({
			message: 'Here you have your activities', 
			workouts: {
				activities: Parser.fromNikeToCommon(result.activities),
				paging: result.paging,
			},
			token: result.token,
			profile_img_url: result.profile_img_url
        });
  	});
  }
};