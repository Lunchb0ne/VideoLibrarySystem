<template>
  <div>
    <NavBar />
    <div id="content" ref="content">
      <div :key="index" v-for="index in 4">&nbsp;</div>
      <nuxt />
    </div>
  </div>
</template>
<script>
export default {
  loading: {
    color: 'blue',
    height: '5px',
  },
}
</script>

<style>
:root {
  --vs-background: 30, 32, 35;
  --vs-text: 255, 255, 255;
  --vs-gray-1: 24, 25, 28;
  --vs-gray-2: 20, 20, 23;
  --vs-gray-3: 15, 16, 19;
  --vs-gray-4: 10, 11, 14;
  --vs-shadow-opacity: 0.3;
  --vs-dark: 0, 0, 0;
  --vs-background-opacity: 0.6;
}
html {
  background: #141417;
  color: #fff;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 1.2rem;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  /* font-family: 'IBM Plex Sans Condensed', sans-serif; */
  /* font-family: 'IBM Plex Serif', serif; */
}
.forced {
  /* font-family: 'IBM Plex Sans', sans-serif; */
  font-size: 0.85rem;
}

/* Nuxt Page transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s;
}
.page-enter,
.page-leave-to {
  opacity: 0;
}
</style>
