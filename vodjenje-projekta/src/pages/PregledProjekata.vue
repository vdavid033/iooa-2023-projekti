<template>
  <q-page class="bg-image">
    <div class="container">
      <h1 class="title">Pregled projekata</h1>

      <div class="filter-container">
        <div class="filter-box">
          <span class="filter-label">Prikaži samo aktivne projekte:</span>
          <q-checkbox v-model="filterAktivni" color="primary" class="filter-checkbox" />
        </div>
        <div class="filter-box">
          <span class="filter-label">Filtriraj po nazivu projekta:</span>
          <q-input v-model="filterNaziv" type="text" outlined class="filter-input" />
        </div>
      </div>

      <q-table :rows="filteredProjekti" :columns="columns" row-key="id" class="table">
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td>{{ props.row.NAZIV_PROJEKTA }}</q-td>
            <q-td>{{ new Date(props.row.DATUM_POCETKA).toLocaleDateString('hr-HR') }}</q-td>
            <q-td>
              {{ props.row.DATUM_ZAVRSETKA ? new Date(props.row.DATUM_ZAVRSETKA).toLocaleDateString('hr-HR') : '/' }}
            </q-td>
            <q-td>{{ props.row.BROJ_CLANOVA_TIMA }}</q-td>
            <q-td>{{ props.row.AKTIVAN }}</q-td>
          </q-tr>
        </template>
      </q-table>

      <div class="button-container">
        <q-btn class="add-project-button" @click="addProject">Unos novog projekta</q-btn>
      </div>
    </div>
  </q-page>
</template>


<script>
import axios from 'axios';

export default {
  name: 'PregledProjekata',
  data() {
    return {
      projekti: [],
      columns: [
        { name: 'naziv', required: true, label: 'Naziv projekta', align: 'left', field: 'naziv', sortable: true },
        { name: 'datumPocetka', required: true, label: 'Datum početka', align: 'left', field: 'datumPocetka', sortable: true },
        { name: 'datumZavrsetka', required: true, label: 'Datum završetka', align: 'left', field: 'datumZavrsetka', sortable: true },
        { name: 'brojClanovaTima', required: true, label: 'Broj članova tima', align: 'left', field: 'brojClanovaTima', sortable: true },
        { name: 'aktivan', required: true, label: 'Aktivan', align: 'left', field: 'aktivan', sortable: true }
      ],
      filterAktivni: false,
      filterNaziv: ''
    }
  },
  computed: {
    filteredProjekti() {
      return this.filterProjekti();
    }
  },
  methods: {
    async getProjekti() {
      try {
        const response = await axios.get('http://localhost:9000/getProjekti');
        this.projekti = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    filterProjekti() {
      let filtered = this.projekti;

      if (this.filterAktivni) {
        filtered = filtered.filter(projekt => projekt.AKTIVAN === 'DA');
      }

      if (this.filterNaziv) {
        const filterText = this.filterNaziv.toLowerCase();
        filtered = filtered.filter(projekt => projekt.NAZIV_PROJEKTA.toLowerCase().includes(filterText));
      }

      return filtered;
    },

    addProject() {
      // Logika za unos novog projekta
    },
  },
  mounted() {
    this.getProjekti();
  }
}
</script>


<style scoped>
.bg-image {
  background-image: url(../assets/POZADINSKA-SLIKA.png);
  background-repeat: no-repeat;
  background-size: cover;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 32px;
  margin-bottom: 20px;
  font-weight: bold;
}

.table {
  width: 80%;
  margin-top: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  width: 80%;
}

.add-project-button {
  background-color: #ECB22E;
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 18px;
}

.add-project-button:hover {
  background-color: #E01E5A;
}

.filter-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.filter-box {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.filter-label {
  margin-right: 10px;
}

.filter-checkbox {
  margin-left: 5px;
}

.filter-input {
  width: 200px;
  margin-left: 10px;
}

@media only screen and (max-width: 600px) {
  .container {
    width: 90%;
  }
}
</style>