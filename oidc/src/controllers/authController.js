const querystring = require('querystring')
const accountService = require('../services/accountService')
const path = require('path')

module.exports = function(oidc) {
    const module = {}

    // Interaction Controller
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

  //Login Interaction Controller
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

  //Abort Interaction Controller
  module.abortInteraction = async(req, res)=> {
    
    const result = {
      error: "access_denied",
      error_description: "End-User aborted interaction",
    }

    await oidc.interactionFinished(req, res, result, {
      mergeWithLastSubmission: false,})
  }

  //Confirm Interaction Controller
  module.confirmInteraction = async(req, res)=>{
    const interactionDetails = await oidc.interactionDetails(req, res);
    const {
      prompt: { name, details },
      params,
      session: { accountId },
    } = interactionDetails

    if (name === "consent") {
      const grant = interactionDetails.grantId
        ? await oidc.Grant.find(interactionDetails.grantId)
        : new oidc.Grant({
            accountId,
            clientId: params.client_id
          });

      if (grant) {
        if (details.missingOIDCScope) {
          grant.addOIDCScope(details.missingOIDCScope.join(" "));
        }
        if (details.missingOIDCClaims) {
          grant.addOIDCClaims(details.missingOIDCClaims);
        }
        if (details.missingResourceScopes) {
          for (const [indicator, scopes] of Object.entries(
            details.missingResourceScopes
          )) {
            grant.addResourceScope(indicator, (scopes).join(" "))
          }
        }

        const grantId = await grant.save()

        const result = { consent: { grantId } };
        await oidc.interactionFinished(req, res, result, {
          mergeWithLastSubmission: true,})
      }
    } else {
      res.throw(400, "Interaction prompt type must be `consent`.");
    }
  }

  module.register = async(req, res, next) => {
    const body = req.body
    try {
      await accountService.set(body.username, {
        username: body.username,
        password: body.password,
      })
      res.status(201).json({
        success : true
      })
    } catch (error) {
      next(error)
    }
  }

  return module
  
}