module.exports = function(config){
	
	const util = require('util')
	const request = require("request");
	
	const requestPromise = util.promisify(request);

	return function introspect (token){
		return requestPromise(
			// POST request to /introspect endpoint
			{
				method: 'POST',
				uri: `${config.device_ip}:${config.fusionauth_port}/oauth2/introspect`,
				form: {
					'client_id': config.fusionauth.client_id,
					'token': token
				}
			}
		)
		.then(response => {
			return JSON.parse(response.body);
		})
	}
}