const fetch = (...args) => import('node-fetch')
    .then(({default: fetch}) => fetch(...args));
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.resolve('api/.env') })

exports.authMiddleware = async (req, res, next) => {
    const body = new URLSearchParams()
    if (!req.headers.authorization)
        return res.status(401).json({
            success: false,
            message: "Unauthorized Request"
        })

    body.append(
        "token",
        req.headers.authorization.replace(/^Bearer /, "")
    )
    body.append("client_id", process.env.CLIENT_ID )
    body.append("client_secret", process.env.CLIENT_SECRET )
    const url = `${process.env.AUTH_ISSUER}/token/introspection`
    const response = await fetch(url, {
        method: "POST",
        headers: {
        ["Content-Type"]: "application/x-www-form-urlencoded",
        },
        body: body,
    })

    if (response.status !== 200) 
        return res.status(401).json({
            success: false,
            message: "Unauthorized Request"
        })
    
    const json = await response.json()
    const { active, aud } = json;
    
    //console.log(`JSON data : ${json}`)
    

    // Resource URI and audience (aud) must be equal
    // if (active && aud.trim() === req.href.split("?")[0]) {
    //     ctx.state.session = json;
    //     await next();
    // } else {
    //     ctx.throw(401);
    // }

    // Added as an test
    if ( active ) {
        await next()
    } else {
        return res.status(401).json({
            success: false,
            message: "Unauthorized Request"
        })
    }
}

//TODO : Add authorize middleware also to verify scope