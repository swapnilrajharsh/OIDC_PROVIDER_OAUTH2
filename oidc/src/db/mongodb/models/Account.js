const mongoose = require('mongoose')

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
  email: {
    type: String,
    unique: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
});

const AccountModel = mongoose.model("Account", AccountSchema)
module.exports = AccountModel