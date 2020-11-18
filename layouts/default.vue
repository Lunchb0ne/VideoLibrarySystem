<template>
  <div>
    <NavBar />
    <div :key="index" v-for="index in 8">&nbsp;</div>
    <nuxt />
  </div>
</template>
<script></script>

<style>
html {
  background: #141417;
  color: #fff;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  /* font-family: 'IBM Plex Sans Condensed', sans-serif;
font-family: 'IBM Plex Serif', serif; */
}
</style>
