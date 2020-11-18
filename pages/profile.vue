<template>
  <div
    id="padding-scroll-content"
    class="square"
    align="center"
    justify="center"
  >
    <div>
      {{
        $auth.loggedIn
          ? 'Your email is ' + $auth.user.email
          : 'Why are you here?'
      }}
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'redirect',
}
</script>
