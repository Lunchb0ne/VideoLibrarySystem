<template>
  <div id="padding-scroll-content" align="center" justify="center">
    <p v-if="$fetchState.pending"></p>
    <p v-else-if="$fetchState.error">An error occurred :(</p>
    <div v-else class="center examplex">
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
  mounted() {},
  async fetch() {
    const loading = this.$vs.loading({
      color: 'primary',
      background: 'dark',
      text: 'Fetcing Transactions...',
      target: this.$refs.content,
    })
    let refs = await this.$fire.firestore
      .collection('transac')
      .where('email', '==', this.$auth.user.email)
      .get()
    refs.forEach(async (transac) => {
      // Add id to the fetched data for easykeeping
      const tData = transac.data()
      const movieRef = this.$fire.firestore.collection('videos').doc(tData.item)
      let t = await movieRef.get()
      tData.id = transac.id
      tData.movie = t.data().name
      //   console.log(tData)
      this.items.push(tData)
    })
    loading.close()
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