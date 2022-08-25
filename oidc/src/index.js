const express = require('express')
const configuration = require('./configs/configuation')
const oidc = require('./configs/provider')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.resolve("oidc/.env") });
const app = express();

const provider = oidc( process.env.ISSUER, configuration )

provider.listen(3000, () => {
  console.log('oidc-provider listening on port 3000, check http://localhost:3000/.well-known/openid-configuration')
});

app.get('/', (req, res) => {
    res.send("Hello @Port 5000")
})

app.listen(5000)
