const express = require("express");
const { param, query, body, validationResult } = require("express-validator");
const router = express.Router();
const Member = require("../models/Member");

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

/**
 * @swagger
 * /api/members:
 *   get:
 *     summary: Récupère tous les membres Discord
 *     tags:
 *       - Members (Discord)
 *     responses:
 *       200:
 *         description: Liste des membres Discord
 */
router.get("/", async (req, res) => {
    try {
        const members = await Member.find();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/members/search:
 *   get:
 *     summary: Recherche des membres Discord par username, ID ou rôle
 *     tags:
 *       - Members (Discord)
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *       - in: query
 *         name: discordId
 *         schema:
 *           type: string
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Membres correspondant aux critères
 */
router.get("/search", [
    query("username").optional().isString(),
    query("discordId").optional().isString(),
    query("role").optional().isString(),
    validate
], async (req, res) => {
    try {
        const { username, discordId, role } = req.query;
        const filter = {};

        if (username) filter.username = { $regex: new RegExp(username, "i") };
        if (discordId) filter.discordId = discordId;
        if (role) filter.roles = { $in: [role] };  // 🔥 Correction ici

        const members = await Member.find(filter);
        if (!members.length) return res.status(404).json({ error: "Aucun membre trouvé." });

        return res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/members/{discordId}:
 *   get:
 *     summary: Récupère un membre Discord par son ID
 *     tags:
 *       - Members (Discord)
 *     parameters:
 *       - in: path
 *         name: discordId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Membre Discord trouvé
 */
router.get("/:discordId", 
    param("discordId").isString(),
    validate,
    async (req, res) => {
        try {
            const member = await Member.findOne({ discordId: req.params.discordId });
            if (!member) return res.status(404).json({ error: "Aucun membre trouvé." });
            return res.status(200).json(member);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

/**
 * @swagger
 * /api/members:
 *   post:
 *     summary: Ajoute un membre Discord
 *     tags:
 *       - Members (Discord)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       201:
 *         description: Membre Discord ajouté
 */
router.post("/", [
    body('username').notEmpty().withMessage("Le nom d'utilisateur est requis").isString(),
    validate
], async (req, res) => {
    try {
        const newMember = new Member(req.body);
        await newMember.save();
        res.status(201).json(newMember);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/members/{discordId}:
 *   patch:
 *     summary: Met à jour un membre Discord
 *     tags:
 *       - Members (Discord)
 *     parameters:
 *       - in: path
 *         name: discordId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Membre mis à jour
 */
router.patch("/:discordId", [
    param('discordId').isString(),
    body('username').optional().isString(),
    validate
], async (req, res) => {
    try {
        const updatedMember = await Member.findOneAndUpdate(
            { discordId: req.params.discordId },
            req.body,
            { new: true }
        );
        if (!updatedMember) return res.status(404).json({ error: "Aucun membre trouvé." });
        res.status(200).json(updatedMember);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/members/{discordId}:
 *   delete:
 *     summary: Supprime un membre Discord
 *     tags:
 *       - Members (Discord)
 *     parameters:
 *       - in: path
 *         name: discordId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Membre supprimé
 */
router.delete("/:discordId", async (req, res) => {
    try {
        const deletedMember = await Member.findOneAndDelete({ discordId: req.params.discordId });
        if (!deletedMember) return res.status(404).json({ error: "Aucun membre trouvé." });
        res.status(200).json({ message: "Membre supprimé." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
