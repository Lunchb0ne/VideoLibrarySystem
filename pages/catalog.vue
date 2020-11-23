<template>
  <div
    id="padding-scroll-content"
    class="square"
    align="center"
    justify="center"
  >
    <p v-if="$fetchState.pending"></p>
    <p v-else-if="$fetchState.error">An error occurred :(</p>
    <div v-else>
      <vs-row justify="space-around">
        <vs-col
          v-for="(video, index) in items"
          :key="video.id"
          :w="$device.isDesktop ? 3 : 10"
        >
          <br />
          <vs-card type="3" @click="doCheckout(index)">
            <template #title>
              <h3>{{ video.name }}</h3>
            </template>
            <template #img>
              <img
                :src="`https://firebasestorage.googleapis.com/v0/b/videolibrarysystem.appspot.com/o/${video.id}.jpg?alt=media`"
                :alt="'Image for ' + video.name"
                class="thumb"
              />
            </template>
            <template #text>
              <p>{{ 'Director : ' + video.director }}</p>
              <p>{{ 'Genre : ' + video.genre }}</p>
              <br />
              <p>{{ 'Released : ' + video.released }}</p>
            </template>
            <!-- Interaction based on movie or sieries
          We store length as number if it's a show (for episodes) and as a string if it's a movie for the runtime -->
            <template #interactions>
              <vs-button
                v-if="typeof video.length == 'number'"
                class="btn-chat"
                shadow
                primary
              >
                <i class="bx bx-fast-forward"></i>
                <span class="span">&#160;{{ video.length }}</span>
              </vs-button>
              <vs-button v-else class="btn-chat" shadow primary>
                <i class="bx bx-time"></i>
                <span class="span">&#160;{{ video.length }}</span>
              </vs-button>
            </template>
          </vs-card>
          <br />
        </vs-col>
      </vs-row>
    </div>
    <p v-if="$fetchState.pending"></p>
    <vs-dialog v-else v-model="active">
      <template #header>
        <h1 class="not-margin">Confirmation to <b>Rent</b></h1>
      </template>
      <div class="con-form">
        <p>
          Movie Name : <i>{{ items[selectedItem].name }}</i> <br />
          Director : <i>{{ items[selectedItem].director }}</i
          ><br />
          Genre : <i>{{ items[selectedItem].genre }}</i
          ><br />
          Release Year : <i>{{ items[selectedItem].released }}</i>
        </p>
      </div>
      <template #footer>
        <vs-button block @click="processTransaction()">
          Rent for ₹99
        </vs-button>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
export default {
  middleware: 'redirect',
  data: () => ({
    active: false,
    selectedItem: 0,
    items: [],
  }),
  mounted() {},
  async fetch() {
    const loading = this.$vs.loading({
      color: 'primary',
      background: 'dark',
      text: 'Fetcing Videos...',
      target: this.$refs.content,
    })
    let refs = await this.$fire.firestore.collection('videos').get()
    refs.forEach((video) => {
      // Add id to the fetched data for easykeeping
      const vidData = video.data()
      vidData.id = video.id
      // console.log(vidData)
      this.items.push(vidData)
    })
    loading.close()
  },
  methods: {
    doCheckout(index) {
      this.selectedItem = index
      console.log(this.items[this.selectedItem].name)
      this.active = true
    },
    processTransaction() {
      this.active = false
    },
  },
}
</script>
<style lang="css" scoped>
.not-margin {
  margin: 0px;
  font-weight: normal;
  padding: 10px;
}
.con-form {
  display: flex;
  align-items: center;
  /* justify-content: center; */
  flex-direction: column;
  font-size: 1.2em;
}
.thumb {
  position: relative;
  width: 200px;
  height: 200px;
  overflow: hidden;
}
</style>