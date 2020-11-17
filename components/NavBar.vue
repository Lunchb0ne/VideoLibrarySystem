<template>
  <div>
    <vs-navbar
      v-model="active"
      target-scroll="#padding-scroll-content"
      text-white
      color="dark"
      padding-scroll
      center-collapsed
      class="condensed"
    >
      <template #left>
        <img v-if="!$device.isMobile" src="/main.svg" alt="" />
        &nbsp;
        <vs-button
          v-if="$device.isMobile"
          @click="activeSidebar = !activeSidebar"
        >
          <i class="bx bx-menu"></i>
        </vs-button>
      </template>
      <vs-navbar-item id="home" :active="active == 'home'" to="/">
        Home
      </vs-navbar-item>
      <vs-navbar-item id="about" :active="active == 'about'" to="/about">
        About
      </vs-navbar-item>
      <vs-navbar-item
        v-if="$auth.loggedIn"
        id="profile"
        :active="active == 'profile'"
        to="/profile"
      >
        profile
      </vs-navbar-item>
      <template #right>
        <vs-button
          v-if="$auth.loggedIn"
          :loading="loadingFace"
          :animate-inactive="successFace"
          @click="handleClickFace"
          ><i class="bx bx-log-out"></i>&nbsp;Logout
          <template #animate>Really?</template>
        </vs-button>
        <vs-button v-else @click="google"
          ><i class="bx bx-log-in"></i>&nbsp;Login</vs-button
        >
      </template>
    </vs-navbar>
    <vs-sidebar
      v-model="active"
      absolute
      textWhite
      :open.sync="activeSidebar"
      background="dark"
    >
      <template #logo>
        <img src="/main.svg" alt="" />
      </template>
      <vs-sidebar-item
        id="home"
        :active="active == 'home'"
        to="/"
        @click="activeSidebar = !activeSidebar"
      >
        <template #icon>
          <i class="bx bx-home"></i>
        </template>
        Home
      </vs-sidebar-item>
      <vs-sidebar-item
        id="about"
        :active="active == 'about'"
        to="/about"
        @click="activeSidebar = false"
      >
        <template #icon>
          <i class="bx bx-label"></i>
        </template>
        About
      </vs-sidebar-item>
      <vs-sidebar-item
        v-if="$auth.loggedIn"
        id="profile"
        :active="active == 'profile'"
        to="/profile"
        @click="activeSidebar = false"
        ><template #icon>
          <i class="bx bx-question-mark"></i>
        </template>
        profile
      </vs-sidebar-item>
    </vs-sidebar>
  </div>
</template>
<script>
export default {
  data: () => ({
    active: 'home',
    activeSidebar: false,
    loadingFace: false,
    successFace: false,
  }),
  methods: {
    async google() {
      await this.$auth.loginWith('google').catch((e) => {
        console.log('Error' + e)
      })
    },
    async handleClickFace() {
      this.loadingFace = true
      setTimeout(() => {
        this.loadingFace = false
        this.successFace = !this.successFace
        this.$auth.logout().catch((e) => {
          console.log('Error' + e)
        })
        window.location.reload(true)
      }, 2000)
    },
  },
}
</script>
<style>
button {
  font-family: 'IBM Plex Sans Condensed', sans-serif;
}
</style>
