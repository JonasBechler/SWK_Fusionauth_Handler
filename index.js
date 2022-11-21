
module.exports = function(config) {
    const login = require("./login")(config)
    const logout = require("./logout")(config)
    const token_from_code = require("./token_from_code")(config)

    return {
        login: login,
        logout: logout,
        token_from_code: token_from_code,
        
    }
}