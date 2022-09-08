const express = require('express')
const configuration = require('./configs/configuation')
const oidc = require('./configs/provider')
const dotenv = require('dotenv')
const path = require('path')
const morgan = require('morgan')
const authRouter = require('./routes/authRouter')

dotenv.config({ path: path.resolve("oidc/.env") });

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Debug Logs for each request
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

const provider = oidc( process.env.ISSUER, { ...configuration} )

authRouter(app, provider)
app.use('/', provider.callback())

app.listen(3000, () => {
  console.log('oidc-provider listening on port 3000, check http://localhost:3000/.well-known/openid-configuration')
});
 