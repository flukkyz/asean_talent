<template>
  <div style="height: 90vh;" class="d-flex align-center justify-center">
    <div class="w-75">
      <div class="w-75 ma-auto">
        <v-progress-linear
          color="deep-purple accent-4"
          indeterminate
          rounded
          class="mt-10 mb-5"
          height="6"
        />
      </div>
      <h1 class="display-2 text-center teal--text">
        Waiting for Authentication
      </h1>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'blank',
  middleware: 'guest',
  validate ({ query }) {
    return query.authclient && query.code && query.state
  },
  data () {
    return {
      timeout: null
    }
  },
  head () {
    return {
      title: 'Authentication'
    }
  },
  created () {
    this.$breadcrumbs.clear()
  },
  async mounted () {
    const timeOfTimeout = 20
    this.timeout = setTimeout(() => {
      this.$nuxt.error({ statusCode: 401, message: 'Unauthorized' })
    }, timeOfTimeout * 1000)
    this.$auth.loginWith('social')
    const acc = await this.$axios.$get(`${process.env.apiUrl}${process.env.apiDirectory}auth/callback/${this.$route.query.authclient}?code=${this.$route.query.code}&state=${this.$route.query.state}`)
    this.$auth.setUserToken(acc.access_token, acc.refresh_token).then(async () => {
      const user = await this.$auth.fetchUser()
      if (user) {
        clearTimeout(this.timeout)
        this.$router.push(this.localePath({ name: 'index' }, this.$auth.user.lang))
      }
    })
  }
}
</script>
