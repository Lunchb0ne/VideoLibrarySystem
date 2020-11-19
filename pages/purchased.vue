<template>
  <div id="padding-scroll-content" align="center" justify="center">
    <p v-if="$fetchState.pending"></p>
    <p v-else-if="$fetchState.error">An error occurred :(</p>
    <div v-else class="center">
      <vs-table striped>
        <template #thead>
          <vs-tr>
            <vs-th> Movie </vs-th>
            <vs-th> Email </vs-th>
            <vs-th> Transac Id </vs-th>
          </vs-tr>
        </template>
        <template #tbody>
          <vs-tr :key="i" v-for="(tr, i) in items" :data="tr">
            <vs-td>
              {{ tr.movie }}
            </vs-td>
            <vs-td>
              {{ tr.email }}
            </vs-td>
            <vs-td>
              {{ tr.id }}
            </vs-td>
          </vs-tr>
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
    isAdmin: false,
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
    let trasac = await this.$fire.firestore
      .collection('transac')
      .where('email', '==', this.$auth.user.email)
      .get()
    trasac.forEach(async (transac) => {
      const tData = transac.data()
      const movieRef = this.$fire.firestore.collection('videos').doc(tData.item)
      let t = await movieRef.get()
      tData.id = transac.id
      // Add movie-name to the fetched data for easykeeping
      tData.movie = t.data().name
      // console.log(tData)
      this.items.push(tData)
    })
    // handle admin logic
    const userRef = this.$fire.firestore.collection('users')
    const res = await userRef.where('email', '==', this.$auth.user.email).get()
    this.isAdmin = res.docs[0].data().type == 1 ? true : false
    loading.close()
  },
  methods: {
    async testQuery() {
      console.log('ADMINNNNNN')
    },
  },
}
</script>
<style lang="css" scoped>
</style>