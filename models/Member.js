const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
    discordId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    roles: { type: [String], default: [] },
    avatarId: { type: String, default: null },
    joinedAt: { type: Date },
    leftAt: { type: Date, default: null }
});

memberSchema.methods.getAvatarUrl = function () {
    return this.avatarId
        ? `https://cdn.discordapp.com/avatars/${this.discordId}/${this.avatarId}.png`
        : `https://cdn.discordapp.com/embed/avatars/0.png`;
};

const Member = mongoose.model("Member", memberSchema);
module.exports = Member;
