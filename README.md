# GuildLog - Bot Discord de Gestion des Membres

##  Description
GuildLog est un bot Discord permettant de :
- **Se connecter au serveur Discord** et afficher les membres ayant un rôle spécifique.
- **Détecter les nouveaux membres** qui rejoignent le serveur.
- **Détecter les membres qui quittent** le serveur.
- **Alerter le staff** lorsqu'un ancien membre revient sur le serveur.


### 1 Configurer les variables d’environnement
Créer un fichier `.env` avec :
```
DISCORD_TOKEN=your_bot_token
GUILD_ID=your_server_id
```

### 2 Installer les dépendances
```
npm install discord.js dotenv
```

### 3 Lancer le bot
```
node bot.js
```

---

##  Détails du Code

### 1️ Connexion au bot et écoute des événements
Le bot se connecte et affiche son statut. Il récupère les membres du serveur et cherche un rôle spécifique (**THE UNDEFEATED**). Il affiche la liste des membres ayant ce rôle.
```js
client.once("ready", async () => {
    console.log(`${client.user.tag} est connecté et prêt !`);
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) {
        console.error("Le serveur n'a pas été trouvé.");
        return;
    }
    try {
        await guild.members.fetch();
        const role = guild.roles.cache.find(role => role.name === "THE UNDEFEATED");
        if (!role) {
            console.error("Le rôle 'THE UNDEFEATED' n'a pas été trouvé.");
            return;
        }
        const membersWithRole = guild.members.cache.filter(member => member.roles.cache.has(role.id));
        console.log(`Membres ayant le rôle ${role.name} :`);
        membersWithRole.forEach(member => console.log(`- ${member.user.tag} (${member.id})`));
    } catch (error) {
        console.error("Erreur lors de la récupération des membres :", error);
    }
});
```

### 2️ Détection des départs et stockage temporaire
Quand un membre **quitte**, son ID est stocké dans `anciensMembres`.
```js
client.on("guildMemberRemove", async (member) => {
    console.log(`${member.user.tag} a quitté le serveur.`);
    anciensMembres.add(member.id);
});
```

### 3️ Détection des retours et alerte du staff
Quand un **ancien membre revient**, il est détecté et une alerte est envoyée dans `#staff`.
```js
client.on("guildMemberAdd", async (member) => {
    console.log(`${member.user.tag} a rejoint le serveur.`);
    if (anciensMembres.has(member.id)) {
        console.log(`Ancien membre détecté : ${member.user.tag}`);
        const guild = member.guild;
        const channel = guild.channels.cache.find(ch => ch.name === "staff");
        if (channel) {
            channel.send(`**Alerte Staff !** ${member.user.tag} (${member.id}) est un ancien membre qui revient sur le serveur.`);
        } else {
            console.error("Channel #staff introuvable !");
        }
        anciensMembres.delete(member.id);
    }
});
```

---

## Améliorations Possibles
- **Stocker les anciens membres en base de données (MongoDB, MySQL, etc.)**
- **Créer une interface web affichant les membres et leur statut**
- **Envoyer un message de bienvenue personnalisé aux nouveaux**
- **Gérer plusieurs rôles et permissions avancées**

---

## Conclusion
Ce bot est utile pour **suivre les départs et retours des membres** et **informer les admins** lorsqu'un ancien membre revient. 🚀

