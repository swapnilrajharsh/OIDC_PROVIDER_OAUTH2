const { Provider, Configuration } = require('oidc-provider')

/**
 * @param {String} issuer 
 * @param {Configuration} configuration
 */
const oidc = function(issuer, configuration){
    const provider = new Provider(issuer, configuration)
    provider.on('grant.error', handleClientAuthErrors);
    provider.on('introspection.error', handleClientAuthErrors);
    provider.on('revocation.error', handleClientAuthErrors);
    provider.on('server_error', handleClientAuthErrors)
    return provider
}

function handleClientAuthErrors({ headers: { authorization }, oidc: { body, client } }, err) {
    console.log(err)
    // if (err.statusCode === 401 && err.message === 'invalid_client') {
    //   console.log("A")
    //   console.log(err)
      // save error details out-of-bands for the client developers, `authorization`, `body`, `client`
      // are just some details available, you can dig in ctx object for more.
    // }
}
//provider.on('grant.error', handleClientAuthErrors);
//provider.on('introspection.error', handleClientAuthErrors);

module.exports = oidc