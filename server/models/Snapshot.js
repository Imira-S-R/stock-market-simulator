const mongoose = require('mongoose')

const snapshotSchema = new mongoose.Schema(
    {
        userId: {
            type: String
        },
        portfolioValue: {
            type: Number
        }
    }, { timestamps: true }
)

const Snapshot = mongoose.model('snapshot', snapshotSchema)

module.exports = Snapshot