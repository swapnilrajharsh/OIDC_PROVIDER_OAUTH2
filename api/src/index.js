const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const dummyResourceRoute = require('./routes/apiRouter')

dotenv.config({ path: path.resolve('api/.env') })

const app = express()

app.use('/test', dummyResourceRoute)

app.listen(process.env.PORT,
    console.log(`Resource server running at Port ${process.env.PORT}`))


