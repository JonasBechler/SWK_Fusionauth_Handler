
module.exports = function(config) {
    const login = require("./login")(config)
    const logout = require("./logout")(config)
    const introspect = require("./introspect")(config)

    return {
        login: login,
        logout: logout,
        introspect: introspect,

    }
}