<template>
  <div class="sastanci">
    <div class="title-and-button">
      <h2 class="page-title">
        {{ sastanci.length > 0 ? "SASTANCI" : "NEMA SASTANAKA ZA PRIKAZ" }}
      </h2>
    </div>
    <div v-if="sastanci.length > 0" class="projekt-container">
      <div class="projekt projekt-header">
        <div class="projekt-info">
          <h3>Moji sastanci:</h3>
        </div>
      </div>
      <div v-for="sastanak in sastanci" :key="sastanak.sastanak_id" class="projekt">
        <div class="projekt-info">
          <h3>{{ sastanak.naziv_sastanka }}</h3>
        </div>
        <div class="projekt-actions">
          <router-link
            :to="`/sastanci/${sastanak.sastanak_id}`"
            class="btn-detalji"
            >Detalji</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// #14 stranica za pregled projekata (cjela komponenta)
export default {
  data() {
    return {
      sastanci: [],
    };
  },
  computed: {
    isLoggedIn() {
      return localStorage.getItem("prijavljen") === "true";
    },
    user() {
      return JSON.parse(localStorage.getItem("korisnik"));
    },
  },
  created() {
    if (this.isLoggedIn) {
      this.$axios
        .get(
          `http://localhost:3000/api/sastanci/${this.user.korisnik_id}/sastanci`
        )
        .then((response) => {
          this.sastanci = response.data;
        })
        .catch((error) => {
          console.error("Greška pri dohvaćanju sastanaka:", error);
        });
    }
  },
};
</script>

<style>
.sastanci {
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

.projekt-header {
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
  background-color: #828efc;
  color: black;
  text-align: center;
  text-decoration: none;
  border: 3px solid black;
  border-radius: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, color 0.3s, transform 0.3s;
}

.btn-detalji:hover {
  background-color: #fdfa42;
}

.btn-novi-projekt {
  display: block;
  padding: 10px 20px;
  margin: 25px 0;
  width: 200px;
  background-color: #f71cb2;
  color: black;
  text-align: center;
  text-decoration: none;
  border: 3px solid black;
  border-radius: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, color 0.3s, transform 0.3s;
}

.btn-novi-projekt:hover {
  background-color: #f567fa;
}
</style>
