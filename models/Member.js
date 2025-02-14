const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    discordId: {type: String, required: true, unique:true},
    username: {type: String, required: true},
    roles:[String],
    joinedAt: {type: Date, required: true},
    leftAt: {type: Date}
});

module.exports = mongoose.model('Member', MemberSchema);