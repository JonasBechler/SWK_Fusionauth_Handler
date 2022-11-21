module.exports = function(config){
    const request = require('request');

    return function introspect (token, callback){
        request(
            // POST request to /introspect endpoint
            {
              method: 'POST',
              uri: `${config.device_ip}:${config.fusionauth_port}/oauth2/introspect`,
              form: {
                'client_id': config.fusionauth.client_id,
                'token': token
              }
            },
    
            // callback
            (error, response, body) => {
              let introspectResponse = JSON.parse(body);
    
              // valid token -> get more user data and send it back to the react app
              callback(introspectResponse)
            }
        );
    }
}