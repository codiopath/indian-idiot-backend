const mongoose = require('mongoose')

const AdminSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    // phone: {type: String, required: true},
    password: {type: String, required: true},
    superAdmin: {type: Boolean, required: true},
    createdBy: {type: String, required: true},
    createdAt: {type: Date, default: Date.now()}
})

const AdminModel = mongoose.model('admin', AdminSchema)

module.exports = AdminModel