<template>
  <div class="side-menu">
    <router-link to="/projekti" class="side-menu-container">
        <img src="../assets/cog.png" />
        <p>Projekti</p>
    </router-link>
    <router-link to="/sastanci" class="side-menu-container">
        <img src="../assets/cog.png" />
        <p class="menu-item">Sastanci</p>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'SideMenu'
}
</script>

<style>
.side-menu {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  background: grey;
  width: 200px;
  border-right: 3px solid black;
  position: absolute;
  margin-top: -25px;
  min-height: calc(100vh - 61px);
  border-bottom: 3px solid black;
  height: 175vh;
}

.side-menu-container {
    display: flex;
    align-items: center;
    width: calc(100% - 30px);
    padding: 10px 15px;
    width: 100%;
}

.side-menu-container:hover {
    background: rgb(88, 87, 87);
}

.side-menu-container img{
    margin-right: 5px;
    width: 25px;
    height: 25px;
}

.side-menu-container p {
    text-decoration: none;
    color: black;
}

</style>
