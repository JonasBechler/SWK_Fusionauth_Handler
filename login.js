module.exports = function(config) {
	
	const pkce = require('../helpers/pkce');

	const util = require('util')
	const request = require('request');
	const requestPromise = util.promisify(request);



	function redirect (req, res){
		// Generate and store the PKCE verifier
		req.session.verifier = pkce.generateVerifier();

		// Generate the PKCE challenge
		const challenge = pkce.generateChallenge(req.session.verifier);

		// Redirect the user to log in via FusionAuth
		const addr = `${config.device_ip}:${config.fusionauth_port}`
		const redirect_uri = `${addr}/oauth2/authorize?client_id=${config.fusionauth.client_id}&redirect_uri=${addr}/kn/login_callback&response_type=code&code_challenge=${challenge}&code_challenge_method=S256`
		res.redirect(redirect_uri);
	}

	function callback (req, res){
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
			let data = JSON.parse(response.body)

			// save token to session
			req.session.token = data.access_token;
				
			// redirect to the React app
			res.redirect(`${config.device_ip}:${config.port_react}`);
		})
	}

	return {
		redirect: redirect,
		callback: callback
	}
}