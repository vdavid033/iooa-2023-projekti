<template>
  <div class="projekti">
    <div class="title-and-button">
      <h2 class="page-title">{{ projekti.length > 0 ? "PROJEKTI" : "NEMA PROJEKATA ZA PRIKAZ"  }}</h2>
    </div>
    <div v-if="projekti.length>0" class="projekt-container">
      <div class="projekt projekt-header">
        <div class="projekt-info">
          <h3>Pregled projekata:</h3>
        </div>
      </div>
      <div v-for="projekt in projekti" :key="projekt.id" class="projekt">
        <div class="projekt-info">
          <h3>{{ projekt.naziv_projekta }}</h3>
        </div>
        <div class="projekt-actions">
          <router-link :to="`/projekti/${projekt.projekt_id}`" class="btn-detalji">Detalji</router-link>
        </div>
      </div>
    </div>
    <router-link to="/projekti/novi" class="btn-novi-projekt">Stvori novi projekt</router-link>
  </div>
</template>

<script>
// #14 stranica za pregled projekata (cjela komponenta)
export default {
  data() {
    return {
      projekti: []
    }
  },
  computed: {
    isLoggedIn() {
      return localStorage.getItem('prijavljen') === 'true'
    },
    user() {
      return JSON.parse(localStorage.getItem('korisnik'))
    }
  },
  created() {
    if (this.isLoggedIn) {
      this.$axios
        .get(`http://localhost:3000/api/projekti/${this.user.korisnik_id}/projekti`)
        .then((response) => {
          this.projekti = response.data
        })
        .catch((error) => {
          console.error('Greška pri dohvaćanju projekata:', error)
        })
    }
  }
}
</script>

<style>
.projekti {
  max-width: 100%;
  margin-left: 250px;
}

.page-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.title-and-button {
  display: flex;
  align-items: center;
}

.projekt-container {
  border: 3px solid black;
  border-radius: 5px;
  padding: 0 0;
  margin-right: 50px;
  border-bottom: none;
}

.projekt {
  border-bottom: 3px solid black;
  padding: 10px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.projekt-header{
  background: rgb(165, 164, 164);
}

.projekt-info {
  display: flex;
  align-items: center;
}

.projekt h3 {
  margin: 0;
}

.projekt-actions {
  display: flex;
  align-items: center;
}

.btn-detalji {
  display: block;
  padding: 10px 20px;
  width: 100px;
  background-color: #89c0ff;
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

.btn-detalji:hover {
  background-color: #fdfa42;
}

.btn-novi-projekt {
  display: block;
  padding: 10px 20px;
  margin: 25px 0;
  width: 200px;
  background-color: #fdfa42;
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

.btn-novi-projekt:hover {
  background-color: #89c0ff;
}
</style>
