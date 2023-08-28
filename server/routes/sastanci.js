const express = require("express");
const router = express.Router();
const db = require("../baza");

// Endpoint za dodavanje novog sastanka
router.post("/", (req, res) => {
    const { naziv_sastanka, datum_sastanka, detalji_sastanka, projekt_id, vrijeme_sastanka } = req.body;

    // Provjeri jesu li svi potrebni podaci dostupni u zahtjevu
    if (!naziv_sastanka || !datum_sastanka || !detalji_sastanka || !projekt_id || !vrijeme_sastanka) {
        return res.status(400).json({ error: "Nisu pruženi svi potrebni podaci." });
    }

    // Izvrši upit za unos novog sastanka u bazu podataka
    const sql =
        "INSERT INTO sastanci (projekt_id, datum_sastanka, detalji_sastanka, naziv_sastanka, vrijeme_sastanka) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [projekt_id, datum_sastanka, detalji_sastanka, naziv_sastanka, vrijeme_sastanka], (err, result) => {
        if (err) {
            console.error("Greška prilikom unosa sastanka:", err.message);
            res.status(500).json({ error: "Greška prilikom unosa sastanka" });
        }
    });
});

// Endpoint za dohvaćanje sastanaka po projektu
router.get("/projekt/:id", (req, res) => {
    const projectId = req.params.id;
    const sastanakSql = "SELECT * FROM sastanci WHERE projekt_id = ?";

    db.query(sastanakSql, [projectId], (err, sastanakResults) => {
        if (err) {
            console.error("Greška prilikom dohvaćanja sastanaka:", err.message);
            res.status(500).json({ error: "Greška prilikom dohvaćanja sastanaka" });
        } else {
            res.json(sastanakResults);
        }
    });
});

// Endpoint za dohvaćanje podataka o sastanku prema ID-u
router.get("/:id", (req, res) => {
    const sastanakId = req.params.id;

    const sql = `
        SELECT s.*, p.naziv_projekta, p.voditelj_id
        FROM sastanci s
        INNER JOIN projekti p ON s.projekt_id = p.projekt_id
        WHERE s.sastanak_id = ?
    `;

    db.query(sql, [sastanakId], (err, results) => {
        if (err) {
            console.error("Greška prilikom dohvaćanja sastanka:", err.message);
            res.status(500).json({ error: "Greška prilikom dohvaćanja sastanka" });
        } else {
            if (results.length === 0) {
                res.status(404).json({ error: "Sastanak nije pronađen" });
            } else {
                res.json(results[0]); // Pretpostavlja se da ćete dohvatiti samo jedan sastanak
            }
        }
    });
});

// Endpoint za ažuriranje postojećeg sastanka prema ID
router.put("/:id", (req, res) => {
    const id = req.params.id;
    const { naziv_sastanka, datum_sastanka, vrijeme_sastanka, detalji_sastanka, projekt_id } = req.body;

    // Provjeri jesu li svi potrebni podaci dostupni u zahtjevu
    if (!naziv_sastanka || !datum_sastanka || !vrijeme_sastanka || !detalji_sastanka || !projekt_id) {
        return res.status(400).json({ error: "Nisu pruženi svi potrebni podaci." });
    }

    // Izvrši upit za ažuriranje sastanka u bazi podataka
    const sql =
        "UPDATE sastanci SET naziv_sastanka = ?, datum_sastanka = ?, vrijeme_sastanka = ?, detalji_sastanka = ? WHERE sastanak_id = ?";
    db.query(
        sql,
        [naziv_sastanka, datum_sastanka, vrijeme_sastanka, detalji_sastanka, id],
        (err, result) => {
            if (err) {
                console.error("Greška prilikom ažuriranja sastanka:", err.message);
                res.status(500).json({ error: "Greška prilikom ažuriranja sastanka" });
            } else {
                res.json({ message: "Sastanak je uspješno ažuriran." });
            }
        }
    );
});

// Endpoint za dohvaćanje sastanaka po korisniku (članu ili voditelju)
router.get('/:korisnik_id/sastanci', (req, res) => {
    const korisnikId = req.params.korisnik_id;

    // Izvršite upit u bazi podataka za dohvaćanje sastanaka po korisniku
    // Prikaz sastanaka samo gdje je korisnik član ili voditelj projekta
    const sql = `
        SELECT s.*
        FROM sastanci s
        INNER JOIN projekt_clanovi pc ON s.projekt_id = pc.projekt_id
        WHERE pc.clan_id = ?
        UNION
        SELECT s.*
        FROM sastanci s
        INNER JOIN projekti p ON s.projekt_id = p.projekt_id
        WHERE p.voditelj_id = ?;
    `;

    db.query(sql, [korisnikId, korisnikId], (err, results) => {
        if (err) {
            console.error('Greška prilikom dohvaćanja sastanaka po korisniku:', err.message);
            return res.status(500).json({ error: 'Greška prilikom dohvaćanja sastanaka po korisniku.' });
        }

        res.json(results);
    });
});

module.exports = router;
