const express = require('express');

const app = express();

const { Provider } = require('oidc-provider');
const configuration = {
  // ... see /docs for available configuration
  clients: [{
    client_id: 'foo',
    client_secret: 'bar',
    redirect_uris: ['http://localhost:8080/cb'],
    // ... other client properties
  }],
};

const oidc = new Provider('http://localhost:3000', configuration);

oidc.listen(3000, () => {
  console.log('oidc-provider listening on port 3000, check http://localhost:3000/.well-known/openid-configuration');
});

app.get('/', (req, res) => {
    res.send("Hello @Port 5000")
})

app.listen(5000)
