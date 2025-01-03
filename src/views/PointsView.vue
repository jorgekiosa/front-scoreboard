<script setup>
import Points from '@/components/Points.vue'
</script>
<template>
  <div class="home">
    <Points/>
  </div>
</template>
<style>
.home{
  background-color: #033380;
  min-height: 100vh;
  display: flex;
}
@media (min-width: 1024px) {
  .home {
    min-height: 100vh;
    display: flex;
  }
}
</style>
