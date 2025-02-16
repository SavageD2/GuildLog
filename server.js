require("dotenv").config();
const express = require("express");
const connectDB = require("./services/database");
const memberRoutes = require("./routes/members");
const logger = require("./utils/logger");
const cors = require("cors");


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/members", memberRoutes);

app.listen(PORT, () => {
    logger.info(`🚀 Serveur Express démarré sur http://localhost:${PORT}`);
});

module.exports = app;

