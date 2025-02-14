require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
    ],
});

const anciensMembres = new Set();

client.once("ready", async () => {
    console.log(`${client.user.tag} est connecté et prêt !`);

    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) {
        console.error("❌ Le serveur n'a pas été trouvé.");
        return;
    }

    try {
        await guild.members.fetch();

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

client.on("guildMemberRemove", async (member) => {
    console.log(`📤 ${member.user.tag} a quitté le serveur.`);
    anciensMembres.add(member.id);
});

client.on("guildMemberAdd", async (member) => {
    console.log(`📥 ${member.user.tag} a rejoint le serveur.`);

    if (anciensMembres.has(member.id)) {
        console.log(`🔴 Ancien membre détecté : ${member.user.tag}`);

        const guild = member.guild;
        const channel = guild.channels.cache.find(ch => ch.name === "staff");

        if (channel) {
            channel.send(`🔴 **Alerte Staff !** ${member.user.tag} (${member.id}) est un ancien membre qui revient sur le serveur.`);
        } else {
            console.error("❌ Channel #staff introuvable !");
        }

        anciensMembres.delete(member.id);
    }
});

client.login(process.env.DISCORD_TOKEN);
