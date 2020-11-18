<template>
  <div
    id="padding-scroll-content"
    class="square"
    align="center"
    justify="center"
  >
    <div>
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
