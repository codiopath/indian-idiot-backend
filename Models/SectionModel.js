const mongoose = require('mongoose')

const SectionSchema = mongoose.Schema({
    title: {type: String, required: true},
    entries: {type: Array, required: true},
    createdBy: {type: String, required: true},
    createdAt: {type: Date, default: Date.now()}
})

const SectionModel = mongoose.model('section', SectionSchema)

module.exports = SectionModel