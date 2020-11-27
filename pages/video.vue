<template>
  <div
    id="padding-scroll-content"
    class="square"
    align="center"
    justify="center"
  >
    <h1>Content Manager</h1>
    <p v-if="$fetchState.pending"></p>
    <p v-else-if="$fetchState.error">An error occurred :(</p>
    <div v-else>
      <vs-row justify="space-around">
        <vs-col :w="$device.isDesktop ? 4 : 10">
          <br />
          <vs-card type="2" @click="addItemModal = !addItemModal">
            <template #img>
              <img
                src="plus.svg"
                alt="Image for adding an item"
                class="thumb"
              />
            </template>
          </vs-card>
          <br />
        </vs-col>
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
    <vs-dialog v-else width="200px" v-model="active">
      <template #header>
        <h1 class="not-margin">
          <b>{{ items[selectedItem].name }}</b>
        </h1>
      </template>
      <div>
        Description :
        <p>{{ items[selectedItem].desc }}</p>
        Director : <i>{{ items[selectedItem].director }}</i
        ><br />
        Genre : <i>{{ items[selectedItem].genre }}</i
        ><br />
        <p>
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
              ? 'Modify Item'
              : `Modify Item`
          }}
        </vs-button>
      </template>
    </vs-dialog>
    <vs-dialog v-model="addItemModal">
      <template #header>
        <h4 class="not-margin">Add Video</h4>
      </template>

      <div class="con-form">
        <vs-input
          type="text"
          block
          v-model="name"
          label-placeholder="Item Name"
        >
          <template #icon> <i class="bx bx-tag"></i> </template>
        </vs-input>
        <vs-input
          type="text"
          block
          v-model="director"
          label-placeholder="Director Name"
        >
          <template #icon> <i class="bx bx-tag"></i> </template>
        </vs-input>
        <vs-input type="text" block v-model="genre" label-placeholder="Genre">
          <template #icon> <i class="bx bx-tag"></i> </template>
        </vs-input>
        <vs-input type="text" block v-model="length" label-placeholder="Length">
          <template #icon> <i class="bx bx-tag"></i> </template>
        </vs-input>
        <vs-input
          type="number"
          block
          v-model="release"
          label-placeholder="Release Year"
        >
          <template #icon> <i class="bx bx-tag"></i> </template>
        </vs-input>
        <vs-input
          type="text"
          block
          v-model="desc"
          label-placeholder="Description"
        >
          <template #icon> <i class="bx bx-tag"></i></template>
        </vs-input>
      </div>

      <template #footer>
        <vs-row justify="space-around">
          <vs-button
            gradient
            danger
            @click="createVideo()"
            :loading="createVideoLoads"
          >
            <i class="bx bx-play"></i>&nbsp;Add Video
          </vs-button>
          <input
            type="file"
            id="fileElem"
            multiple
            accept="image/*"
            style="display: none"
            @change="onFileChange"
          />
          <vs-button
            gradient
            primary
            :upload="sending"
            :loading="buttonloads"
            type="file"
            id="input"
            @click="processImage()"
          >
            <i v-if="imageAdded" class="bx bx-check-circle"></i>
            <i v-else class="bx bx-box"></i>&nbsp;
            {{ imageAdded ? 'Added Image' : `Add Image` }}
          </vs-button>
        </vs-row>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
export default {
  middleware: 'adminRedirect',
  data: () => ({
    createVideoLoads: false,
    addItemModal: false,
    sending: false,
    name: '',
    director: '',
    genre: '',
    length: '',
    release: '',
    desc: '',
    buttonloads: false,
    active: false,
    selectedItem: 0,
    buttonactive: 0,
    items: [],
    purchases: new Set(),
    imageAdded: false,
  }),
  mounted() {},
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

    //Fetching user purchase data
    const transactions = await this.$fire.firestore
      .collection('transac')
      .where('email', '==', this.$auth.user.email)
      .get()

    transactions.forEach(async (transac) => {
      const data = transac.data()
      this.purchases.add(data.item)
    })
    loading.close()
  },
  methods: {
    doCheckout(index) {
      this.selectedItem = index
      console.log(this.items[this.selectedItem].id)
      this.active = true
      this.buttonloads = false
    },
    async processTransaction() {
      // Turn button into loading
      this.buttonloads = true
      // add an entry to firebase
      let refs = await this.$fire.firestore.collection('transac')
      const purchasing = await refs
        .add({
          email: this.$auth.user.email,
          item: this.items[this.selectedItem].id,
          time: this.$fireModule.firestore.FieldValue.serverTimestamp(),
        })
        .then(
          () => {
            // make it change the button to green checkmark by adding the transaction to the set
            console.log('Transaction Added')
            this.purchases.add(this.items[this.selectedItem].id)
            this.buttonloads = false
          },
          (err) => {
            console.error(err)
          }
        )
      console.log(this.items[this.selectedItem].id)
      // remove the popup
      setTimeout(() => {
        this.active = false
      }, 200)
    },
    async createVideo() {
      // Turn button into loading
      this.createVideoLoads = true
      let videoid = ''
      // add an entry to firebase
      let refs = await this.$fire.firestore.collection('videos')
      const vid = await refs
        .add({
          desc: this.desc,
          director: this.director,
          genre: this.genre,
          length: this.length,
          name: this.name,
          released: this.release,
        })
        .then(
          (docRef) => {
            // make it change the button to green checkmark by adding the transaction to the set
            console.log('Video Added')
            console.log(docRef.id)
            videoid = docRef.id
            const storageRef = this.$fire.storage.ref()
            let videoref = storageRef.child(videoid + '.jpg')
            videoref.put(this.image).then(function (snapshot) {
              console.log('Uploaded the image as ' + videoid + ' or file!')
              // remove the popup
              setTimeout(function () {
                this.createVideoLoads = false
                this.active = false
                window.location.reload(true)
              }, 200)
            })
          },
          (err) => {
            console.error(err)
          }
        )
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      this.createImage(files[0])
    },
    createImage(file) {
      this.image = file
      console.log(this.image)
    },
    async processImage() {
      this.sending = true
      const fileElem = document.getElementById('fileElem')
      if (fileElem) {
        fileElem.click()
        setTimeout(() => {
          this.sending = false
        }, 300)
        this.image = fileElem.files[0]
        this.imageAdded = true
      }
    },
  },
}
</script>
<style lang="stylus" scoped>
.not-margin {
  margin: 0px;
  font-weight: normal;
  padding: 10px;
}

.con-form {
  width: 100%;

  .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;

    a {
      font-size: 0.8rem;
      opacity: 0.7;

      &:hover {
        opacity: 1;
      }
    }
  }

  .vs-checkbox-label {
    font-size: 0.8rem;
  }

  .vs-input-content {
    margin: 10px 0px;
    width: calc(100%);

    .vs-input {
      width: 100%;
      margin: 0.2em;
    }
  }
}

.not-margin {
  margin: 0px;
  font-weight: normal;
  padding: 10px;
}

.con-form {
  display: flex;
  align-items: center;
  flex-direction: column;
  font-size: 1.2em;
}

.thumb {
  width: 200px;
  height: 200px;
  overflow: hidden;
}

#newItem {
  background-color: white;
}
</style>