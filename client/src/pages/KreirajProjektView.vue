<template>
  <div class="kreiraj-projekt">
    <h2>{{ editingProject ? "Uređivanje projekta" : "NOVI PROJEKT" }}</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="naziv" class="label">Naziv projekta:</label>
        <!-- Prijavljeni korisnik ce moci unositi u input samo ako je voditelj tog projekta ili ako kreira novi projekt -->
        <input
          type="text"
          v-model="naziv"
          required
          class="input-field"
          :disabled="
            (editingProject && datum_zavrsetka !== false) ||
            (editingProject &&
              voditelj &&
              voditelj !== prijavljenKorisnik.korisnik_id)
          "
        />
      </div>
      <div class="form-group">
        <label for="datum_pocetka" class="label">Datum početka:</label>
        <input
          type="date"
          v-model="datum_pocetka"
          required
          class="input-field"
          :disabled="
            (editingProject && datum_zavrsetka !== false) ||
            (editingProject &&
              voditelj &&
              voditelj !== prijavljenKorisnik.korisnik_id)
          "
        />
      </div>
      <div v-if="datum_zavrsetka" class="form-group">
        <label for="datum_zavrsetka" class="label">Datum završetka:</label>
        <input
          type="date"
          v-model="datum_zavrsetka"
          class="input-field"
          disabled
        />
      </div>
      <div class="form-group">

<label for="voditelj" class="label">Voditelj tima:</label>

<select
  v-model="voditelj"
  class="input-field"
  disabled
>
  <option
    :value="prijavljenKorisnik.korisnik_id"
  >
    {{ prijavljenKorisnik.ime }} {{ prijavljenKorisnik.prezime }}
  </option>
</select>
</div>
      <div
        v-if="
          !datum_zavrsetka &&
          projectId &&
          voditelj &&
          voditelj === prijavljenKorisnik.korisnik_id
        "
        class="form-group dodavanje-clanova"
      >
        <label for="clanovi" class="label">Popis članova:</label>
        <div class="dodaj-clana">
          <select
            v-model="noviClan"
            :disabled="voditelj && voditelj !== prijavljenKorisnik.korisnik_id"
            class="input-field"
          >
            <template
              v-for="korisnik in dostupniClanovi"
              :key="korisnik.korisnik_id"
            >
              <!-- Voditelja izbacimo iz liste clanova jer ako je voditelj to se podrazumjeva da je i clan -->
              <option
                v-if="korisnik.korisnik_id !== voditelj"
                :value="korisnik.korisnik_id"
              >
                {{ korisnik.ime }} {{ korisnik.prezime }}
              </option>
            </template>
          </select>
          <q-btn
            @click.prevent="dodajClana"
            :disabled="!noviClan || clanovi.length >= 5"
            class="btn-dodaj-clana"
          >
            Dodaj člana
          </q-btn>
          <router-link to="/registracija-clana" class="btn btn-dodaj-clana"
            >Registriraj člana</router-link
          >
        </div>
      </div>
      <div v-if="projectId" class="form-group">
        <label for="clanovi" class="label">Članovi tima:</label>
        <div class="clanovi-okvir">
          <div v-for="clan in clanovi" :key="clan.korisnik_id" class="clan">
            {{ clan.ime }} {{ clan.prezime }}
            <q-btn
              v-if="
                !datum_zavrsetka &&
                projectId &&
                voditelj &&
                voditelj === prijavljenKorisnik.korisnik_id
              "
              @click.prevent="ukloniClana(clan.korisnik_id)"
              class="btn-ukloni-clana"
            >
              Ukloni
            </q-btn>
          </div>
        </div>
      </div>
      <!--
            Pomocu ove komponente prikazujemo gumb za spremanje/kreiranje projekta. Ako je otvorena ruta za kreiranje novog projekta, tada ce se prikazati gumb
            "Kreiraj". Ako je otvorena ruta za azuriranje vec postojeceg projekta tada ce se prikazati gumb "Spremi promjene". Ako je otvoren vec postojeci
            projekt, a prijavljeni korisnik nije voditelj projekta kojeg je otvorio (tada je samo clan projekta), tada se nece prikazati niti jedan gumb.
      -->
      <div v-if="!datum_zavrsetka" class="kreiraj-azuriraj-gumbi">
        <q-btn
          v-if="
            (editingProject &&
              voditelj &&
              voditelj === prijavljenKorisnik.korisnik_id) ||
            !editingProject
          "
          type="submit"
          class="btn btn-kreiraj-spremi"
        >
          {{ editingProject ? "Spremi promjene" : "Kreiraj" }}
        </q-btn>
        <q-btn
          v-if="
            editingProject &&
            voditelj &&
            voditelj === prijavljenKorisnik.korisnik_id
          "
          class="btn btn-kreiraj-spremi"
          @click.prevent="zavrsiProjekt"
        >
          Završi projekt
        </q-btn>
      </div>
    </form>
    <div v-if="sastanci.length > 0" class="sastanci-container">
      <div class="sastanak sastanak-header">
        <div class="sastanak-info">
          <h3>Pregled sastanaka:</h3>
        </div>
      </div>
      <div
        v-for="sastanak in sastanci"
        :key="sastanak.sastanak_id"
        class="sastanak"
      >
        <div class="sastanak-info">
          <h3>{{ sastanak.naziv_sastanka }}</h3>
          <p class="vrijeme">{{ convertISODateToFormattedDate(sastanak.datum_sastanka)}} ({{ sastanak.vrijeme_sastanka }})</p>
        </div>
        <div class="sastanak-actions">
          <router-link
            :to="`/sastanci/${sastanak.sastanak_id}`"
            class="btn-detalji"
            >Detalji</router-link
          >
        </div>
      </div>
    </div>
    <router-link
        v-if="
          datum_zavrsetka === false &&
          editingProject &&
          voditelj &&
          voditelj === prijavljenKorisnik.korisnik_id
        "
        :to="`/sastanci/novi/${projectId}`"
        class="btn btn-kreiraj-spremi btn-kreiraj-sastanak"
        >Kreiraj sastanak
      </router-link>
  </div>
