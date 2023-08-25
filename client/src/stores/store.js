import { defineStore } from 'pinia';

export const useSessionStore = defineStore('session', {
  state: () => ({
    prijavljen: false,
    korisnik: null
  }),
  actions: {
    login(korisnik) {
      this.prijavljen = true;
      this.korisnik = korisnik;
    },
    logout() {
      this.prijavljen = false;
      this.korisnik = null;
    }
  }
});
