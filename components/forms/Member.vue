<template>
  <v-dialog v-model="dialog" persistent scrollable max-width="500">
    <v-form ref="form" v-model="valid" @submit.prevent="save">
      <v-card class="">
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon class="mr-2">
              fas fa-edit
            </v-icon>
            {{ modelName }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn fab x-small text @click="closeDialog">
            <v-icon>
              fas fa-times
            </v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pt-5">
          <v-text-field
            v-model="form.email"
            outlined
            class="rounded-lg"
            autocomplete="off"
            autofocus
            clearable
            :rules="rules.email"
            :hint="$t('INPUT_HINT',{text: ' E-mail '})"
            :error-messages="errors"
            required
            dense
            @input="checkDuplicate"
          >
            <template #label>
              E-mail
              <v-icon color="error" x-small class="mt-n3">
                mdi-asterisk
              </v-icon>
            </template>
          </v-text-field>
        </v-card-text>
        <v-card-actions class="px-4 pb-4">
          <v-spacer />
          <v-btn
            color="primary"
            x-large
            block

            type="submit"
            :disabled="saving || !valid"
            :loading="saving"
          >
            {{ $t('SAVE') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
export default {
  data () {
    return {
      checkMemberApi: `${process.env.apiUrl}${process.env.apiDirectory}members-check`,
      modelName: 'Edit E-mail',
      dialog: false,
      valid: true,
      saving: false,
      oldMail: '',
      errors: [],
      rules: {
        email: [
          v => !!v || this.$t('IS_REQUIRED', { text: ' E-mail ' }),
          v => this.$email.validate(v) || this.$t('INVALID', { text: ' E-mail ' })
        ]
      },
      form: {},
      debounce: null
    }
  },
  created () {
    this.$bus.$on('open-member-form', (data) => {
      this.$overlay.showLoading()
      this.saving = false
      this.clearData()
      if (data) {
        this.form.email = data.email
        this.form.id = data.id
        this.oldMail = data.email
      }
      this.dialog = true
      setTimeout(() => {
        if (this.$refs.form) {
          this.$refs.form.resetValidation()
        }
      })
    })
  },
  beforeDestroy () {
    this.$bus.$off('open-member-form')
  },
  methods: {
    checkDuplicate (val) {
      clearTimeout(this.debounce)
      this.debounce = setTimeout(async () => {
        this.errors = []
        if (this.$email.validate(val) && val !== this.oldMail) {
          try {
            const res = await this.$axios.$post(this.checkMemberApi, { email: val.toLowerCase() })
            if (res) {
              this.errors = [this.$t('ALREADY', { text: ' E-mail ' })]
            }
          } catch (e) {

          }
        }
      }, 600)
    },
    closeDialog () {
      this.dialog = false
      this.$overlay.hide()
    },
    clearData () {
      this.form = {
        email: ''
      }
    },
    save () {
      if (this.$refs.form.validate() && this.errors.length === 0) {
        this.saving = true
        this.form.email = this.form.email.toLowerCase()
        this.$emit('save', this.form)
        this.dialog = false
      }
    }
  }
}
</script>