</template>

<script>
// #6 pregledavanje informacija o projektu na kojem član radi (cijela ova stranica)
// #1 kreiranje novog projekta (cijela ova stranica)
export default {
  data() {
    return {
      prijavljenKorisnik: JSON.parse(localStorage.getItem("korisnik")),
      aktivnost: "",
      naziv: "",
      datum_pocetka: "",
      datum_zavrsetka: "",
      voditelj: "",
      noviClan: null,
      clanovi: [],
      korisnici: [],
      sastanci: [],
      editingProject: false,
      projectId: null,
      existingProject: {
        naziv_projekta: "",
        datum_pocetka: "",
        datum_zavrsetka: "",
        voditelj_id: "",
        clanovi: [],
      },
    };
  },
  computed: {
    // Filtriranje popisa clanova
    dostupniClanovi() {
      return this.korisnici.filter(
        (korisnik) =>
          !this.clanovi.find(
            (clan) => clan.korisnik_id === korisnik.korisnik_id
          )
      );
    },
  },
  created() {
    // Ako se otvori stranica za azuriranje projekta postavi varijable
    this.voditelj = this.prijavljenKorisnik.korisnik_id;
    if (this.$route.params.projekt_id) {
      this.editingProject = true;
      this.projectId = this.$route.params.projekt_id;
      this.fetchProjectData(this.projectId);
      this.dohvatiSastanke(this.projectId);
    }
    this.fetchUsers();
  },
  methods: {
    // #17 axios za prikaz podataka o projektima
    // Ovdje dohvacamo podatke sa backenda vezane za projekt
    fetchProjectData(projectId) {
      this.$axios
        .get(`http://localhost:3000/api/projekti/${projectId}`)
        .then((response) => {
          this.existingProject = response.data;
          this.naziv = this.existingProject.naziv_projekta;
          this.datum_pocetka = this.convertISODateToFormattedDate(
            this.existingProject.datum_pocetka
          );
          this.datum_zavrsetka =
            this.existingProject.datum_zavrsetka !== null
              ? this.convertISODateToFormattedDate(
                  this.existingProject.datum_zavrsetka
                )
              : false;
          this.voditelj = this.existingProject.voditelj_id;
          this.clanovi = this.existingProject.clanovi;
        })
        .catch((error) => {
          console.error("Greška pri dohvaćanju postojećeg projekta:", error);
        });
    },
    // Funkcija za dohvacanje korisnika/clanova sa backend-a
    fetchUsers() {
      this.$axios
        .get("http://localhost:3000/api/korisnici")
        .then((response) => {
          this.korisnici = response.data;
        })
        .catch((error) => {
          console.error("Greška pri dohvaćanju korisnika:", error);
        });
    },
    // Funkcija za pretvaranje datuma u zeljeni format
    convertISODateToFormattedDate(isoDate) {
      const date = new Date(isoDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    // Ova funkcija se pokrece kada se podnese forma
    submitForm() {
      // Ako se podnese forma za azuriranje postojeceg projekta
      if (this.editingProject) {
        this.$axios
          .put(`http://localhost:3000/api/projekti/${this.projectId}`, {
            naziv_projekta: this.naziv,
            datum_pocetka: this.convertISODateToFormattedDate(
              this.datum_pocetka
            ),
            voditelj_id: this.voditelj,
            clanovi: this.clanovi.map((clan) => clan.korisnik_id),
          })
          .catch((error) => {
            console.error("Greška pri ažuriranju projekta:", error);
            alert("Greška pri ažuriranju projekta. Molimo pokušajte ponovno.");
          });
      } else {
        // Ako se podnese forma za kreiranje novog projekta
        this.$axios
          .post("http://localhost:3000/api/projekti", {
            naziv_projekta: this.naziv,
            datum_pocetka: this.convertISODateToFormattedDate(
              this.datum_pocetka
            ),
            voditelj_id: this.voditelj,
          })
          .catch((error) => {
            console.error("Greška pri kreiranju projekta:", error);
            alert("Greška pri kreiranju projekta. Molimo pokušajte ponovno.");
          });
      }
      this.aktivnost = this.editingProject ? "ažuriran" : "kreiran";
      alert(`Projekt uspješno ` + this.aktivnost);
      this.$router.push("/");
    },
    // Dodavanje clana u projekt
    dodajClana() {
      if (this.noviClan) {
        const clan = this.korisnici.find(
          (korisnik) => korisnik.korisnik_id === this.noviClan
        );
        this.$axios
          .post(
            `http://localhost:3000/api/projekti/${this.projectId}/clanovi`,
            {
              clanId: clan.korisnik_id,
            }
          )
          .then(() => {
            // Dodajte novog člana izravno u polje clanovi
            this.clanovi.push(clan);
            alert(
              clan.ime +
                " " +
                clan.prezime +
                " uspjesno dodan u projekt " +
                this.naziv
            );
            this.noviClan = null;
          })
          .catch((error) => {
            console.error("Greška pri dodavanju člana:", error);
          });
      }
    },
    // Uklanjanje clana iz projekta
    ukloniClana(korisnikId) {
      this.$axios
        .delete(
          `http://localhost:3000/api/projekti/${this.projectId}/clanovi/${korisnikId}`
        )
        .then(() => {
          // Uklonite člana iz polja clanovi
          this.clanovi = this.clanovi.filter(
            (clan) => clan.korisnik_id !== korisnikId
          );
          alert("Korisnik uspjesno uklonjen iz projekta");
        })
        .catch((error) => {
          console.error("Greška pri uklanjanju člana:", error);
        });
    },
    // Pozovi endpoint za zavrsavanje projekta koji ce dodati timestamp zavrsetka u bazu
    zavrsiProjekt() {
      if (confirm("Jeste li sigurni da želite zavrišiti projekt?")) {
        this.$axios
          .put(`http://localhost:3000/api/projekti/zavrsi/${this.projectId}`, {
            datum_zavrsetka: this.convertISODateToFormattedDate(Date.now()),
          })
          .then(() => {
            alert("Projekt uspješno završen!");
            this.$router.push("/");
          })
          .catch((error) => {
            console.error("Greška pri zavrsavanju projekta:", error);
            alert("Greška pri ažuriranju projekta. Molimo pokušajte ponovno.");
          });
      }
    },
    // Funkcija za dohvacanje sastanaka na temelju otvorenog projekta
    dohvatiSastanke(projectId) {
      this.$axios
        .get(`http://localhost:3000/api/sastanci/projekt/${projectId}`)
        .then((response) => {
          if (response.data && response.data.length > 0) {
            this.sastanci = response.data;
          }
        })
        .catch((error) => {
          console.error("Greška pri dohvaćanju sastanka:", error);
        });
    },
  },
};
</script>

<style scoped>
.kreiraj-projekt {
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
  transition: background-color 0.3s, color 0.3s, transform 0.3s;
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
  margin: 0;
}

.kreiraj-azuriraj-gumbi {
  display: flex;
  justify-content: space-evenly;
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

.sastanci-container {
  border: 3px solid black;
  border-radius: 5px;
  padding: 0 0;
  margin-right: 50px;
  border-bottom: none;
  margin-top: 50px;
  margin-bottom: 50px;
}

.sastanak {
  border-bottom: 3px solid black;
  padding: 10px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sastanak-header{
  background: rgb(165, 164, 164);
}

.sastanak-info {
  display: flex;
  align-items: center;
}

.vrijeme {
  margin: 0;
  margin-left: 20px;
  font-size: small;
  font-style: italic;
}

.sastanak h3 {
  margin: 0;
}

.sastanak-actions {
  display: flex;
  align-items: center;
}

.btn-detalji {
  display: block;
  padding: 10px 20px;
  width: 100px;
  background-color: #f7d31c;
  color: black;
  text-align: center;
  text-decoration: none;
  border: 3px solid black;
  border-radius: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition:
    background-color 0.3s,
    color 0.3s,
    transform 0.3s;
}

.btn-kreiraj-sastanak {
  margin-bottom: 50px;
}

</style>
