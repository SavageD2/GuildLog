const express = require("express");
const { param, query, body, validationResult } = require("express-validator");
const router = express.Router();
const GuildMember = require("../models/GuildMember");

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

/**
 * @swagger
 * /api/guildmembers:
 *   get:
 *     summary: Récupère tous les membres in-game
 *     tags:
 *       - Guild Members (In-Game)
 *     responses:
 *       200:
 *         description: Liste des membres in-game
 */
router.get("/", async (req, res) => {
    try {
        const members = await GuildMember.find();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/guildmembers/search:
 *   get:
 *     summary: Recherche des membres in-game par nom de famille ou grade
 *     tags:
 *       - Guild Members (In-Game)
 *     parameters:
 *       - in: query
 *         name: familyName
 *         schema:
 *           type: string
 *       - in: query
 *         name: guildRank
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Membres correspondant aux critères
 */
router.get("/search", [
    query("familyName").optional().isString(),
    query("guildRank").optional().isString(),
    validate
], async (req, res) => {
    try {
        const { familyName, guildRank } = req.query;
        const filter = {};

        if (familyName) filter.familyName = { $regex: new RegExp(familyName, "i") };
        if (guildRank) filter.guildRank = { $regex: new RegExp(guildRank, "i") };

        const members = await GuildMember.find(filter);
        if (!members.length) return res.status(404).json({ error: "Aucun membre trouvé." });

        return res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/guildmembers/{familyName}:
 *   get:
 *     summary: Récupère un membre in-game par son nom de famille
 *     tags:
 *       - Guild Members (In-Game)
 *     parameters:
 *       - in: path
 *         name: familyName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Membre in-game trouvé
 */
router.get("/:familyName", async (req, res) => {
    try {
        const member = await GuildMember.findOne({ familyName: req.params.familyName });
        if (!member) return res.status(404).json({ error: "Aucun membre trouvé." });
        res.status(200).json(member);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/guildmembers:
 *   post:
 *     summary: Ajoute un membre in-game
 *     tags:
 *       - Guild Members (In-Game)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               familyName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Membre in-game ajouté
 */
router.post("/", [
    body('familyName').notEmpty().withMessage("Le nom de famille est requis").isString(),
    validate
], async (req, res) => {
    try {
        const newGuildMember = new GuildMember(req.body);
        await newGuildMember.save();
        res.status(201).json(newGuildMember);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/guildmembers/{familyName}:
 *   delete:
 *     summary: Supprime un membre in-game
 *     tags:
 *       - Guild Members (In-Game)
 *     parameters:
 *       - in: path
 *         name: familyName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Membre supprimé
 */
router.delete("/:familyName", async (req, res) => {
    try {
        const deletedMember = await GuildMember.findOneAndDelete({ familyName: req.params.familyName });
        res.status(200).json({ message: "Membre supprimé." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
