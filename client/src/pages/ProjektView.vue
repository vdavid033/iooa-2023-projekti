<template>
  <div class="projekt-view">
    <h2>Detalji projekta</h2>
    <div v-if="projekt">
      <h3>Naziv projekta: {{ projekt.naziv_projekta }}</h3>
    </div>
    <div v-else>
      <p>Projekt nije pronađen.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projekt: null
    }
  },
  created() {
    // Dohvat ID projekta iz rute
    const projektId = this.$route.params.projekt_id
    this.$axios
      .get(`http://localhost:3000/api/projekti/${projektId}`)
      .then((response) => {
        this.projekt = response.data
      })
      .catch((error) => {
        console.error('Greška pri dohvaćanju projekta:', error)
      })
  }
}
</script>

<style>
.projekt-view {
  max-width: 600px;
  margin: 0 auto;
}
</style>
