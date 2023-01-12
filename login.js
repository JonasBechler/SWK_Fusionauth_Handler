module.exports = function(config) {
	
	const pkce = require('../helpers/pkce');

	const util = require('util')
	const request = require('request');
	const requestPromise = util.promisify(request);

// Part of Report 
// ####################################################################################################################

// Start login and redirect the user to log in via FusionAuth

function login_redirect (req, res){
	// Generate and store the PKCE verifier
	req.session.verifier = pkce.generateVerifier();

	// Generate the PKCE challenge
	const challenge = pkce.generateChallenge(req.session.verifier);

	// Redirect the user to log in via FusionAuth
	const ip = `${config.device_ip}`
	const fa_port = `${config.fusionauth_port}`
	const port = `${config.port}`
  
	const redirect_uri = `${ip}:${fa_port}/oauth2/authorize?
	client_id=${config.fusionauth.client_id}&
	redirect_uri=${ip}:${port}/kn/login_callback&
	response_type=code&
	code_challenge=${challenge}&
	code_challenge_method=S256`
  
	res.redirect(redirect_uri);
}

// ####################################################################################################################


// Part of Report
// ####################################################################################################################

// Recieve an authorization code 
// and exchange this authorization code for an token

function login_callback (req, res){
	requestPromise(
		// POST request to /token endpoint
		{
			method: 'POST',
			uri: `${config.device_ip}:${config.fusionauth_port}/oauth2/token`,
			form: {
			'client_id': config.fusionauth.client_id,
			'client_secret': config.fusionauth.client_secret,
			'code': req.query.code,
			'code_verifier': req.session.verifier,
			'grant_type': 'authorization_code',
			'redirect_uri': `${config.device_ip}:${config.port}/kn/login_callback`
			}
		}
	)
	.then(response => {
		// Return response as object
		return JSON.parse(response.body);
	})
	.then(data => {
		// Save token to session
		req.session.token = data.access_token;
			
		// redirect to "/"
		res.redirect(`${config.device_ip}:${config.port_react}/`);
	})
}
// ####################################################################################################################


	return {
		redirect: login_redirect,
		callback: login_callback
	}
}