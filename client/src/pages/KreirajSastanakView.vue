<template>
  <div class="kreiraj-sastanak">
    <h2>{{ viewingSastanak ? 'SASTANAK' : 'NOVI SASTANAK' }}</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="naziv" class="label">Naziv sastanka:</label>
        <input
          type="text"
          v-model="naziv"
          required
          class="input-field"
          :disabled="viewingSastanak"
        />
      </div>
      <div class="form-group">
        <label for="datum_sastanka" class="label">Datum sastanka:</label>
        <input
          type="date"
          v-model="datum_sastanka"
          required
          class="input-field"
          :disabled="viewingSastanak"
        />
      </div>
      <div class="form-group">
        <label for="detalji" class="label">Detalji:</label>
        <input
          type="text"
          v-model="detalji"
          required
          class="input-field"
          :disabled="viewingSastanak"
        />
      </div>
      <q-btn
        v-if="!viewingSastanak && !sastanakId"
        type="submit"
        class="btn btn-kreiraj-spremi"
      >
        Kreiraj
      </q-btn>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      prijavljenKorisnik: JSON.parse(localStorage.getItem('korisnik')),
      naziv: '',
      datum_sastanka: '',
      voditelj: '',
      noviClan: null,
      clanovi: [],
      korisnici: [],
      viewingSastanak: false,
      sastanakId: null,
      existingProject: {
        naziv_projekta: '',
        datum_sastanka: '',
        voditelj_id: '',
        clanovi: []
      }
    }
  },
  computed: {
    dostupniClanovi() {
      return this.korisnici.filter(
        (korisnik) => !this.clanovi.find((clan) => clan.korisnik_id === korisnik.korisnik_id)
      )
    }
  },
  created() {
    if (this.$route.params.projekt_id) {
      this.viewingSastanak = true
      this.sastanakId = this.$route.params.projekt_id
      this.fetchProjectData(this.sastanakId)
    }
    this.fetchUsers()
  },
  methods: {
    // #17 axios za prikaz podataka o projektima
    fetchProjectData(sastanakId) {
      this.$axios
        .get(`http://localhost:3000/api/projekti/${sastanakId}`)
        .then((response) => {
          this.existingProject = response.data
          this.naziv = this.existingProject.naziv_projekta
          this.datum_sastanka = this.convertISODateToFormattedDate(
            this.existingProject.datum_sastanka
          )
          this.voditelj = this.existingProject.voditelj_id
          this.clanovi = this.existingProject.clanovi
        })
        .catch((error) => {
          console.error('Greška pri dohvaćanju postojećeg projekta:', error)
        })
    },
    fetchUsers() {
      this.$axios
        .get('http://localhost:3000/api/korisnici')
        .then((response) => {
          this.korisnici = response.data
        })
        .catch((error) => {
          console.error('Greška pri dohvaćanju korisnika:', error)
        })
    },
    convertISODateToFormattedDate(isoDate) {
      const date = new Date(isoDate)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    submitForm() {
      if (this.viewingSastanak) {
        this.$axios
          .put(`http://localhost:3000/api/projekti/${this.sastanakId}`, {
            naziv_projekta: this.naziv,
            datum_sastanka: this.convertISODateToFormattedDate(this.datum_sastanka),
            voditelj_id: this.voditelj,
            clanovi: this.clanovi.map((clan) => clan.korisnik_id)
          })
          .then(() => {
            this.$router.push('/projekti')
          })
          .catch((error) => {
            console.error('Greška pri ažuriranju projekta:', error)
            alert('Greška pri ažuriranju projekta. Molimo pokušajte ponovno.')
          })
      } else {
        this.$axios
          .post('http://localhost:3000/api/projekti', {
            naziv_projekta: this.naziv,
            datum_sastanka: this.convertISODateToFormattedDate(this.datum_sastanka),
            voditelj_id: this.voditelj
          })
          .then(() => {
            alert('Projekt kreiran')
            this.$router.push('/projekti')
          })
          .catch((error) => {
            console.error('Greška pri kreiranju projekta:', error)
            alert('Greška pri kreiranju projekta. Molimo pokušajte ponovno.')
          })
      }
    },
    dodajClana() {
      if (this.noviClan) {
        const clan = this.korisnici.find((korisnik) => korisnik.korisnik_id === this.noviClan)
        this.$axios
          .post(`http://localhost:3000/api/projekti/${this.sastanakId}/clanovi`, {
            clanId: clan.korisnik_id
          })
          .then(() => {
            // Dodajte novog člana izravno u polje clanovi
            this.clanovi.push(clan)
            alert(clan.ime + ' ' + clan.prezime + ' uspjesno dodan u projekt ' + this.naziv)
            this.noviClan = null
          })
          .catch((error) => {
            console.error('Greška pri dodavanju člana:', error)
          })
      }
    },

    ukloniClana(korisnikId) {
      this.$axios
        .delete(`http://localhost:3000/api/projekti/${this.sastanakId}/clanovi/${korisnikId}`)
        .then(() => {
          // Uklonite člana iz polja clanovi
          this.clanovi = this.clanovi.filter((clan) => clan.korisnik_id !== korisnikId)
          alert('Korisnik uspjesno uklonjen iz projekta')
        })
        .catch((error) => {
          console.error('Greška pri uklanjanju člana:', error)
        })
    }
  }
}
</script>

<style scoped>
.kreiraj-sastanak {
  margin-left: 250px;
  float: left;
  width: 70vw;
}

.form-group {
  display: flex;
  justify-content: space-between;
  margin: 25px 0;
}

.dodaj-clana {
  align-items: center;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
}

.btn-dodaj-clana {
  font-size: small;
  cursor: pointer;
  margin-left: 10px;
  display: block;
  padding: 10px 20px;
  width: 150px;
  background-color: white;
  color: black;
  text-decoration: none;
  border: 3px solid black;
  border-radius: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition:
    background-color 0.3s,
    color 0.3s,
    transform 0.3s;
}

.clanovi-okvir {
  border: 1px solid #ccc;
  padding: 8px;
  margin-top: 5px;
  border: 3px solid black;
  width: 70%;
}

.clanovi-okvir div {
  display: block;
  align-items: center;
  margin-bottom: 5px;
}

.clanovi-okvir button {
  margin-left: 10px;
}

.btn-kreiraj-spremi {
  cursor: pointer;
}

.input-field {
  width: 70%;
  padding: 10px;
  border: 3px solid black;
  margin-left: 50px;
}

.label {
  font-weight: bold;
}
</style>
