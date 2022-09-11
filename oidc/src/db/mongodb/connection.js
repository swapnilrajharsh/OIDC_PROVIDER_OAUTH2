const mongoose = require('mongoose')

exports.connectMongodb = async () => {
  const URI = process.env.MONGODB_URI
  try {
    return mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true
    })
  } catch (error) {
    console.error(error)
  }
}