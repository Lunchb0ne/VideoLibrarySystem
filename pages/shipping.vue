<template>
  <div id="padding-scroll-content" align="center" justify="center">
    <h1>Shipping Records</h1>
    <p v-if="$fetchState.pending"></p>
    <p v-else-if="$fetchState.error">An error occurred :(</p>
    <div v-else ref="table" class="center">
      <vs-table striped>
        <template #header>
          <vs-input v-model="search" border placeholder="Search" />
        </template>
        <template #thead>
          <vs-tr>
            <vs-th sort @click="items = $vs.sortData($event, items, 'movie')">
              Movie
            </vs-th>
            <vs-th sort @click="items = $vs.sortData($event, items, 'email')">
              Email
            </vs-th>
            <vs-th sort @click="items = $vs.sortData($event, items, 'id')">
              Transac Id
            </vs-th>
            <vs-th sort @click="items = $vs.sortData($event, items, 'time')">
              Date
            </vs-th>
          </vs-tr>
        </template>
        <template #tbody>
          <vs-tr
            :key="i"
            v-for="(tr, i) in $vs.getPage(
              $vs.getSearch(items, search),
              page,
              max
            )"
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
              {{ tr.time }}
            </vs-td>
          </vs-tr>
        </template>
        <template #footer>
          <vs-pagination v-model="page" :length="$vs.getLength(items, max)" />
        </template>
      </vs-table>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'adminRedirect',
  data: () => ({
    items: [],
    page: 1,
    max: 10,
    updateCycle: 0,
    search: '',
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
    const col = this.$fire.firestore.collection('ship')
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
      const trasac = await this.$fire.firestore.collection('ship').get()
      trasac.forEach(async (transac) => {
        const tData = transac.data()
        const movieRef = this.$fire.firestore
          .collection('videos')
          .doc(tData.item)
        let t = await movieRef.get()
        tData.id = transac.id
        // Add movie-name to the fetched data for easykeeping
        tData.movie = t.data().name
        tData.time = tData.time.toDate().toLocaleString()
        // console.log(tData)
        this.items.push(tData)
      })
    },
  },
}
</script>
<style lang="css" scoped>
</style>