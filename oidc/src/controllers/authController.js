const querystring = require('querystring')
const accountService = require('../services/accountService')
const path = require('path')

module.exports = function(oidc) {
    const module = {}
    module.interaction = async (req, res)=>{
        const { uid, prompt, params, session } = await oidc.interactionDetails(req, res)
        
          if (prompt.name === "login") {
            return res.render("login", {
              uid,
              details: prompt.details,
              params,
              session: session ? debug(session) : undefined,
              title: "Sign-In",
              dbg: {
                params: debug(params),
                prompt: debug(prompt),
              },
            });
          } else if (prompt.name === "consent") {
            return res.render("consent", {
              uid,
              title: "Authorize",
              clientId: params.client_id,
              scope: params.scope.replace(/ /g, ", "),
              session: session ? debug(session) : undefined,
              dbg: {
                params: debug(params),
                prompt: debug(prompt),
              },
            });
          } else {
            res.throw(501, "Not implemented.");
          }
    }

    function debug(obj) {
		return Object.entries(obj)
		  .map(
			(ent) =>
			  `<strong>${ent[0]}</strong>: ${JSON.stringify(ent[1])}`
		  )
		  .join("<br>");
	  }

	module.login = async(req, res)=> {
		const { prompt: { name },} = await oidc.interactionDetails(req, res)
		  if (name === "login") {
			const account = await accountService.get(req.body.username)
			let result
			if (account.password === req.body.password) {
			  result = {
				login: {
				  accountId: req.body.username,
				},
			  };
			} else {
			  result = {
				error: "access_denied",
				error_description: "Username or password is incorrect.",
			  };
			}
			return oidc.interactionFinished(req, res, result, {
			  mergeWithLastSubmission: false,
			});
		  }
	}

    return module
}