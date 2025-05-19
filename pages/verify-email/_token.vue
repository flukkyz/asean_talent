<template>
  <div class="">
    <div class="hero-image" />
    <div class="text-center hero-title">
      <h1 :class="['font-weight-bold  themeAccent--text',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'display-1' : 'display-2']">
        Verified E-mail
      </h1>
    </div>
    <div class="w-100 d-flex align-center justify-center py-16 hero-content">
      <div v-if="verified" class="">
        <v-card
          :elevation="['xs', 'sm'].includes($vuetify.breakpoint.name) ? '0' : ''"
          :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'rounded-0' : 'shadow rounded-lg'"
          width="380"
        >
          <v-card-text class="pa-8 text-center">
            <p class="title mb-1 font-weight-bold">
              {{ $t('VERIFY_SUCCESS') }}
            </p>
            <p>
              {{ $t('VERIFY_SUCCESS_DETAIL') }}
            </p>
            <nuxt-link :to="localePath({ name: 'login' })">
              <p class="info--text mb-0">
                {{ $t('GO_TO_',{text: $t('LOGIN')}) }}
              </p>
            </nuxt-link>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'guest',
  validate ({ params }) {
    return !!params.token
  },
  data () {
    return {
      pageName: this.$t('VERIFY_SUCCESS'),
      basePath: `${process.env.baseUrl}${this.$route.fullPath}`,
      verified: false,
      timeoutGoToLogin: null
    }
  },
  head () {
    return this.$headUtil({
      lang: this.$lang.getISO,
      title: this.pageName,
      urlPath: this.basePath
    })
  },
  created () {
    this.$breadcrumbs.clear()
  },
  beforeDestroy () {
    clearTimeout(this.timeoutGoToLogin)
  },
  async mounted () {
    try {
      await this.$axios.$post(`${process.env.apiUrl}${process.env.apiDirectory}auth/verify`, { token: this.$route.params.token })
      this.verified = true
      this.timeoutGoToLogin = setTimeout(() => {
        this.$router.push(this.localePath({ name: 'login' }))
      }, 10000)
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
  }
}
</script>

<style lang="scss" scoped>
.hero-image {
  background-image: url("/images/bg-top-xl.png");
  background-color: #cccccc;
  height: 356px;
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
}
.hero-title {
  margin-top: -198px;
}
.hero-content {
  margin-bottom: 198px;
}
</style>
