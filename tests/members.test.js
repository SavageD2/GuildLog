const request = require("supertest");
const app = require("../server");
const Member = require("../models/Member");

describe("Tests des routes Members (Discord) API", () => {
    
    beforeEach(async () => {
        await Member.deleteMany({});
    });

    test("GET /api/members - Devrait récupérer une liste vide de membres", async () => {
        const response = await request(app).get("/api/members");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(0);
    });

    test("POST /api/members - Devrait ajouter un membre", async () => {
        const newMember = {
            username: "Savage",
            roles: ["Officier"],
            discordId: "12345"
        };

        const response = await request(app)
            .post("/api/members")
            .send(newMember)
            .expect(201);

        expect(response.body.username).toBe(newMember.username);
        expect(response.body.roles).toContain("Officier");
    });

    test("GET /api/members/:discordId - Devrait récupérer un membre par ID Discord", async () => {
        const member = await Member.create({
            username: "Savage",
            roles: ["Officier"],
            discordId: "12345"
        });

        const response = await request(app)
            .get(`/api/members/${member.discordId}`)
            .expect(200);

        expect(response.body.username).toBe("Savage");
    });

    test("GET /api/members/search - Devrait rechercher un membre par username", async () => {
        await Member.create({ username: "Savage", roles: ["Officier"], discordId: "12345" });

        const response = await request(app)
            .get("/api/members/search?username=Savage")
            .expect(200);

        expect(response.body.length).toBe(1);
        expect(response.body[0].username).toBe("Savage");
    });

    test("GET /api/members/search - Devrait rechercher un membre par rôle", async () => {
        await Member.create({ username: "Savage", roles: ["Officier"], discordId: "12345" });

        const response = await request(app)
            .get("/api/members/search?role=Officier")
            .expect(200);

        expect(response.body.length).toBe(1);
        expect(response.body[0].roles).toContain("Officier");
    });

    test("PATCH /api/members/:discordId - Devrait mettre à jour un membre", async () => {
        const member = await Member.create({
            username: "Savage",
            roles: ["Officier"],
            discordId: "12345"
        });

        const updatedData = { username: "SavageUpdated" };

        const response = await request(app)
            .patch(`/api/members/${member.discordId}`)
            .send(updatedData)
            .expect(200);

        expect(response.body.username).toBe("SavageUpdated");
    });

    test("DELETE /api/members/:discordId - Devrait supprimer un membre", async () => {
        const member = await Member.create({
            username: "Savage",
            roles: ["Officier"],
            discordId: "12345"
        });

        await request(app)
            .delete(`/api/members/${member.discordId}`)
            .expect(200);

        const deletedMember = await Member.findOne({ discordId: "12345" });
        expect(deletedMember).toBeNull();
    });
});
