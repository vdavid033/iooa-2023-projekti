<template>
  <q-page class="flex flex-center bg-image">
    <div class="title">APLIKACIJA ZA VOĐENJE PROJEKATA</div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage'
})
</script>

<style>
.title {
  font-size: 50px;
  text-align: center;
  font-weight: bold;
}

.bg-image {
    background-image: url(../assets/POZADINSKA-SLIKA.png);
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>