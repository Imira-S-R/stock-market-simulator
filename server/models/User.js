const mongoose = require('mongoose')
const { isEmail } = require('validator')

const userSchema = new mongoose.Schema({
    cashBalance: {
        type: Number
    },
    portfolio: [{
        symbol: String,
        shares: Number,
        price_bought: Number
    }],
    googleId: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String
    },
    wishlist: {
        type: [String],
        default: []
    }
})

const User = mongoose.model('user', userSchema)

module.exports = User