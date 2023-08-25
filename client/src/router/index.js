import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('prijavljen') === 'true') {
          next('/projekti'); // Preusmjeri na željenu rutu ako je korisnik već prijavljen
        } else {
          next(); // Nastavi normalno ako korisnik nije prijavljen
        }
      }
    },
    {
      path: '/registracija',
      name: 'registracija',
      component: () => import('../pages/RegistracijaView.vue'),
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('prijavljen') === 'true') {
          next('/projekti'); // Preusmjeri na željenu rutu ako je korisnik već prijavljen
        } else {
          next(); // Nastavi normalno ako korisnik nije prijavljen
        }
      }
    },
    {
      path: '/registracija-clana',
      name: 'registracija-clana',
      component: () => import('../pages/RegistracijaView.vue'),
      // beforeEnter: (to, from, next) => {
      //   if (localStorage.getItem('prijavljen') === 'true') {
      //     next('/projekti'); // Preusmjeri na željenu rutu ako je korisnik već prijavljen
      //   } else {
      //     next(); // Nastavi normalno ako korisnik nije prijavljen
      //   }
      // }
    },
    {
      path: '/prijava',
      name: 'prijava',
      component: () => import('../pages/PrijavaView.vue'),
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('prijavljen') === 'true') {
          next('/projekti'); // Preusmjeri na željenu rutu ako je korisnik već prijavljen
        } else {
          next(); // Nastavi normalno ako korisnik nije prijavljen
        }
      }
    },
    {
      path: '/projekti',
      name: 'projekti',
      component: () => import('../pages/UpravljanjeProjektimaView.vue'),
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('prijavljen') === 'true') {
          next(); // Nastavi normalno ako je korisnik prijavljen
        } else {
          next('/'); // Preusmjeri na stranicu za prijavu ako korisnik nije prijavljen
        }
      }
    },
    {
      path: '/projekti/novi',
      name: 'kreiraj-projekt',
      component: () => import('../pages/KreirajProjektView.vue'),
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('prijavljen') === 'true') {
          next(); // Nastavi normalno ako je korisnik prijavljen
        } else {
          next('/'); // Preusmjeri na stranicu za prijavu ako korisnik nije prijavljen
        }
      }
    },
    {
      path: '/projekti/:projekt_id',
      name: 'projekt',
      component: () => import('../pages/KreirajProjektView.vue'),
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('prijavljen') === 'true') {
          next(); // Nastavi normalno ako je korisnik prijavljen
        } else {
          next('/'); // Preusmjeri na stranicu za prijavu ako korisnik nije prijavljen
        }
      }
    },
    {
      path: '/sastanci/novi',
      name: 'kreiraj-sastanak',
      component: () => import('../pages/KreirajSastanakView.vue'),
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('prijavljen') === 'true') {
          next(); // Nastavi normalno ako je korisnik prijavljen
        } else {
          next('/'); // Preusmjeri na stranicu za prijavu ako korisnik nije prijavljen
        }
      }
    },
    {
      path: '/sastanci/:sastanak_id',
      name: 'sastanak',
      component: () => import('../pages/KreirajSastanakView.vue'),
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('prijavljen') === 'true') {
          next(); // Nastavi normalno ako je korisnik prijavljen
        } else {
          next('/'); // Preusmjeri na stranicu za prijavu ako korisnik nije prijavljen
        }
      }
    }
  ]
})

export default router
