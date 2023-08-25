<template>
  <header class="main-menu" v-show="isLoggedIn">
    <div class="app-title">Aplikacija za vođenje projekata</div>
    <div class="user-info">
      <p v-if="korisnik">{{ korisnik.ime }} {{ korisnik.prezime }}</p>
      <img src="../assets/power-switch.png" @click="odjava" />
    </div>
  </header>
  <SideMenu v-if="isLoggedIn" />
</template>

<script>
import SideMenu from './sidemenuview.vue'
export default {
  components: {
    SideMenu
  },
  computed: {
    isLoggedIn() {
      return localStorage.getItem('prijavljen') === 'true'
    },
    korisnik() {
      const korisnikJSON = localStorage.getItem('korisnik')
      if (korisnikJSON) {
        return JSON.parse(korisnikJSON)
      }
      return null
    }
  },
  methods: {
    odjava() {
      // Brisanje podataka iz local storage-a
      localStorage.removeItem('prijavljen')
      localStorage.removeItem('korisnik')

      // Postavljanje "prijavljen" na false
      localStorage.setItem('prijavljen', 'false')
      this.$forceUpdate()

      // Redirekcija na stranicu za prijavu
      window.location.reload()
    }
  }
}
</script>

<style>
.main-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  color: black;
  padding: 5px 10px;
  border-bottom: 3px solid black;
  margin-bottom: 25px;
}

.main-menu h2 {
  margin: 0;
}

.user-info {
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-info img {
  width: 25px;
  height: 25px;
  cursor: pointer;
}

.main-menu .right {
  display: flex;
  align-items: center;
}

.main-menu p {
  margin: 0;
  margin-right: 10px;
}

.main-menu button {
  padding: 8px 16px;
  background-color: #0056b3;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.main-menu button:hover {
  background-color: #003973;
}
</style>
