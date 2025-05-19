<template>
  <div class="backend-login d-flex align-center justify-center primary">
    <v-card
      color="white"
      elevation="0"
      class="mx-5"
      min-width="320"
      width="400"
    >
      <v-card-text class="px-12 py-8">
        <h1 class="display-1 text-center mb-8">
          {{ pageName }}
        </h1>
        <v-form ref="form" v-model="valid" @submit.prevent="save">
          <v-text-field
            v-model="newPassword"
            type="password"
            :label="$t('_NEW',{text: ' Password ' })"
            outlined
            autocomplete="off"
            dense
            :rules="rules.passwordRules"
            :hint="$t('INPUT_HINT',{text: $t('_NEW',{text: ' Password ' })})"
            required
          />
          <v-text-field
            v-model="confirmPassword"
            type="password"
            :label="$t('USER_CONFIRM_PASSWORD')"
            outlined
            autocomplete="off"
            dense
            :rules="rules.confirmPasswordRules"
            :hint="$t('INPUT_HINT',{text: $t('USER_CONFIRM_PASSWORD')})"
            required
          />
          <v-btn
            color="primary"
            class="white--text"
            block
            x-large
            depressed
            type="submit"
            :disabled="saving || !valid"
            :loading="saving"
          >
            {{ $t("SAVE") }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  layout: 'blank',
  middleware: 'guest-admin',
  validate ({ params }) {
    return !!params.token
  },
  data () {
    return {
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}auth-admin`,
      pageName: this.$t('RESET_PASSWORD'),
      valid: true,
      saving: false,
      newPassword: '',
      confirmPassword: '',
      rules: {
        passwordRules: [
          v => !!v || this.$t('IS_REQUIRED', { text: this.$t('_NEW', { text: ' Password ' }) }),
          v => !v || (!!v && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(v)) || this.$t('INVALID_PASSWORD')
        ],
        confirmPasswordRules: [
          v => (!!this.newPassword && v === this.newPassword) || this.$t('PASSWORD_NOT_MATCH')
        ]
      }
    }
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
  async mounted () {
    try {
      await this.$axios.$post(`${this.apiPath}/check-password-token`, { token: this.$route.params.token })
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
  },
  methods: {
    async  save () {
      if (this.$refs.form.validate()) {
        this.saving = true
        try {
          await this.$axios.$put(`${this.apiPath}/reset-password/${this.$route.params.token}`, { password: this.newPassword })
          this.$notifier.showMessage({ title: this.$t('RESET_PASSWORD_SUCCESS'), content: this.$t('RESET_PASSWORD_SUCCESS_DETAIL'), color: 'success' })
          setTimeout(() => {
            this.$router.push(this.localePath({ name: 'backend-login' }))
          }, 1000)
        } catch (e) {
          this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.backend-login{
  height: 100%;
}
</style>
