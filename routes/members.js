const express = require("express");
const router = express.Router();
const Member = require("../models/Member");

router.get("/", async (req, res) => {
    try {
        const members = await Member.find();
        res.json(members);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des membres." });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const member = await Member.findOne({ discordId: req.params.id });
        if (!member) return res.status(404).json({ error: "Membre non trouvé." });
        res.json(member);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération du membre." });
    }
});

module.exports = router;
