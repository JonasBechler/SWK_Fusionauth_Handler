module.exports = function(config){
    return function logout (req, res){
        res.redirect(`${config.device_ip}:${config.fusionauth_port}/oauth2/logout?client_id=${config.fusionauth.client_id}`);
    }
}