const request = require("supertest");
const app = require("../server");
const GuildMember = require("../models/GuildMember");

describe("Tests des routes Guild Members (In-Game) API", () => {
    
    beforeEach(async () => {
        await GuildMember.deleteMany({});
    });

    test("GET /api/guildmembers - Devrait récupérer une liste vide de membres in-game", async () => {
        const response = await request(app).get("/api/guildmembers");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(0);
    });

    test("POST /api/guildmembers - Devrait ajouter un membre in-game", async () => {
        const newMember = {
            familyName: "SavageFamily",
            guildRank: "Commandant"
        };

        const response = await request(app)
            .post("/api/guildmembers")
            .send(newMember)
            .expect(201);

        expect(response.body.familyName).toBe(newMember.familyName);
        expect(response.body.guildRank).toBe(newMember.guildRank);
    });

    test("GET /api/guildmembers/:familyName - Devrait récupérer un membre par nom de famille", async () => {
        const member = await GuildMember.create({ familyName: "SavageFamily", guildRank: "Commandant" });

        const response = await request(app)
            .get(`/api/guildmembers/${member.familyName}`)
            .expect(200);

        expect(response.body.familyName).toBe("SavageFamily");
    });

    test("GET /api/guildmembers/search - Devrait rechercher un membre in-game par nom de famille", async () => {
        await GuildMember.create({ familyName: "SavageFamily", guildRank: "Commandant" });

        const response = await request(app)
            .get("/api/guildmembers/search?familyName=SavageFamily")
            .expect(200);

        expect(response.body.length).toBe(1);
        expect(response.body[0].familyName).toBe("SavageFamily");
    });

    test("GET /api/guildmembers/search - Devrait rechercher un membre in-game par grade", async () => {
        await GuildMember.create({ familyName: "SavageFamily", guildRank: "Commandant" });

        const response = await request(app)
            .get("/api/guildmembers/search?guildRank=Commandant")
            .expect(200);

        expect(response.body.length).toBe(1);
        expect(response.body[0].guildRank).toBe("Commandant");
    });

    test("DELETE /api/guildmembers/:familyName - Devrait supprimer un membre in-game", async () => {
        const member = await GuildMember.create({ familyName: "SavageFamily", guildRank: "Commandant" });

        await request(app)
            .delete(`/api/guildmembers/${member.familyName}`)
            .expect(200);

        const deletedMember = await GuildMember.findOne({ familyName: "SavageFamily" });
        expect(deletedMember).toBeNull();
    });
});
