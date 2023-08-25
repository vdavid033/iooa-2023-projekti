const express = require('express');
const router = express.Router();
const db = require('../baza');

// Endpoint za registraciju korisnika
router.post('/registracija', (req, res) => {
    const { korisnicko_ime, lozinka, email, ime, prezime } = req.body;

    // Provjeri jesu li svi potrebni podaci dostupni u zahtjevu
    if (!korisnicko_ime || !lozinka || !email || !ime || !prezime) {
        return res.status(400).json({ error: 'Nisu pruženi svi potrebni podaci.' });
    }

    // Provjeri postoji li korisnik s istim korisničkim imenom u bazi
    const provjeraKorisnickoImeQuery = 'SELECT * FROM korisnici WHERE korisnicko_ime = ?';
    db.query(provjeraKorisnickoImeQuery, [korisnicko_ime], (err, results) => {
        if (err) {
            console.error('Greška prilikom provjere korisničkog imena:', err.message);
            return res.status(500).json({ error: 'Greška prilikom provjere korisničkog imena.' });
        }

        if (results.length > 0) {
            return res.status(409).json({ error: 'Korisničko ime već postoji.' });
        }

        // Izvrši upit za unos novog korisnika u bazu podataka
        const unosKorisnikaQuery = 'INSERT INTO korisnici (korisnicko_ime, lozinka, email, ime, prezime) VALUES (?, ?, ?, ?, ?)';
        db.query(unosKorisnikaQuery, [korisnicko_ime, lozinka, email, ime, prezime], (err, result) => {
            if (err) {
                console.error('Greška prilikom unosa korisnika:', err.message);
                res.status(500).json({ error: 'Greška prilikom unosa korisnika' });
            } else {
                res.json({ success: true, message: 'Uspješno ste se registrirali.' });
            }
        });
    });
});

// Endpoint za prijavu korisnika
router.post('/prijava', (req, res) => {
    const { korisnicko_ime, lozinka } = req.body;

    // Provjeri jesu li svi potrebni podaci dostupni u zahtjevu
    if (!korisnicko_ime || !lozinka) {
        return res.status(400).json({ error: 'Nisu pruženi svi potrebni podaci.' });
    }

    // Provjeri postoji li korisnik s navedenim korisničkim imenom i lozinkom u bazi
    const provjeraKorisnikaQuery = 'SELECT * FROM korisnici WHERE korisnicko_ime = ? AND lozinka = ?';
    db.query(provjeraKorisnikaQuery, [korisnicko_ime, lozinka], (err, results) => {
        if (err) {
            console.error('Greška prilikom provjere korisnika:', err.message);
            return res.status(500).json({ error: 'Greška prilikom provjere korisnika.' });
        }

        if (results.length === 0) {
            return res.status(401).json({error: 'Neispravno korisničko ime ili lozinka.' });
        }

        res.json({ success: true,  message: 'Uspješno ste se prijavili.', korisnik: results });
    });
});

// Endpoint za dohvat svih korisnika
router.get('/', (req, res) => {
    // Izvrši upit za dohvat svih korisnika iz baze podataka
    const dohvatiKorisnikeQuery = 'SELECT * FROM korisnici';
    db.query(dohvatiKorisnikeQuery, (err, results) => {
        if (err) {
            console.error('Greška prilikom dohvaćanja korisnika:', err.message);
            return res.status(500).json({ error: 'Greška prilikom dohvaćanja korisnika.' });
        }

        res.json(results);
    });
});

module.exports = router;
