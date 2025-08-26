const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
     from_user_id: {type: String, ref:'User', required: true},
    to_user_id: {type: String, ref:'User', required: true},
      status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
}, {timestamps: true})

const Connection = mongoose.model('Connection', connectionSchema)

module.exports = Connection