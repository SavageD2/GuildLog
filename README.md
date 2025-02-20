# Documentation Complète de l'API GuildLog

## Introduction
**GuildLog** est une API REST permettant la gestion des membres d'une guilde à la fois sur Discord et en jeu. Elle fournit des routes pour récupérer, ajouter, modifier, rechercher et supprimer des membres.

## Technologies Utilisées
- **Node.js** : Environnement d'exécution JavaScript.
- **Express.js** : Framework backend minimaliste.
- **MongoDB** : Base de données NoSQL pour stocker les informations des membres.
- **Mongoose** : ODM pour MongoDB.
- **Swagger** : Documentation interactive de l'API.
- **Jest & Supertest** : Tests unitaires et d'intégration.
- **Dotenv** : Gestion des variables d'environnement.
- **Winston** : Logger pour journaliser les requêtes et erreurs.
- **Cors** : Gestion des politiques de partage des ressources.

---
## Installation et Configuration
### Prérequis
- Node.js (>= 14.x)
- MongoDB (local ou cloud via MongoDB Atlas)

### Installation
```bash
# Cloner le projet
git clone <repository-url>
cd guildlog-api

# Installer les dépendances
npm install
```
### Configuration
Créer un fichier **.env** à la racine du projet :
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/guildlog
NODE_ENV=development
```
---
## Architecture du Projet
```
/guildlog-api
├── /routes
│   ├── members.js      # Routes pour les membres Discord
│   ├── guildMembers.js # Routes pour les membres in-game
├── /models
│   ├── Member.js       # Modèle Mongoose pour les membres Discord
│   ├── GuildMember.js  # Modèle Mongoose pour les membres in-game
├── /tests
│   ├── members.test.js  # Tests des routes Discord
│   ├── guildMembers.test.js # Tests des routes in-game
├── /utils
│   ├── logger.js       # Gestion des logs avec Winston
├── server.js           # Configuration du serveur Express
├── index.js            # Point d'entrée principal
└── .env                # Variables d'environnement
```

---
## Modèles de Données
### Member (Membre Discord)
```json
{
  "discordId": "123456789",
  "username": "Savage",
  "roles": ["Officier"],
  "isInGame": false,
  "leftAt": null
}
```
### GuildMember (Membre in-game)
```json
{
  "familyName": "SavageFamily",
  "guildRank": "Commandant",
  "isInGame": true,
  "linkedDiscordId": "123456789"
}
```

---
## Routes de l'API
### Membres Discord (`/api/members`)
- `GET /api/members` → Récupérer tous les membres Discord.
- `GET /api/members/:discordId` → Récupérer un membre par son ID.
- `POST /api/members` → Ajouter un membre.
- `PATCH /api/members/:discordId` → Mettre à jour un membre.
- `DELETE /api/members/:discordId` → Supprimer un membre.
- `GET /api/members/search?username=Savage&role=Officier` → Recherche avancée.

### Membres In-Game (`/api/guildmembers`)
- `GET /api/guildmembers` → Récupérer tous les membres in-game.
- `GET /api/guildmembers/:familyName` → Récupérer un membre par nom de famille.
- `POST /api/guildmembers` → Ajouter un membre in-game.
- `DELETE /api/guildmembers/:familyName` → Supprimer un membre in-game.
- `GET /api/guildmembers/search?familyName=SavageFamily` → Recherche avancée.

---
## Exemples de Requêtes
### Ajouter un Membre Discord
```bash
curl -X POST http://localhost:3000/api/members \
     -H "Content-Type: application/json" \
     -d '{"discordId": "123456789", "username": "Savage", "roles": ["Officier"]}'
```
### Rechercher un Membre par Rôle
```bash
curl -X GET "http://localhost:3000/api/members/search?role=Officier"
```
### Supprimer un Membre In-Game
```bash
curl -X DELETE http://localhost:3000/api/guildmembers/SavageFamily
```

---
## Exécution et Tests
### Lancer le serveur
```bash
npm start
```
### Lancer les tests
```bash
npm test
```
### Accès à Swagger (Documentation API)
Swagger est disponible à cette adresse une fois le serveur lancé :
```bash
http://localhost:3000/api-docs
```

---
## Explication du Fonctionnement des Fichiers
### `server.js`
- Initialise Express.
- Charge les routes et la documentation Swagger.
- Connecte à MongoDB.
- Démarre le serveur.

### `index.js`
- Point d'entrée principal, démarre `server.js`.

### `routes/members.js`
- Gère les membres Discord avec Express Router.
- Implémente la validation des requêtes avec `express-validator`.

### `models/Member.js`
- Modèle Mongoose pour stocker les membres Discord dans MongoDB.

### `tests/members.test.js`
- Utilise Jest et Supertest pour tester les routes API.

---
## Contribution
1. **Forker le repo**
2. **Créer une branche feature**
3. **Faire une Pull Request**

---
## Déploiement
### Via Docker
Créer un fichier **Dockerfile** :
```dockerfile
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```
### Via PM2
```bash
npm install pm2 -g
pm run build
pm start
pm run pm2:start
```

---
## Conclusion
Cette documentation couvre tous les aspects de l'API **GuildLog**. Si vous avez des questions, ouvrez une issue sur GitHub ! 🎯🔥
