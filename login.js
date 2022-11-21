module.exports = function(config){
    function redirect (req, res){
        // Generate and store the PKCE verifier
        req.session.verifier = pkce.generateVerifier();

        // Generate the PKCE challenge
        const challenge = pkce.generateChallenge(req.session.verifier);

        // Redirect the user to log in via FusionAuth
        const redirect_uri = `${config.device_ip}:${config.fusionauth_port}/oauth2/authorize?client_id=${config.fusionauth.client_id}&redirect_uri=${config.device_ip}:${config.port}${config.fusionauth.redirect_uri}&response_type=code&code_challenge=${challenge}&code_challenge_method=S256`
        res.redirect(redirect_uri);
    }

    function callback (req, res){
        request(
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
                'redirect_uri': `${config.device_ip}:${config.port}${config.fusionauth.redirect_uri}`
              }
            },
      
            // callback
            (error, response, body) => {
                let data = JSON.parse(body)
                console.log(data)

                // save token to session
                req.session.token = data.access_token;
                
                // redirect to the React app
                res.redirect(`${config.device_ip}:${config.port_react}`);
      
            }
        );
    }

    return {
        redirect: redirect,
        callback: callback}
}