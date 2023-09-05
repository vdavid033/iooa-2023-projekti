<template>
  <div class="prijava-view">
    <div class="center-content">
      <h2 class="page-title">Prijava</h2>
      <form @submit.prevent="prijava" class="form">
        <div class="form-group">
          <input
            autocomplete
            type="text"
            id="korisnicko-ime"
            v-model="korisnickoIme"
            required
            class="input-field"
            placeholder="Korisničko ime"
          />
        </div>
        <div class="form-group">
          <input
            type="password"
            id="lozinka"
            autocomplete
            v-model="lozinka"
            required
            class="input-field"
            placeholder="Lozinka"
          />
        </div>
        <div class="btn-group">
          <q-btn type="submit" class="btn-prijava">Prijava</q-btn>
          <router-link to="/" class="btn-natrag">Natrag</router-link>
        </div>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { useSessionStore } from '../stores/store'

export default {
  data() {
    return {
      korisnickoIme: '',
      lozinka: '',
      error: ''
    }
  },
  methods: {
    prijava() {
      const korisnik = {
        korisnicko_ime: this.korisnickoIme,
        lozinka: this.lozinka
      }

      axios
        .post('http://localhost:3000/api/korisnici/prijava', korisnik)
        .then((response) => {
          if (response.data.success) {
            // Spremi podatke o prijavljenom korisniku u sesiju
            useSessionStore().login(response.data.korisnik[0])

            // Pohrana podataka o prijavljenom korisniku u localStorage
            localStorage.setItem('prijavljen', true)
            localStorage.setItem('korisnik', JSON.stringify(response.data.korisnik[0]))

            // Redirekcija na sučelje za upravljanje projektima
            window.location.reload()
          } else {
            this.error = 'Neispravno korisničko ime ili lozinka.'
          }
        })
        .catch((error) => {
          this.error = error.response.data.error ? error.response.data.error : 'Neispravno korisničko ime ili lozinka'
        })
    }
  }
}
</script>

<style>
.prijava-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f4f4;
}

.center-content {
  text-align: center;
}

.page-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.form {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.input-field {
  width: 100%;
  padding: 10px;
  border: 3px solid black;
}

.form-btns {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.btn-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
}

.btn-prijava {
  display: block;
  margin: 10px auto;
  margin-left: 44vw;
  padding: 10px 20px;
  width: 200px;
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

.btn-prijava:hover {
  background-color: #f0c12b;
  color: black;
  transform: scale(1.05);
  cursor: pointer;
}

.btn-natrag {
  display: block;
  padding: 10px 20px;
  width: 150px;
  margin-right: 20px;
  background-color: #828efc;
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

.btn-natrag:hover {
  background-color: #ff4d4d;
  color: black;
  transform: scale(1.05);
  cursor: pointer;
}
</style>

