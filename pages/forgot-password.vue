<template>
  <div class="">
    <div class="hero-image" />
    <div class="text-center hero-title">
      <h1 :class="['font-weight-bold  themeAccent--text',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'display-1' : 'display-2']">
        {{ pageName }}
      </h1>
    </div>

    <div class="w-100 d-flex align-center justify-center py-16 hero-content">
      <div class="d-flex align-center">
        <v-card
          :elevation="['xs', 'sm'].includes($vuetify.breakpoint.name) ? '0' : ''"
          :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'rounded-0' : 'shadow rounded-lg'"
        >
          <v-card-text class="pa-8">
            <p class="text-center">
              {{ $t('FORGOT_PASSWORD_DETAIL') }}
            </p>

            <v-form ref="form" v-model="valid" @submit.prevent="save">
              <v-text-field
                v-model="email"
                label="E-mail"
                :rules="rules.email"
                class="rounded-lg"
                outlined
                required
                dense
              />
              <v-btn
                color="themePrimary"
                class="white--text rounded-lg"
                style="height: 40px;"
                depressed
                block
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
          <v-card class="">
            <v-card-text class="pa-8 text-center">
              <v-img src="/images/logo.png" max-width="300" class="mx-auto" />
              <p class="mt-8">
                {{ $t('SEND_EMAIL_SUCCESS', {email: email.toLowerCase(), before: $t('RESET_PASSWORD_EMAIL_BEFORE'), after: $t('RESET_PASSWORD_EMAIL_AFTER')}) }}
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
  </div>
</template>

<script>
export default {
  middleware: 'guest',
  data () {
    return {
      pageName: this.$t('FORGOT_PASSWORD'),
      basePath: `${process.env.baseUrl}${this.$route.fullPath}`,
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
      urlPath: this.basePath
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
        this.sending = true
        try {
          await this.$axios.$post(`${process.env.apiUrl}${process.env.apiDirectory}auth/forgot-password`, { email: this.email })
          this.dialog = true
        } catch (e) {
          this.$notifier.showMessage({ title: this.$t('NOT_FOUND_ACCOUNT'), content: this.$t('NOT_FOUND_ACCOUNT_DETAIL'), color: 'warning' })
        }
      }
      this.sending = false
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
