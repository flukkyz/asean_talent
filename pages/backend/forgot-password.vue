<template>
  <div class="backend-login d-flex align-center justify-center primary">
    <v-card
      color="white"
      elevation="0"
      class="mx-5"
      min-width="320"
      width="400"
    >
      <v-btn
        small
        text
        color="accent"
        depressed
        class=" mt-2 ml-2"
        :to="localePath({name: 'backend-login'})"
      >
        <v-icon class="mr-1">
          mdi-arrow-left
        </v-icon>
        {{ $t('GO_TO_', {text: $t('LOGIN')}) }}
      </v-btn>
      <v-card-text class="pa-8">
        <h1 class="display-1 text-center mb-8">
          {{ pageName }}
        </h1>
        <p class="text-center">
          {{ $t('FORGOT_PASSWORD_DETAIL') }}
        </p>

        <v-form ref="form" v-model="valid" @submit.prevent="save">
          <v-text-field
            v-model="email"
            label="E-mail"
            type="email"
            :rules="rules.email"
            outlined
            required
            dense
          />
          <v-btn
            color="primary"
            class="white--text"
            depressed
            block
            x-large
            type="submit"
            :disabled="sending || !valid"
            :loading="sending"
          >
            {{ $t("SEND") }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600"
    >
      <v-card>
        <v-card-text class="pa-8 text-center">
          <v-img src="/images/icon.png" max-width="300" class="mx-auto" />
          <p class="mt-8">
            {{ $t('SEND_EMAIL_SUCCESS', {email, before: $t('RESET_PASSWORD_EMAIL_BEFORE'), after: $t('RESET_PASSWORD_EMAIL_AFTER')}) }}
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
</template>

<script>
export default {
  layout: 'blank',
  middleware: 'guest-admin',
  data () {
    return {
      pageName: this.$t('FORGOT_PASSWORD'),
      dialog: false,
      valid: true,
      sending: false,
      email: '',
      rules: {
        email: [
          v => !!v || this.$t('IS_REQUIRED', { text: ' E-mail ' }),
          v => this.$email.validate(v) || this.$t('INVALID', { text: ' E-mail ' })
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
  methods: {
    closeDialog () {
      this.dialog = false
      this.email = ''
      setTimeout(() => {
        if (this.$refs.form) {
          this.$refs.form.resetValidation()
        }
      })
    },
    async  save () {
      if (this.$refs.form.validate()) {
        this.email = this.email.toLowerCase().trim()
        this.sending = true
        try {
          await this.$axios.$post(`${process.env.apiUrl}${process.env.apiDirectory}auth-admin/forgot-password`, { email: this.email })
          this.dialog = true
        } catch (e) {
          this.$notifier.showMessage({ title: this.$t('NOT_FOUND_ACCOUNT'), content: this.$t('NOT_FOUND_ACCOUNT_DETAIL'), color: 'error' })
        }
      }
      this.sending = false
    }
  }
}
</script>

<style lang="scss" scoped>
.backend-login{
  height: 100%;
}
</style>
