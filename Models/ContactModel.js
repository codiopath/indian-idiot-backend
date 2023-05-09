const mongoose = require('mongoose')

const ContactSchema = mongoose.Schema({
    email: {type: String, required: true},
    message: {type: String, required: true},
    createdAt: {type: Date, default: Date.now()}
})

const ContactModel = mongoose.model('contact', ContactSchema)

module.exports = ContactModel