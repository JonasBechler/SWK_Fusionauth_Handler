module.exports = function(config){
	
	const util = require('util')
	const request = require("request");
	
	const requestPromise = util.promisify(request);

// Part of Report 
// ####################################################################################################################

// Send token to FusionAuth and return response

function introspect (token){
	const fa_address = `${config.device_ip}:${config.fusionauth_port}`

	return requestPromise(
		// POST request to /introspect endpoint 
		{
			method: 'POST',
			uri: `${fa_address}/oauth2/introspect`,
			form: {
				'client_id': config.fusionauth.client_id,
				'token': token
			}
		}
	)
	.then(response => {
		// Error handling
		if (!response.statusCode == 200) {
			throw new Error('Request failed: ' + response.status);
		}
		// Return response as object
		return JSON.parse(response.body);
	})
	.catch(error => {
		// Should not happen, debugger attach point 
		console.log(error);
	}); 
}

// ####################################################################################################################


	return introspect
}