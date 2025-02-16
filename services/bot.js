require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const Member = require("../models/Member");
const logger = require("../utils/logger");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
    ],
});

const oldMembers = new Set();

async function updateMember(member) {
    try {
        let existingMember = await Member.findOne({ discordId: member.id });

        if (existingMember) {
            existingMember.username = member.user.tag;
            existingMember.roles = member.roles.cache.map(role => role.name);
            existingMember.avatarId = member.user.avatar ? member.user.avatar : null;
            existingMember.joinedAt = member.joinedAt;
            existingMember.leftAt = null;
        } else {
            existingMember = new Member({
                discordId: member.id,
                username: member.user.tag,
                roles: member.roles.cache.map(role => role.name),
                avatarId: member.user.avatar ? member.user.avatar : null,
                joinedAt: member.joinedAt,
            });
        }

        await existingMember.save();
        logger.info(`✅ Membre enregistré ou mis à jour : ${member.user.tag}`);
    } catch (error) {
        logger.error("❌ Erreur lors de l'enregistrement ou de la mise à jour du membre :", error.message, error.stack);
    }
}

client.once("ready", async () => {
    try {
        logger.info(`${client.user.tag} est connecté et prêt !`);

        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        if (!guild) {
            logger.error("❌ Le serveur n'a pas été trouvé.");
            return;
        }

        await guild.members.fetch();

        guild.members.cache.forEach(async (member) => {
            await updateMember(member);
        });

        const role = guild.roles.cache.find(role => role.name === "THE UNDEFEATED");
        if (!role) {
            logger.error("❌ Le rôle 'THE UNDEFEATED' n'a pas été trouvé.");
            return;
        }

        const membersWithRole = guild.members.cache.filter(member => member.roles.cache.has(role.id));
        logger.info(`✅ Membres ayant le rôle ${role.name} :`);
        membersWithRole.forEach(member => logger.info(`- ${member.user.tag} (${member.id})`));

    } catch (error) {
        logger.error("❌ Erreur lors de l'initialisation du bot :", error.message, error.stack);
    }
});

client.on("guildMemberAdd", async (member) => {
    try {
        logger.info(`📥 ${member.user.tag} a rejoint le serveur.`);

        if (oldMembers.has(member.id)) {
            logger.info(`🔴 Ancien membre détecté : ${member.user.tag}`);

            const guild = member.guild;
            const channel = guild.channels.cache.find(ch => ch.name === "staff");

            if (channel) {
                channel.send(`🔴 **Alerte Staff !** ${member.user.tag} (${member.id}) est un ancien membre qui revient sur le serveur.`);
            } else {
                logger.error("❌ Channel #staff introuvable !");
            }

            oldMembers.delete(member.id);
        }

        await updateMember(member);
    } catch (error) {
        logger.error("❌ Erreur lors de l'ajout du membre : ", error.message, error.stack);
    }
});

client.on("guildMemberUpdate", async (oldMember, newMember) => {
    try {
        if (oldMember.user.avatar !== newMember.user.avatar) {
            logger.info(`🔄 Avatar mis à jour pour ${newMember.user.tag}`);
            await updateMember(newMember);
        }
    } catch (error) {
        logger.error("❌ Erreur lors de la mise à jour de l'avatar du membre : ", error.message, error.stack);
    }
});

client.on("guildMemberRemove", async (member) => {
    try {
        logger.info(`📤 ${member.user.tag} a quitté le serveur.`);

        oldMembers.add(member.id);

        await updateMember(member);
    } catch (error) {
        logger.error("❌ Erreur lors du retrait du membre : ", error.message, error.stack);
    }
});

function startBot() {
    client.login(process.env.DISCORD_TOKEN);
}
module.exports = { startBot };