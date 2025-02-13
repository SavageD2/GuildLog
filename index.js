require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
    ],
});

client.once("ready", async () => {
    console.log(`${client.user.tag} est connecté !`);

    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) {
        console.error("Le serveur n'a pas été trouvé.");
        return;
    }

    try {
        await guild.members.fetch();

        const role = guild.roles.cache.find(role => role.name === "THE UNDEFEATED");
        if (!role) {
            console.error("Le rôle n'a pas été trouvé.");
            return;
        }

        const membersWithRole = guild.members.cache.filter(member => member.roles.cache.has(role.id));

        console.log(`Membres ayant le rôle ${role.name} :`);
        membersWithRole.forEach(member => console.log(`- ${member.user.tag} (${member.id})`));
        
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des membres :", error);
    }
});

client.login(process.env.DISCORD_TOKEN);
