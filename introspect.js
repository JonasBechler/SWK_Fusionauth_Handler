module.exports = function(config){
	
	const util = require('util')
	const request = require("request");
	
	const requestPromise = util.promisify(request);

// Part of Report 
// ####################################################################################################################

// Send token to FusionAuth and return response

function introspect (token){
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
		// Return response as object
		return JSON.parse(response.body);
	})
}
// ####################################################################################################################


	return introspect
}