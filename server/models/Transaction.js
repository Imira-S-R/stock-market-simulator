const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    symbol: {
        type: String
    },
    type: {
        type: String
    },
    quantity: {
        type: Number
    },
    pricePerShare: {
        type: Number
    },
    status: {
        type: String
    },
}, {timestamps: true})

const Transaction = mongoose.model('transaction', transactionSchema)

module.exports = Transaction