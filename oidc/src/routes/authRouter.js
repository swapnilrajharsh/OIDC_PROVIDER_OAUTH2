const authController = require('../controllers/authController')
const { noCache } = require('../middlewares/noCache')
var bodyParser = require('body-parser')


module.exports = (app, oidc) => {
	const { constructor: { errors: { SessionNotFound } } } = oidc;

    const { interaction, login } = authController(oidc)

	app.post('/interaction/:uid/login', noCache, bodyParser.urlencoded(),
		bodyParser.json(), login)
    app.get('/interaction/:uid', noCache, interaction)



	app.use((err, req, res, next) => {
		if (err instanceof SessionNotFound) {
		  // handle interaction expired / session not found error
		}
		next(err);
	  });
}