module.exports = function(config){

// Part of Report 
// ####################################################################################################################

// Logout the user via FusionAuth

function logout (req, res){
    const fa_address = `${config.device_ip}:${config.fusionauth_port}`;

    // Redirect the user to logout via FusionAuth 
    // and then back to in FusionAuth specified logout URL.
    const url 					= `${fa_address}/oauth2/logout?`;
    const client_id 			= `client_id=${config.fusionauth.client_id}`;

    const redirect_uri = url + client_id;

    res.redirect(redirect_uri);
}

// ####################################################################################################################

    return logout
}
