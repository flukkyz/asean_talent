<template>
  <div>
    <v-form ref="form" @submit.prevent="login">
      <v-text-field
        v-model="form.username"

        label="E-mail"
        outlined
        class="rounded-lg"
        required
        autofocus
        dense
        @input="onInput"
      />
      <v-text-field
        v-model="form.password"
        label="Password"
        type="password"
        outlined
        class="rounded-lg"
        required
        dense
        @input="onInput"
      />
      <p v-if="incorrect" class="red--text text-center font-weight-bold">
        {{ $t('INCORRECT', {text: ' E-mail ' + $t('OR') + ' Password '}) }}
      </p>
      <div v-if="notVerify" class="text-center mb-5">
        <p class="red--text font-weight-bold mb-1">
          {{ $t('EMAIL_HAS_NOT_BEEN_VERIFIED') }}
        </p>
        <p class="caption mb-0">
          {{ $t('IF_HAVE_NOT_RECEIVED_EMAIL') }}
        </p>
        <v-btn
          small
          class="rounded-lg"
          :disabled="sendMailVerify"
          :loading="sendMailVerify"
          color="warning"
          @click="reSendEmail"
        >
          {{ $t('SEND_EMAIL_AGAIN') }}
        </v-btn>
      </div>
      <v-btn
        v-if="!notVerify"
        color="themePrimary"
        class="white--text rounded-lg"
        x-large
        depressed
        block
        type="submit"
        :disabled="logingIn"
        :loading="loadingLogin"
      >
        {{ $t("LOGIN") }}
      </v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      reSendEmailApi: `${process.env.apiUrl}${process.env.apiDirectory}auth/resend-verify`,
      logingIn: false,
      loadingLogin: false,
      incorrect: false,
      notVerify: false,
      sendMailVerify: false,
      emailReSendVerify: '',
      form: {
        username: '',
        password: ''
      }
    }
  },
  created () {
    this.$bus.$on('incorrect-login', () => {
      this.form.password = ''
      this.incorrect = true
      this.logingIn = false
      this.loadingLogin = false
    })
    this.$bus.$on('not-verify', () => {
      this.form.password = ''
      this.emailReSendVerify = this.form.username
      this.notVerify = true
      this.loadingLogin = false
    })
  },
  beforeDestroy () {
    this.$bus.$off('incorrect-login')
    this.$bus.$off('not-verify')
  },
  methods: {
    onInput () {
      this.incorrect = false
      this.logingIn = false
      this.notVerify = false
    },
    login () {
      this.form.username = this.form.username.toLowerCase().trim()
      this.form.password = this.form.password.trim()
      this.logingIn = true
      this.loadingLogin = true
      this.$emit('login', this.form)
    },
    async reSendEmail () {
      this.sendMailVerify = true
      try {
        await this.$axios.$post(this.reSendEmailApi, { email: this.emailReSendVerify })
        this.$notifier.showMessage({ title: this.$t('VERIFY_EMAIL_SENDED'), content: this.$t('VERIFY_EMAIL_SENDED_DETAIL'), icon: 'fas fa-paper-plane', color: 'info' })
        this.sendMailVerify = false
        this.notVerify = false
        this.logingIn = false
      } catch (e) {
        this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
      }
    }
  }
}
</script>
