<template>
  <div class="">
    <div class="hero-image" />
    <div class="text-center hero-title">
      <h1 :class="['font-weight-bold  themeAccent--text',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'display-1' : 'display-2']">
        {{ pageName }}
      </h1>
    </div>

    <div class="w-100 d-flex flex-wrap align-center justify-space-around py-16 hero-content">
      <v-card
        :elevation="['xs', 'sm'].includes($vuetify.breakpoint.name) ? '0' : ''"
        :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'rounded-0' : 'shadow rounded-lg'"
        width="400"
      >
        <v-card-text class="px-12 py-8">
          <v-form ref="form" v-model="valid" @submit.prevent="save">
            <v-text-field
              v-model="newPassword"
              type="password"
              :label="$t('_NEW',{text: ' Password ' })"
              outlined
              class="rounded-lg"
              autocomplete="off"
              :rules="rules.passwordRules"
              :hint="$t('INPUT_HINT',{text: $t('_NEW',{text: ' Password ' })})"
              required
            />
            <v-text-field
              v-model="confirmPassword"
              type="password"
              :label="$t('USER_CONFIRM_PASSWORD')"
              outlined
              class="rounded-lg"
              autocomplete="off"
              :rules="rules.confirmPasswordRules"
              :hint="$t('INPUT_HINT',{text: $t('USER_CONFIRM_PASSWORD')})"
              required
            />
            <v-btn
              color="themePrimary"
              class="white--text rounded-lg"
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
      basePath: `${process.env.baseUrl}${this.$route.fullPath}`,
      checkPasswordTokenApi: `${process.env.apiUrl}${process.env.apiDirectory}auth/check-password-token`,
      api: `${process.env.apiUrl}${process.env.apiDirectory}auth/reset-password`,
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
      urlPath: this.basePath
    })
  },
  created () {
    this.$breadcrumbs.clear()
  },
  async mounted () {
    try {
      await this.$axios.$post(this.checkPasswordTokenApi, { token: this.$route.params.token })
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
  },
  methods: {
    async  save () {
      if (this.$refs.form.validate()) {
        this.saving = true
        try {
          await this.$axios.$put(`${this.api}/${this.$route.params.token}`, { password: this.newPassword })
          this.$notifier.showMessage({ title: this.$t('RESET_PASSWORD_SUCCESS'), content: this.$t('RESET_PASSWORD_SUCCESS_DETAIL'), color: 'success' })
          setTimeout(() => {
            this.$router.push(this.localePath({ name: 'login' }))
          }, 2000)
        } catch (e) {
          this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hero-image {
  background-image: url("/images/ui/bg-top-xl.png");
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
