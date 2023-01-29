module.exports = function(config) {
	
	const pkce = require('../helpers/pkce');

	const util = require('util')
	const request = require('request');
	const requestPromise = util.promisify(request);

// Part of Report 
// ####################################################################################################################

// Start login and redirect the user to log in via FusionAuth

function login_redirect (req, res){
	const fa_address = `${config.device_ip}:${config.fusionauth_port}}`
	const callback_address = `${config.device_ip}:${config.port}}`

	// Generate and store the PKCE verifier
	req.session.verifier = pkce.generateVerifier();

	// Generate the PKCE challenge
	const challenge = pkce.generateChallenge(req.session.verifier);

	// Redirect the user to log in via FusionAuth
	const url 					= `${fa_address}/oauth2/authorize?`
	const client_id 			= `client_id=${config.fusionauth.client_id}&`
	const callback_uri 			= `redirect_uri=${callback_address}/kn/login_callback&`
	const response_type 		= `response_type=code&`
	const code_challenge 		= `code_challenge=${challenge}&`
	const challenge_method 		= `code_challenge_method=S256`
  
	const redirect_uri = url + client_id + callback_uri + response_type + code_challenge + challenge_method
  
	res.redirect(redirect_uri);
}

// ####################################################################################################################


// Part of Report
// ####################################################################################################################

// Receive an authorisation code
// and exchange this authorization code for an token

function login_callback (req, res){	 
	const fa_address = `${config.device_ip}:${config.fusionauth_port}}`
	const callback_address = `${config.device_ip}:${config.port}}`

	requestPromise(
		// POST request to /token endpoint
		{
			method: 'POST',
			uri: `${fa_address}/oauth2/token`,
			form: {
			'client_id': config.fusionauth.client_id,
			'client_secret': config.fusionauth.client_secret,
			'code': req.query.code,
			'code_verifier': req.session.verifier,
			'grant_type': 'authorization_code',
			'redirect_uri': `${callback_address}/kn/login_callback`
			}
		}
	)
	.then(response => {
		// Error handling
		if (!response.ok) {
			throw new Error('Request failed: ' + response.status);
		}
		// Return response as object
		return JSON.parse(response.body);
	})
	.then(data => {
		// Save token to session
		req.session.token = data.access_token;
			
		// Redirect to "/"
		res.redirect(`${config.device_ip}:${config.port}/`);
	})
	.catch(error => {
		// Should not happen, debugger attach point 
		console.log(error);
	}); 
}

// ####################################################################################################################


	return {
		redirect: login_redirect,
		callback: login_callback
	}
}