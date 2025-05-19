<template>
  <div class="">
    <v-form ref="form" v-model="valid" @submit.prevent="save">
      <v-text-field
        v-model="form.name"
        :label="$t('CONTACT_NAME')"
        class=""
        :rules="rules.name"
        outlined
        required
        dense
      />
      <v-text-field
        v-model="form.email"
        :label="$t('CONTACT_EMAIL')"
        class=""
        :rules="rules.email"
        outlined
        required
        dense
      />
      <v-text-field
        v-model="form.title"
        :label="$t('CONTACT_TITLE')"
        class=""
        :rules="rules.title"
        outlined
        required
        dense
      />
      <v-textarea
        v-model="form.note"
        :label="$t('CONTACT_NOTE')"
        class=""
        rows="6"
        :rules="rules.note"
        outlined
        required
        dense
      />
      <div class="text-right">
        <v-btn
          color="primary"
          class="px-16 mt-3"

          type="submit"
          :disabled="saving || !valid"
          :loading="saving"
        >
          {{ $t("SEND") }}
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      valid: true,
      saving: false,
      rules: {
        name: [
          v => !!v || this.$t('IS_REQUIRED', { text: this.$t('CONTACT_NAME') })
        ],
        email: [
          v => !!v || this.$t('IS_REQUIRED', { text: ' E-mail ' }),
          v => this.$email.validate(v) || this.$t('INVALID', { text: ' E-mail ' })
        ],
        title: [
          v => !!v || this.$t('IS_REQUIRED', { text: this.$t('CONTACT_TITLE') })
        ],
        note: [
          v => !!v || this.$t('IS_REQUIRED', { text: this.$t('CONTACT_NOTE') })
        ]
      },
      form: {}
    }
  },
  created () {
    this.clearData()
  },
  methods: {
    clearData () {
      this.form = {
        name: this.$auth.loggedIn && !this.$auth.user.role ? `${this.$auth.user.firstname} ${this.$auth.user.lastname}` : '',
        email: this.$auth.loggedIn && !this.$auth.user.role ? this.$auth.user.email : '',
        title: '',
        note: ''
      }
      this.saving = false
      setTimeout(() => {
        if (this.$refs.form) {
          this.$refs.form.resetValidation()
        }
      })
    },
    async save () {
      if (this.$refs.form.validate()) {
        this.saving = true
        this.form.email = this.form.email.toLowerCase()
        try {
          await this.$axios.$post(`${process.env.apiUrl}${process.env.apiDirectory}contact`, this.form)
          this.$notifier.showMessage({ title: this.$t('SENDED'), content: this.$t('SENDED_DETAIL'), color: 'primary', icon: 'fas fa-paper-plane' })
          this.saving = false
          this.clearData()
        } catch (e) {
          this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
        }
      }
    }
  }
}
</script>
