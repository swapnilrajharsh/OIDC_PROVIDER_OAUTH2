const { Provider, Configuration } = require('oidc-provider')

/**
 * @param {String} issuer 
 * @param {Configuration} configuration
 */
const oidc = function(issuer, configuration){
    return new Provider(issuer, configuration)
}

module.exports = oidc