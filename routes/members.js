const express = require("express");
const router = express.Router();
const Member = require("../models/Member");

/**
 * @swagger
 * /api/members:
 *   get:
 *     summary: Récupère tous les membres
 *     responses:
 *       200:
 *         description: Liste des membres.
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
 * /api/members/id/{id}:
 *   get:
 *     summary: Récupère un membre par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Membre récupéré avec succès.
 */
router.get("/id/:id", async (req, res) => {
    try {
        const member = await Member.findOne({ discordId: req.params.id });
        if (!member) return res.status(404).json({ error: "Membre non trouvé." });
        res.status(200).json(member);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/members:
 *   post:
 *     summary: Ajoute un membre in-game
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *               guildRank:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *               isInGame:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Membre ajouté avec succès.
 */
router.post("/", async (req, res) => {
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
 * /api/members/{id}:
 *   patch:
 *     summary: Met à jour un membre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Membre mis à jour.
 */
router.patch("/:id", async (req, res) => {
    try {
        const updatedMember = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMember) return res.status(404).json({ error: "Membre non trouvé." });
        res.status(200).json(updatedMember);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/members/search:
 *   get:
 *     summary: Recherche des membres
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *       - in: query
 *         name: guildRank
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Membres correspondant aux critères.
 */
router.get("/search", async (req, res) => {
    try {
        const { username, role, guildRank } = req.query;
        const filter = {};

        if (username) filter.username = { $regex: new RegExp(username, 'i') };
        if (role) filter.roles = { $in: [new RegExp(role, 'i')] };
        if (guildRank) filter["inGameDetails.guildRank"] = { $regex: new RegExp(guildRank, 'i') };

        const members = await Member.find(filter);
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
