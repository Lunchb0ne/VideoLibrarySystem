<template>
  <div
    id="padding-scroll-content"
    class="square"
    align="center"
    justify="center"
  >
    <h1>Your Profile</h1>
    <div :key="index" v-for="index in 4">&nbsp;</div>
    <div>
      <vs-avatar circle size="120" history>
        <img :src="this.$auth.user.picture" alt="" />
      </vs-avatar>
      <p>
        Hi there <i>{{ $auth.user.given_name }}</i>
      </p>
      <p>
        Your email is <i>{{ $auth.user.email }}</i>
      </p>
      <p>
        Your locale is <i>{{ $auth.user.locale }}</i>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'redirect',
}
</script>
