<template>
  <div
    id="padding-scroll-content"
    class="square"
    align="center"
    justify="center"
  >
    <p v-if="$fetchState.pending">Fetching Videos...</p>
    <p v-else-if="$fetchState.error">An error occurred :(</p>
    <div v-else>
      <vs-row vs-justify="space-around" vs-align="center">
        <vs-col v-for="video in items" :key="video.id">
          <br />
          <vs-card type="3">
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
        </vs-col>
      </vs-row>
      <br />
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'redirect',
  data() {
    return {
      items: [],
    }
  },
  async fetch() {
    let refs = await this.$fire.firestore.collection('videos').get()
    refs.forEach((video) => {
      // Add id to the fetched data for easykeeping
      const vidData = video.data()
      vidData.id = video.id
      console.log(vidData)
      this.items.push(vidData)
    })
  },
  methods: {},
}
</script>
<style lang="css" scoped>
.thumb {
  position: relative;
  width: 200px;
  height: 200px;
  overflow: hidden;
}
</style>