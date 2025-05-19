<template>
  <div v-if="profile" class="">
    <v-card
      color="sidebar"
      elevation="0"
      class="mx-5"
      min-width="320"
    >
      <v-card-text class="pa-8">
        <h1 class="display-1 text-center mb-8">
          {{ pageName }}
        </h1>

        <div class="mb-3">
          <p class="mb-0 font-weight-bold mr-5 body-1">
            E-mail
          </p>
          <p class="mb-0 title">
            {{ profile.email }}
          </p>
        </div>
        <v-divider class="my-2" />
        <div class="mb-3">
          <p class="mb-0 font-weight-bold mr-5 caption">
            {{ $t('NAME') }}
          </p>
          <p class="mb-0">
            {{ profile.name }}
          </p>
        </div>
        <div class="mt-3">
          <v-btn
            depressed
            color="primary"
            @click="$bus.$emit('open-profile-form',profile)"
          >
            {{ $t('EDIT',{text: $t('PROFILE')}) }}
          </v-btn>
          <v-btn
            depressed
            class="ml-2"
            color="accent"
            @click="$bus.$emit('open-change-password-form')"
          >
            {{ $t('CHANGE_PASSWORD') }}
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
    <forms-profile @save="saveProfile" />
    <forms-change-password @save="savePassword" />
  </div>
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend'],
  data () {
    return {
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}auth-admin`,
      pageName: this.$t('PROFILE_INFO'),
      profile: null
    }
  },
  async fetch () {
    try {
      await this.$auth.fetchUser()
      this.profile = { ...this.$auth.user }
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
    this.$overlay.hide()
  },
  head () {
    return this.$headUtil({
      lang: this.$lang.getISO,
      title: this.pageName,
      urlPath: this.$route.fullPath
    })
  },
  created () {
    this.$breadcrumbs.clear()
  },
  methods: {
    async saveProfile (data) {
      try {
        await this.$axios.$post(`${this.apiPath}/update-profile`, data)
        this.$notifier.showMessage({ title: this.$t('UPDATED'), content: this.$t('UPDATED_', { text: this.$t('PROFILE') }), color: 'success' })
        await this.$fetch()
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
    },
    async savePassword (data) {
      try {
        await this.$axios.$post(`${this.apiPath}/update-password`, data)
        this.$notifier.showMessage({ title: this.$t('UPDATED'), content: this.$t('UPDATED_', { text: ' Password ' }), color: 'success' })
        await this.$fetch()
      } catch (e) {
        this.$notifier.showMessage({ title: this.$t('INVALID', { text: this.$t('OLD_PASSWORD') }), content: this.$t('INCORRECT_OLD_PASSWORD_DETAIL'), color: 'error' })
        this.$overlay.hide()
      }
    }
  }
}
</script>
