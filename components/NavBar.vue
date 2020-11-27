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
      <vs-navbar-item
        v-if="$auth.loggedIn"
        id="profile"
        :active="active == 'profile'"
        to="/profile"
      >
        Details
      </vs-navbar-item>
      <vs-navbar-item
        v-if="$auth.loggedIn"
        id="dashboard"
        :active="active == 'dashboard'"
        to="/dashboard"
      >
        Dashboard
      </vs-navbar-item>
      <vs-navbar-group v-if="isAdmin">
        <span class="forced" to="/video">Management</span>
        <template #items>
          <vs-navbar-item :active="active == 'video'" id="video" to="/video">
            Video
          </vs-navbar-item>
          <vs-navbar-item
            :active="active == 'checkSales'"
            id="checkSales"
            to="/sales"
          >
            Sales
          </vs-navbar-item>
          <vs-navbar-item
            :active="active == 'shipping'"
            id="shipping"
            to="/shipping"
          >
            Shipping
          </vs-navbar-item>
        </template>
      </vs-navbar-group>
      <vs-navbar-item id="about" :active="active == 'about'" to="/about">
        About
      </vs-navbar-item>
      <template #right>
        <vs-button
          v-if="$auth.loggedIn"
          :loading="loadingFace"
          :animate-inactive="successFace"
          @click="logout"
          animation-type="vertical"
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

      <vs-sidebar-group v-if="$auth.loggedIn">
        <template #header>
          <vs-sidebar-item arrow>
            <template #icon>
              <i class="bx bx-group"></i>
            </template>
            My Stuff
          </vs-sidebar-item>
        </template>

        <vs-sidebar-item
          id="profile"
          to="/profile"
          :active="active == 'profile'"
          @click="activeSidebar = false"
        >
          <template #icon>
            <i class="bx bx-user"></i>
          </template>
          Details
        </vs-sidebar-item>
        <vs-sidebar-item
          id="dashboard"
          to="/dashboard"
          :active="active == 'dashboard'"
          @click="activeSidebar = false"
        >
          <template #icon>
            <i class="bx bx-shopping-bag"></i>
          </template>
          Dashboard
        </vs-sidebar-item>
      </vs-sidebar-group>
      <vs-sidebar-group v-if="isAdmin">
        <template #header>
          <vs-sidebar-item arrow>
            <template #icon>
              <i class="bx bx-glasses"></i>
            </template>
            Management
          </vs-sidebar-item>
        </template>
        <vs-sidebar-item
          id="video"
          to="/video"
          :active="active == 'video'"
          @click="activeSidebar = false"
        >
          <template #icon>
            <i class="bx bx-play-circle"></i>
          </template>
          Video
        </vs-sidebar-item>
        <vs-sidebar-item
          :active="active == 'checkSales'"
          id="checkSales"
          to="/sales"
          @click="activeSidebar = false"
        >
          <template #icon>
            <i class="bx bx-dollar"></i>
          </template>
          Sales
        </vs-sidebar-item>
        <vs-sidebar-item
          :active="active == 'shipping'"
          id="shipping"
          to="/shipping"
          @click="activeSidebar = false"
        >
          <template #icon>
            <i class="bx bx-checkbox-checked"></i>
          </template>
          Shipping
        </vs-sidebar-item>
      </vs-sidebar-group>
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
    active: '',
    activeSidebar: false,
    loadingFace: false,
    successFace: false,
    isAdmin: false,
  }),
  async mounted() {
    // handle admin logic
    if (this.$auth.loggedIn) {
      const userRef = this.$fire.firestore.collection('users')
      const res = await userRef
        .where('email', '==', this.$auth.user.email)
        .get()
      this.isAdmin = res.docs[0].data().type == 1 ? true : false
    }
    //fix navbar derpness
    this.active = this.$route.name == 'index' ? 'home' : this.$route.name
  },
  methods: {
    async login() {
      const userRef = this.$fire.firestore.collection('users')
      await this.$auth
        .loginWith('google')
        .then(() => {
          console.log('Logged In')
          // this.$router.go('/profile')
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
        // this.$router.push('/')
        window.location.reload(true)
      }, 1000)
    },
  },
}
</script>
<style>
button {
  font-family: 'IBM Plex Sans Condensed', sans-serif;
}
</style>
