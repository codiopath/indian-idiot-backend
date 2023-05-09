const mongoose = require('mongoose')

const AskIdiotSchema = mongoose.Schema({
    question: {type: String, required: true},
    createdAt: {type: Date, default: Date.now()},
    createdBy: {type: String, required: true}
})

const AskIdiotModel = mongoose.model('askIdiot', AskIdiotSchema)

module.exports = AskIdiotModel