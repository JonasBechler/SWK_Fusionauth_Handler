module.exports = function(config){

// Part of Report 
// ####################################################################################################################

// Logout the user via FusionAuth

function logout (req, res){
    // Redirect the user to logout via FusionAuth 
    // and then back to in FusionAuth specified logout URL,
    // in this case: {config.device_ip}:{config.port}/

    res.redirect(`${config.device_ip}:${config.fusionauth_port}/oauth2/logout?client_id=${config.fusionauth.client_id}`);
}
// ####################################################################################################################

    return logout
}
