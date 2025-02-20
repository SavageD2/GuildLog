const mongoose = require("mongoose");

const guildMemberSchema = new mongoose.Schema({
    familyName: { type: String, required: true },
    guildRank: { type: String, default: null },
    permissions: { type: [String], default: [] },
    linkedDiscordId: { type: String, default: null },
    isInGame: { type: Boolean, default: true },
}, { timestamps: true });

const GuildMember = mongoose.model("GuildMember", guildMemberSchema);
module.exports = GuildMember;