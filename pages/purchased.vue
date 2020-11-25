<template>
  <div id="padding-scroll-content" align="center" justify="center">
    <p v-if="$fetchState.pending"></p>
    <p v-else-if="$fetchState.error">An error occurred :(</p>
    <div v-else ref="table" class="center">
      <vs-table striped>
        <template #thead>
          <vs-tr>
            <vs-th> Movie </vs-th>
            <vs-th> Email </vs-th>
            <vs-th> Transac Id </vs-th>
            <vs-th> Date </vs-th>
          </vs-tr>
        </template>
        <template #tbody>
          <vs-tr
            :key="i"
            v-for="(tr, i) in $vs.getPage(items, page, max)"
            :data="tr"
          >
            <vs-td>
              {{ tr.movie }}
            </vs-td>
            <vs-td>
              {{ tr.email }}
            </vs-td>
            <vs-td>
              {{ tr.id }}
            </vs-td>
            <vs-td>
              {{ tr.time.toDate().toLocaleString() }}
            </vs-td>
          </vs-tr>
        </template>
        <template #footer>
          <vs-pagination v-model="page" :length="$vs.getLength(items, max)" />
        </template>
      </vs-table>
    </div>
    <vs-button @click="testQuery" v-if="isAdmin">TestQuery</vs-button>
  </div>
</template>

<script>
export default {
  middleware: 'redirect',
  data: () => ({
    items: [],
    page: 1,
    max: 10,
    isAdmin: false,
    updateCycle: 0,
  }),
  mounted() {},
  async fetch() {
    const loading = this.$vs.loading({
      color: 'primary',
      background: 'dark',
      text: 'Fetcing Transactions...',
      target: this.$refs.content,
    })

    // Transactions handling
    const col = this.$fire.firestore.collection('transac')
    const observer = col.onSnapshot(
      (docSnapshot) => {
        console.log(`Received doc snapshot`)
        console.log(this.updateCycle)
        // make a clean fresh table
        if (this.UpdateCycle == 0) {
          console.log('Using initial loading screen')
          this.refreshTable()
          this.updateCycle++
        } else {
          console.log('Adding loading screen')
          const loading = this.$vs.loading({
            color: 'primary',
            background: 'dark',
            opacity: 0.9,
            text: 'Reloading Transactions...',
            target: this.$refs.table,
          })
          this.refreshTable().then(() => {
            setTimeout(() => {
              loading.close()
            }, 150)
          })
          this.updateCycle++
        }
      },
      (err) => {
        console.log(`Encountered error: ${err}`)
      }
    )
    // handle admin logic
    const userRef = this.$fire.firestore.collection('users')
    const res = await userRef.where('email', '==', this.$auth.user.email).get()
    this.isAdmin = res.docs[0].data().type == 1 ? true : false
    // setTimeout(() => {
    loading.close()
    // }, 500)
  },
  methods: {
    async testQuery() {
      console.log('ADMINNNNNN')
    },
    async refreshTable() {
      this.items = []
      const trasac = await this.$fire.firestore
        .collection('transac')
        // .where('email', '==', this.$auth.user.email)
        .get()
      trasac.forEach(async (transac) => {
        const tData = transac.data()
        const movieRef = this.$fire.firestore
          .collection('videos')
          .doc(tData.item)
        let t = await movieRef.get()
        tData.id = transac.id
        // Add movie-name to the fetched data for easykeeping
        tData.movie = t.data().name
        // console.log(tData)
        this.items.push(tData)
      })
    },
  },
}
</script>
<style lang="css" scoped>
</style>