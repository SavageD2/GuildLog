require("dotenv").config();
const logger = require("./utils/logger");
const {startBot} = require("./services/bot");
const app = require("./server");

logger.info("🚀 Démarrage du bot Discord...");
startBot();