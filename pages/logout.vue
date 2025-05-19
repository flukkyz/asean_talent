<template>
  <div style="height: 100vh;" class="d-flex align-center justify-center">
    <div class="w-75">
      <v-img src="/images/logo.png" contain max-height="200" class="ma-auto" />
      <div class="w-75 ma-auto">
        <v-progress-linear
          color="warning"
          indeterminate
          class="mt-10 mb-5"
          height="6"
        />
      </div>
      <h1 class="display-1 info--text text-center">
        Logging out
      </h1>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'blank',
  middleware: 'auth',
  head () {
    return {
      title: this.$t('LOGOUT')
    }
  },
  mounted () {
    setTimeout(async () => {
      this.$store.commit('setDrawer', false)
      await this.$auth.logout()
      this.$router.push(this.localePath({ name: 'index' }))
    }, 300)
  }
}
</script>
