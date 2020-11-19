<template>
  <div>
    <vs-navbar
      target-scroll="#content"
      padding-scroll
      center-collapsed
      v-model="active"
      textWhite
      color="dark"
      class="condensed"
    >
      <template #left>
        <img v-if="!$device.isMobile" src="/favicon.svg" alt="" />
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
      <vs-navbar-item
        v-if="$auth.loggedIn"
        id="catalog"
        :active="active == 'catalog'"
        to="/catalog"
      >
        Catalog
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
        Profile
      </vs-navbar-item>
      <template #right>
        <vs-button
          v-if="$auth.loggedIn"
          :loading="loadingFace"
          :animate-inactive="successFace"
          @click="logout"
          ><i class="bx bx-log-out"></i>&nbsp;Logout
          <template #animate>Really?</template>
        </vs-button>
        <vs-button v-else @click="login"
          ><i class="bx bx-log-in"></i>&nbsp;Login</vs-button
        >
      </template>
    </vs-navbar>

    <!-- Special snowflake sidebar for mobile -->
    <vs-sidebar
      v-model="active"
      absolute
      text-white
      :open.sync="activeSidebar"
      background="dark"
    >
      <template #logo>
        <img src="/icon.png" alt="" />
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
        v-if="$auth.loggedIn"
        id="catalog"
        :active="active == 'catalog'"
        to="/catalog"
      >
        <template #icon>
          <i class="bx bx-play"></i>
        </template>
        Catalog
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
        :active="active == 'Profile'"
        to="/profile"
        @click="activeSidebar = false"
        ><template #icon>
          <i class="bx bx-user"></i>
        </template>
        Profile
      </vs-sidebar-item>
      <template #footer>
        <vs-row justify="space-between">
          <vs-avatar circle dark history>
            <img
              :src="$auth.loggedIn ? $auth.user.picture : '/avatars/nouser.svg'"
              alt=""
            />
          </vs-avatar>
          <vs-avatar primary @click="activeSidebar = !activeSidebar">
            <i class="bx bx-arrow-back bx-tada"></i>
          </vs-avatar>
        </vs-row>
      </template>
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
    async login() {
      await this.$auth
        .loginWith('google')
        .then(() => {
          // console.log('Logged In')
          this.$router.push('/profile')
        })
        .catch((e) => {
          console.error(e)
        })
    },
    async logout() {
      this.loadingFace = true
      setTimeout(() => {
        this.loadingFace = false
        this.successFace = !this.successFace
        this.$auth.logout().catch((e) => {
          console.error(e)
        })
        this.$router.push('/')
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
