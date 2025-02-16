require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("../utils/logger");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        logger.info("✅ Connexion à la base de données réussie !");
    } catch (error) {
        logger.error("❌ Erreur lors de la connexion à la base de données :", error.message, error.stack);
        process.exit(1);
    }
}

module.exports = connectDB;