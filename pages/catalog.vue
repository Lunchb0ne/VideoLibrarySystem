<template>
  <div
    id="padding-scroll-content"
    class="square"
    align="center"
    justify="center"
  >
    <h1>The Catalog</h1>
    <p v-if="$fetchState.pending"></p>
    <p v-else-if="$fetchState.error">An error occurred :(</p>
    <div v-else>
      <vs-row justify="space-around">
        <vs-col
          v-for="(video, index) in items"
          :key="video.id"
          :w="$device.isDesktop ? 4 : 10"
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
        <vs-button
          gradient
          :color="purchases.has(items[selectedItem].id) ? 'success' : 'primary'"
          :disabled="purchases.has(items[selectedItem].id)"
          :loading="buttonloads"
          block
          @click="processTransaction()"
        >
          <i
            v-if="purchases.has(items[selectedItem].id)"
            class="bx bx-check-circle"
          ></i>
          <i v-else class="bx bx-purchase-tag-alt"></i>&nbsp;
          {{
            purchases.has(items[selectedItem].id)
              ? 'Already purchased'
              : `Rent for ₹99`
          }}
        </vs-button>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
export default {
  middleware: 'redirect',
  data: () => ({
    buttonloads: false,
    active: false,
    selectedItem: 0,
    buttonactive: 0,
    items: [],
    purchases: new Set(),
  }),
  async fetch() {
    const loading = this.$vs.loading({
      color: 'primary',
      background: 'dark',
      text: 'Fetcing Videos...',
      target: this.$refs.content,
    })

    // Fetching Videos
    const refs = await this.$fire.firestore.collection('videos').get()
    refs.forEach((video) => {
      // Add id to the fetched data for easykeeping
      const vidData = video.data()
      vidData.id = video.id
      // console.log(vidData)
      this.items.push(vidData)
    })

    // Fetching user purchase data
    const transactions = await this.$fire.firestore
      .collection('transac')
      .where('email', '==', this.$auth.user.email)
      .get()

    transactions.forEach(async (transac) => {
      const data = transac.data()
      const purchaseDate = new Date(data.time.toDate())
      const hrsLeft =
        (purchaseDate.getTime() + 1000 * 3600 * 24 * 3 - new Date().getTime()) /
        (1000 * 3600)
      if (hrsLeft > 0) this.purchases.add(data.item)
    })
    loading.close()
  },
  methods: {
    doCheckout(index) {
      this.selectedItem = index
      // console.log(this.items[this.selectedItem].id)
      this.active = true
      this.buttonloads = false
    },
    async processTransaction() {
      // Turn button into loading
      this.buttonloads = true
      // add an entry to firebase
      const refs = await this.$fire.firestore.collection('transac')
      const purchasing = await refs
        .add({
          email: this.$auth.user.email,
          item: this.items[this.selectedItem].id,
          time: this.$fireModule.firestore.FieldValue.serverTimestamp(),
        })
        .then(
          () => {
            // make it change the button to green checkmark by adding the transaction to the set
            // console.log('Transaction Added')
            this.purchases.add(this.items[this.selectedItem].id)
            this.buttonloads = false
          },
          (err) => {
            console.error(err)
          }
        )
      // console.log(this.items[this.selectedItem].id)
      // remove the popup
      setTimeout(() => {
        this.active = false
      }, 200)
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
