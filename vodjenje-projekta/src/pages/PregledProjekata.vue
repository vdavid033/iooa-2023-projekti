<template>
  <q-page padding>
    <div class="container">
      <h1 class="title">Pregled projekata</h1>
      <q-table :rows="projekti" :columns="columns" row-key="id" class="table">
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td>{{ props.row.NAZIV_PROJEKTA }}</q-td>
            <q-td>{{ new Date(props.row.DATUM_POCETKA).toLocaleDateString('hr-HR') }}</q-td>
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
        { name: 'brojClanovaTima', required: true, label: 'Broj članova tima', align: 'left', field: 'brojClanovaTima', sortable: true },
        { name: 'aktivan', required: true, label: 'Aktivan', align: 'left', field: 'aktivan', sortable: true }
      ]
    }
  },
  methods: {
    async getProjekti() {
      try {
        const response = await axios.get('http://localhost:3001/getProjekti');
        this.projekti = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    addProject() {
      // Logika za unos novog projekta
    }
  },
  mounted() {
    this.getProjekti();
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 32px;
  margin-bottom: 20px;
}

.table {
  width: 80%;
  margin-top: 20px;
  margin-bottom: 20px;
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

@media only screen and (max-width: 600px) {
  .container {
    width: 90%;
  }
}
</style>
