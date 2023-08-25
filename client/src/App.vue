<template>
  <div id="app">
    <main-menu />
    <router-view />
  </div>
</template>

<script setup>
import MainMenu from './pages/HeaderView.vue'
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

*{
  margin: 0;
  padding: 0;
  text-decoration: none;
  font-size: medium;
}

h3{
  font-size: medium;
}
</style>
