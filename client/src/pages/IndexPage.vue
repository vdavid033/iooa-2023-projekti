<template>
  <div class="home">
    <div class="center-content">
      <h1 class="app-title">Aplikacija za vođenje projekata</h1>
      <div class="options">
        <router-link to="/prijava" class="btn">PRIJAVA</router-link>
        <router-link to="/registracija" class="btn">REGISTRACIJA</router-link>
      </div>
    </div>
  </div>
</template>

<style>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f4f4;
}

.center-content {
  text-align: center;
}

.app-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.btn {
  display: block;
  margin: 10px auto;
  padding: 10px 20px;
  width: 150px;
  background-color: #fff;
  color: black;
  text-align: center;
  text-decoration: none;
  border: 3px solid black;
  border-radius: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, color 0.3s, transform 0.3s;
}

.btn:hover {
  background-color: #007bff;
  color: #fff;
  transform: scale(1.05);
}
</style>
