// const accounts = require('../db/memory')

// module.exports = {
//     get : async(key) => {
//         return accounts.get(key)
//     },

//     set : async(key, value) => {
//         return accounts.set(key, value)
//     }
// }

const Account = require('../db/mongodb/models/Account')

module.exports = {
    get : async (key) => {
        const acc = await Account.findOne({ username: key })
        return acc
    },

    set : async (key, value) => {
        //Account.insertOne({ username: key }, { ...value })
        await Account.create({...value})
    }
}