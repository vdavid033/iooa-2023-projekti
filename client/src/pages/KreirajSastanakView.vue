<template>
  <div class="kreiraj-sastanak">
    <h2>{{ viewingSastanak ? "SASTANAK" : "Novi sastanak" }}</h2>
    <h4>Projekt: {{ naziv_projekta }}</h4>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="naziv_sastanka" class="label">Naziv sastanka:</label>
        <input
          type="text"
          v-model="naziv_sastanka"
          required
          class="input-field"
          :disabled="
            viewingSastanak && prijavljenKorisnik.korisnik_id !== voditelj_id
          "
        />
      </div>
      
      <div class="form-group" v-if="viewingSastanak">
        <label for="datum_sastanka" class="label">Datum sastanka:</label>
        <input
          type="text"
          v-model="datum_sastanka"
          required
          class="input-field"
          disabled
        />
      </div>
      <div class="form-group" v-if="viewingSastanak">
        <label for="vrijeme_sastanka" class="label">Vrijeme sastanka:</label>
        <input
          type="time"
          v-model="vrijeme_sastanka"
          required
          class="input-field"
          disabled
        />
      </div>
      
      <div class="form-group">
        <label for="detalji_sastanka" class="label">Detalji:</label>
        <input
          type="text"
          v-model="detalji_sastanka"
          required
          class="input-field"
          :disabled="
            viewingSastanak && prijavljenKorisnik.korisnik_id !== voditelj_id
          "
        />
      </div>
      <!-- <q-btn
        v-if="!viewingSastanak && !sastanak_id"
        type="submit"
        class="btn btn-kreiraj-spremi"
      >
        Kreiraj
      </q-btn> -->
      <q-btn
        v-if="
          (viewingSastanak &&
            voditelj_id &&
            voditelj_id === prijavljenKorisnik.korisnik_id) ||
          !viewingSastanak
        "
        type="submit"
        class="btn btn-kreiraj-spremi"
      >
        {{ viewingSastanak ? "Spremi promjene" : "Kreiraj" }}
      </q-btn>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      prijavljenKorisnik: JSON.parse(localStorage.getItem("korisnik")),
      viewingSastanak: false,
      aktivnost: "",
      projekt: [],
      sastanak_id: "",
      projekt_id: "",
      datum_sastanka: "",
      vrijeme_sastanka: "",
      detalji_sastanka: "",
      naziv_sastanka: "",
      naziv_projekta: "",
      voditelj_id: null,
      postojeciSastanak: {
        sastanak_id: "",
        projekt_id: "",
        datum_sastanka: "",
        vrijeme_sastanka: "",
        detalji_sastanka: "",
        naziv_sastanka: "",
        naziv_projekta: "",
        voditelj_id: null,
      },
    };
  },
  created() {
    if (this.$route.params.sastanak_id) {
      this.viewingSastanak = true;
      this.sastanak_id = this.$route.params.sastanak_id;
      this.dohvatiDetaljeSastanka(this.sastanak_id);
    }
    if (this.$route.params.projekt_id) {
      this.projekt_id = this.$route.params.projekt_id;
      this.$axios
        .get(`http://localhost:3000/api/projekti/${this.projekt_id}`)
        .then((response) => {
          this.naziv_projekta = response.data.naziv_projekta;
          this.projekt = response.data;
        })
        .catch((error) => {
          console.error("Greška pri dohvaćanju postojećeg projekta:", error);
        });
    }
  },
  methods: {
    dohvatiDetaljeSastanka(sastanak_id) {
      this.$axios
        .get(`http://localhost:3000/api/sastanci/${sastanak_id}`)
        .then((response) => {
          this.postojeciSastanak = response.data;
          this.naziv_sastanka = this.postojeciSastanak.naziv_sastanka;
          this.datum_sastanka = this.convertISODateToFormattedDate(
            this.postojeciSastanak.datum_sastanka
          );
          this.vrijeme_sastanka = this.postojeciSastanak.vrijeme_sastanka;
          this.detalji_sastanka = this.postojeciSastanak.detalji_sastanka;
          this.naziv_projekta = this.postojeciSastanak.naziv_projekta;
          this.voditelj_id = this.postojeciSastanak.voditelj_id;
          this.projekt_id = this.postojeciSastanak.projekt_id;
        })
        .catch((error) => {
          console.error("Greška pri dohvaćanju postojećeg projekta:", error);
        });
    },
    convertISODateToFormattedDate(isoDate) {
      const date = new Date(isoDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    submitForm() {
      if (this.viewingSastanak) {
        this.aktivnost = "ažuriran";
        this.$axios
          .put(`http://localhost:3000/api/sastanci/${this.sastanak_id}`, {
            naziv_sastanka: this.naziv_sastanka,
            datum_sastanka: this.convertISODateToFormattedDate(
              this.datum_sastanka
            ),
            vrijeme_sastanka: this.vrijeme_sastanka,
            detalji_sastanka: this.detalji_sastanka,
            projekt_id: this.projekt_id,
          })
          .catch((error) => {
            console.error("Greška pri ažuriranju sastanka:", error);
            alert("Greška pri ažuriranju sastanka. Molimo pokušajte ponovno.");
          });
      } else {
        this.aktivnost = "kreiran";
       //postavljanje trenutnog datuma
        const currentDate = new Date();
        this.datum_sastanka = currentDate.toISOString().split("T")[0];

       //postavljanje trenutnog vremena
        const hours = String(currentDate.getHours()).padStart(2, "0");
        const minutes = String(currentDate.getMinutes()).padStart(2, "0");
        this.vrijeme_sastanka = `${hours}:${minutes}`;
        
        this.$axios
          .post("http://localhost:3000/api/sastanci", {
            naziv_sastanka: this.naziv_sastanka,
            datum_sastanka: this.convertISODateToFormattedDate(
              this.datum_sastanka
            ),
            vrijeme_sastanka: this.vrijeme_sastanka,
            projekt_id: this.projekt_id,
            detalji_sastanka: this.detalji_sastanka,
          })
          .catch((error) => {
            console.error("Greška pri kreiranju sastanka:", error);
            alert("Greška pri kreiranju sastanka. Molimo pokušajte ponovno.");
          });
      }
      alert(`Sastanak uspješno ` + this.aktivnost);
      this.$router.push(`/projekti/${this.projekt_id}`);
    },
  },
};
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
