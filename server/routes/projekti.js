const express = require("express");
const router = express.Router();
const db = require("../baza");

// Endpoint za dohvaćanje svih projekata s informacijama o voditelju tima
router.get("/", (req, res) => {
    const sql = `
        SELECT
            projekti.*,
            korisnici.ime AS voditelj_ime,
            korisnici.prezime AS voditelj_prezime
        FROM
            projekti
        LEFT JOIN
            korisnici ON projekti.voditelj_id = korisnici.korisnik_id
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Greška prilikom dohvaćanja projekata:", err.message);
            res.status(500).json({ error: "Greška prilikom dohvaćanja projekata" });
        } else {
            res.json(results);
        }
    });
});

// Endpoint za dohvaćanje pojedinog projekta prema ID-u
// #15 api za dohvat podataka o projektima
router.get("/:id", (req, res) => {
    const projectId = req.params.id;
    const projectSql = "SELECT * FROM projekti WHERE projekt_id = ?";
    const membersSql = `
        SELECT korisnici.*
        FROM projekt_clanovi
        INNER JOIN korisnici ON projekt_clanovi.clan_id = korisnici.korisnik_id
        WHERE projekt_clanovi.projekt_id = ?
    `;

    db.query(projectSql, [projectId], (err, projectResults) => {
        if (err) {
            console.error("Greška prilikom dohvaćanja projekta:", err.message);
            res.status(500).json({ error: "Greška prilikom dohvaćanja projekta" });
        } else {
            if (projectResults.length === 0) {
                res.status(404).json({ error: "Projekt nije pronađen" });
            } else {
                const project = projectResults[0];

                db.query(membersSql, [projectId], (err, membersResults) => {
                    if (err) {
                        console.error("Greška prilikom dohvaćanja članova projekta:", err.message);
                        res.status(500).json({ error: "Greška prilikom dohvaćanja članova projekta" });
                    } else {
                        project.clanovi = membersResults; // Dodajte članove u objekt projekta
                        res.json(project);
                    }
                });
            }
        }
    });
});

// Endpoint za dodavanje novog projekta
// #13 unos projekta
router.post("/", (req, res) => {
    const { naziv_projekta, datum_pocetka, voditelj_id } = req.body;

    // Provjeri jesu li svi potrebni podaci dostupni u zahtjevu
    if (!naziv_projekta || !datum_pocetka || !voditelj_id) {
        return res.status(400).json({ error: "Nisu pruženi svi potrebni podaci." });
    }

    // Izvrši upit za unos novog projekta u bazu podataka
    const sql =
        "INSERT INTO projekti (naziv_projekta, datum_pocetka, voditelj_id) VALUES (?, ?, ?)";
    db.query(sql, [naziv_projekta, datum_pocetka, voditelj_id], (err, result) => {
        if (err) {
            console.error("Greška prilikom unosa projekta:", err.message);
            res.status(500).json({ error: "Greška prilikom unosa projekta" });
        }
    });
});

// Endpoint za ažuriranje postojećeg projekta prema ID-u
router.put("/:id", (req, res) => {
    const id = req.params.id;
    const { naziv_projekta, datum_pocetka, voditelj_id } = req.body;

    // Provjeri jesu li svi potrebni podaci dostupni u zahtjevu
    if (!naziv_projekta || !datum_pocetka || !voditelj_id) {
        return res.status(400).json({ error: "Nisu pruženi svi potrebni podaci." });
    }

    // Izvrši upit za ažuriranje projekta u bazi podataka
    const sql =
        "UPDATE projekti SET naziv_projekta = ?, datum_pocetka = ?, voditelj_id = ? WHERE projekt_id = ?";
    db.query(
        sql,
        [naziv_projekta, datum_pocetka, voditelj_id, id],
        (err, result) => {
            if (err) {
                console.error("Greška prilikom ažuriranja projekta:", err.message);
                res.status(500).json({ error: "Greška prilikom ažuriranja projekta" });
            } else {
                if (result.affectedRows === 0) {
                    res.status(404).json({ error: "Projekt nije pronađen" });
                } else {
                    res.json({ message: "Projekt je uspješno ažuriran." });
                }
            }
        }
    );
});

// Endpoint za dodavanje člana projektu
// #13 dodavanje clanova tima u projekt
router.post("/:id/clanovi", (req, res) => {
    const projectId = req.params.id;
    const { clanId } = req.body;

    const insertMemberSql = 'INSERT INTO projekt_clanovi (projekt_id, clan_id) VALUES (?, ?)';
    db.query(insertMemberSql, [projectId, clanId], (err, result) => {
        if (err) {
            console.error('Greška prilikom dodavanja člana:', err.message);
            res.status(500).json({ error: 'Greška prilikom dodavanja člana' });
        } else {
            res.json({ message: 'Član uspješno dodan projektu.' });
        }
    });
});

// Endpoint za uklanjanje člana iz projekta
// #13 uklanjanje clanova tima iz projekta
router.delete("/:id/clanovi/:clanId", (req, res) => {
    const projectId = req.params.id;
    const clanId = req.params.clanId;

    const deleteMemberSql = 'DELETE FROM projekt_clanovi WHERE projekt_id = ? AND clan_id = ?';
    db.query(deleteMemberSql, [projectId, clanId], (err, result) => {
        if (err) {
            console.error('Greška prilikom uklanjanja člana:', err.message);
            res.status(500).json({ error: 'Greška prilikom uklanjanja člana' });
        } else {
            res.json({ message: 'Član uspješno uklonjen iz projekta.' });
        }
    });
});

// Endpoint za dohvaćanje projekata po korisniku (članu ili voditelju)
router.get('/:korisnik_id/projekti', (req, res) => {
    const korisnikId = req.params.korisnik_id;

    // Izvršite upit u bazi podataka za dohvaćanje projekata po korisniku
    const sql = `
    SELECT p.*
    FROM projekti p
    WHERE p.voditelj_id = ?
    UNION
    SELECT p.*
    FROM projekti p
    INNER JOIN projekt_clanovi pc ON p.projekt_id = pc.projekt_id
    WHERE pc.clan_id = ?;
    `;

    db.query(sql, [korisnikId, korisnikId], (err, results) => {
        if (err) {
            console.error('Greška prilikom dohvaćanja projekata po korisniku:', err.message);
            return res.status(500).json({ error: 'Greška prilikom dohvaćanja projekata po korisniku.' });
        }

        res.json(results);
    });
});

// Endpoint za završavanje postojećeg projekta prema ID-u
router.put("/zavrsi/:id", (req, res) => {
    const id = req.params.id;
    const { datum_zavrsetka } = req.body;

    // Provjeri jesu li svi potrebni podaci dostupni u zahtjevu
    if (!datum_zavrsetka) {
        return res.status(400).json({ error: "Doslo je do greske." });
    }

    // Izvrši upit za ažuriranje projekta u bazi podataka
    const sql =
        "UPDATE projekti SET datum_zavrsetka = ? WHERE projekt_id = ?";
    db.query(
        sql,
        [datum_zavrsetka, id],
        (err, result) => {
            if (err) {
                console.error("Greška prilikom završavanja projekta:", err.message);
                res.status(500).json({ error: "Greška prilikom završavanja projekta" });
            } else {
                if (result.affectedRows === 0) {
                    res.status(404).json({ error: "Projekt nije pronađen" });
                } else {
                    res.json({ message: "Projekt je uspješno završen." });
                }
            }
        }
    );
});

module.exports = router;
