const accounts = require('../db/memory')

module.exports = {
    get : async(key) => {
        return accounts.get(key)
    },

    set : async(key, value) => {
        return accounts.set(key, value)
    }
}