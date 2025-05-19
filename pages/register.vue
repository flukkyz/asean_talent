<template>
  <div class="">
    <div class="hero-image" />
    <div class="text-center hero-title">
      <h1 :class="['font-weight-bold  themeAccent--text',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'display-1' : 'display-2']">
        REGISTER
      </h1>
    </div>

    <div class="w-100 d-flex flex-wrap align-center justify-space-around pt-8 pb-16 mb-16">
      <forms-register @save="save" />

      <v-dialog
        v-model="dialog"
        persistent
        max-width="600"
      >
        <v-card class="">
          <v-card-text class="pa-8 text-center">
            <v-img src="/images/logo.png" max-width="200" class="mx-auto" />
            <p class="mt-8">
              {{ $t('SEND_EMAIL_SUCCESS', {email: email.toLowerCase(), before: $t('VERIFY_EMAIL_BEFORE'), after: $t('VERIFY_EMAIL_AFTER')}) }}
            </p>
            <v-btn
              color="primary"
              depressed
              @click="closeDialog"
            >
              <span class="white--text">
                {{ $t('CLOSE') }}
              </span>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'guest',
  data () {
    return {
      basePath: `${process.env.baseUrl}${this.$route.fullPath}`,
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}auth`,
      dialog: false,
      email: '',
      pageName: this.$t('REGISTER')
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
  methods: {
    closeDialog () {
      this.dialog = false
      this.$router.push(this.localePath({ name: 'login' }))
    },
    async save (data, file) {
      this.email = data.email
      try {
        const member = await this.$axios.$post(`${this.apiPath}/signup`, data)
        if (!!file && data.member_type === 'researcher') {
          const formData = new FormData()
          formData.append('token', member.token)
          formData.append('cv_img', file)
          await this.$axios.$post(`${this.apiPath}/add-cv`, formData)
        } else {
          await this.$axios.$post(`${this.apiPath}/remove-token`, { token: member.token })
        }
        this.dialog = true
      } catch (e) {
        this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
      }
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
  margin-top: -258px;
}
</style>
