<template>
  <div class="registracija-view">
    <div class="center-content">
      <h2 class="page-title">Registracija</h2>
      <form @submit.prevent="registrirajKorisnika" class="form">
        <div class="form-group">
          <label for="ime">Unesite ime:</label>
          <input type="text" v-model="ime" required class="input-field" placeholder="Ime"/>
        </div>
        <div class="form-group">
          <label for="prezime">Unesite prezime:</label>
          <input type="text" v-model="prezime" required class="input-field" placeholder="Prezime" />
        </div>
        <div class="form-group">
          <label for="email">Unesite email:</label>
          <input type="email" v-model="email" required class="input-field" placeholder="E-mail" />
        </div>
        <div class="form-group">
          <label for="korisnicko_ime">Unesite korisničko ime:</label>
          <input type="text" v-model="korisnicko_ime" required class="input-field" placeholder="Korisnicko ime" />
        </div>
        <div class="form-group">
          <label for="lozinka">Unesite lozinku:</label>
          <input type="password" v-model="lozinka" required class="input-field" placeholder="Lozinka" />
        </div>
        <div class="btn-group">
          <q-btn type="submit" class="btn-registracija">Registracija</q-btn>
          <router-link to="/" class="btn-natrag">Natrag</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ime: '',
      prezime: '',
      email: '',
      korisnicko_ime: '',
      lozinka: ''
    }
  },
  methods: {
    async registrirajKorisnika() {
      try {
        const response = await this.$axios.post(
          'http://localhost:3000/api/korisnici/registracija',
          {
            ime: this.ime,
            prezime: this.prezime,
            email: this.email,
            korisnicko_ime: this.korisnicko_ime,
            lozinka: this.lozinka
          }
        )

        if (response.data.success) {
          console.log(response)
          alert("Korisnik uspjesno registriran.")
          this.$router.push('/prijava')
        } else {
          console.log(response)
          alert('Došlo je do greške prilikom registracije. Molimo pokušajte kasnije.')
        }
      } catch (error) {
        console.log(error)
        alert('Došlo je do pogreške. Molimo pokušajte ponovno.')
      }
    }
  }
}
</script>

<style>
.registracija-view {
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
  width: 100vw;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  width: 50%;
}

.label {
  font-weight: bold;
}

.input-field {
  width: 400px;
  padding: 10px;
  border: 3px solid black;
  margin-left: 50px;
}

.btn-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.btn-registracija {
  display: block;
  margin: 10px auto;
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

.btn-registracija:hover {
  background-color: #f0c12b;
  color: black;
  transform: scale(1.05);
  cursor: pointer;
}

.btn-natrag {
  display: block;
  padding: 10px 20px;
  width: 150px;
  margin-right: 100px;
  background-color: #ff6b6b;
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
