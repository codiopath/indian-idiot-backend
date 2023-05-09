const mongoose = require('mongoose')

const JoinUsSchema = mongoose.Schema({
    designation: {type: String, required: true},
    brief: {type: String, required: true},
    requirements: {type: String, required: true},
    details: {type: String, required: true},
    link: {type: String, required: true},
    createdBy: {type: String, required: true},
    createdAt: {type: Date, default: Date.now()}
})

const JoinUsModel = mongoose.model('joinUs', JoinUsSchema)

module.exports = JoinUsModel