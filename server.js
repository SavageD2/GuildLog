require("dotenv").config();
const express = require("express");
const connectDB = require("./services/database");
const memberRoutes = require("./routes/members");
const guildMembersRoutes = require("./routes/guildMembers");
const logger = require("./utils/logger");
const cors = require("cors");
const figlet = require("figlet");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GuildLog API",
      version: "1.0.0",
      description: "API pour gérer les membres de la guilde in-game et Discord",
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ["./routes/members.js", "./routes/guildMembers.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/members", memberRoutes);
app.use("/api/guildmembers", guildMembersRoutes);

if (process.env.NODE_ENV !== "test") {
  figlet("GuildLog API", (err, data) => {
    if (err) {
      logger.error("❌ Erreur lors du chargement de la bannière ASCII");
    } else {
      logger.info("\n" + data + "\n");
    }
    app.listen(PORT, () => {
      logger.info(`🚀 Serveur Express démarré sur http://localhost:${PORT}`);
    });
  });
}

module.exports = app;
