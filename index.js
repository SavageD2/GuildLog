require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const mongoose = require('mongoose');
const Member = require('./models/Member');

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
        console.log(`✅ Membre enregistré ou mis à jour : ${member.user.tag}`);
    } catch (error) {
        console.error("❌ Erreur lors de l'enregistrement ou de la mise à jour du membre :", error);
    }
}

client.once("ready", async () => {
    console.log(`${client.user.tag} est connecté et prêt !`);

    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) {
        console.error("❌ Le serveur n'a pas été trouvé.");
        return;
    }

    try {
        await guild.members.fetch();

        guild.members.cache.forEach(async (member) => {
            await updateMember(member);
        });

        const role = guild.roles.cache.find(role => role.name === "THE UNDEFEATED");
        if (!role) {
            console.error("❌ Le rôle 'THE UNDEFEATED' n'a pas été trouvé.");
            return;
        }

        const membersWithRole = guild.members.cache.filter(member => member.roles.cache.has(role.id));
        console.log(`✅ Membres ayant le rôle ${role.name} :`);
        membersWithRole.forEach(member => console.log(`- ${member.user.tag} (${member.id})`));

    } catch (error) {
        console.error("❌ Erreur lors de la récupération des membres :", error);
    }
});

client.on("guildMemberAdd", async (member) => {
    console.log(`📥 ${member.user.tag} a rejoint le serveur.`);

    if (oldMembers.has(member.id)) {
        console.log(`🔴 Ancien membre détecté : ${member.user.tag}`);

        const guild = member.guild;
        const channel = guild.channels.cache.find(ch => ch.name === "staff");

        if (channel) {
            channel.send(`🔴 **Alerte Staff !** ${member.user.tag} (${member.id}) est un ancien membre qui revient sur le serveur.`);
        } else {
            console.error("❌ Channel #staff introuvable !");
        }

        oldMembers.delete(member.id);
    }

    await updateMember(member);
});

client.on("guildMemberUpdate", async (oldMember, newMember) => {
    if (oldMember.user.avatar !== newMember.user.avatar) {
        console.log(`🔄 Avatar mis à jour pour ${newMember.user.tag}`);
        await updateMember(newMember);
    }
});

client.on("guildMemberRemove", async (member) => {
    console.log(`📤 ${member.user.tag} a quitté le serveur.`);
    oldMembers.add(member.id);

    await updateMember(member);
});

client.login(process.env.DISCORD_TOKEN);

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connexion à la base de données réussie !");
    } catch (error) {
        console.error("❌ Erreur lors de la connexion à la base de données :", error);
        process.exit(1);
    }
}

connectDB();
