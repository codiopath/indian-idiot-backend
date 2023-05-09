const mongoose = require('mongoose')

const AskIdiotAnswerSchema = mongoose.Schema({
    question: {type: String, required: true},
    name: {type: String, required: true},
    answer: {type: String, required: true},
    stayAnonymous: {type: String, required: true},
    createdAt: {type: Date, default: Date.now()}
})

const AskIdiotAnswerModel = mongoose.model('askIdiotAllAnswer', AskIdiotAnswerSchema)

module.exports = AskIdiotAnswerModel