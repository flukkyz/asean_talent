<template>
  <v-dialog v-model="dialog" persistent scrollable max-width="600">
    <v-form ref="form" v-model="valid" @submit.prevent="save">
      <v-card class="rounded-lg">
        <v-toolbar
          elevation="0"
          flat
          height="93"
        >
          <v-toolbar-title>
            <p class="title black--text mb-0">
              {{ hasPassword ? 'Change your password' : 'Create your password' }}
            </p>
            <p class="grey--text body-2 mb-0">
              Your current password is required for changing to your new password.
            </p>
          </v-toolbar-title>

          <v-spacer />
          <v-btn fab x-small text @click="closeDialog">
            <v-icon>
              fas fa-times
            </v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider />

        <v-card-text>
          <div class="d-flex align-center">
            <div class="w-30 flex-shrink-0">
              <p class="body-1 mb-6 ">
                {{ $t('OLD_PASSWORD') }}
              </p>
            </div>
            <v-text-field
              v-if="hasPassword"
              v-model="form.old_password"
              type="password"
              outlined
              autofocus
              class="rounded-lg"
              dense
              autocomplete="off"
              :rules="rules.oldPassword"
              :hint="$t('INPUT_HINT',{text: $t('OLD_PASSWORD')})"
              required
            />
          </div>
          <div class="d-flex align-center">
            <div class="w-30 flex-shrink-0">
              <p class="body-1 mb-6 ">
                {{ hasPassword ? $t('_NEW',{text: ' Password ' }) : 'Password' }}
              </p>
            </div>
            <v-text-field
              v-model="form.password"
              type="password"
              outlined
              autocomplete="off"
              class="rounded-lg"
              dense
              :rules="rules.password"
              :hint="$t('INPUT_HINT',{text: $t('_NEW',{text: ' Password ' })})"
              required
            />
          </div>
          <div class="d-flex align-center">
            <div class="w-30 flex-shrink-0">
              <p class="body-1 mb-6 ">
                {{ $t('USER_CONFIRM_PASSWORD') }}
              </p>
            </div>
            <v-text-field
              v-model="form.confirm_password"
              type="password"
              outlined
              autocomplete="off"
              class="rounded-lg"
              dense
              :rules="rules.confirmPassword"
              :hint="$t('INPUT_HINT',{text: $t('USER_CONFIRM_PASSWORD')})"
              required
            />
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions class="px-4 pt-3 pb-4">
          <v-spacer />
          <v-btn
            large
            class="rounded-lg mr-1 px-4"
            :disabled="saving"
            outlined
            :loading="saving"
            @click="closeDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            type="submit"
            large
            class="rounded-lg white--text px-4"
            :disabled="saving || !valid"
            color="themeAccent"
            :loading="saving"
          >
            {{ hasPassword ? 'Change password' : 'Create password' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
export default {
  props: {
    hasPassword: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      dialog: false,
      valid: true,
      saving: false,
      rules: {
        oldPassword: [
          v => !!v || this.$t('IS_REQUIRED', { text: this.$t('OLD_PASSWORD') })
        ],
        password: [
          v => !!v || this.$t('IS_REQUIRED', { text: this.$t('_NEW', { text: ' Password ' }) }),
          v => !v || (!!v && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(v)) || this.$t('INVALID_PASSWORD')
        ],
        confirmPassword: [
          v => (!!this.form.password && v === this.form.password) || this.$t('PASSWORD_NOT_MATCH')
        ]
      },
      form: {}
    }
  },
  created () {
    this.$bus.$on('open-change-password-form', () => {
      this.$overlay.showLoading()
      this.saving = false
      this.clearData()
      this.dialog = true
      setTimeout(() => {
        if (this.$refs.form) {
          this.$refs.form.resetValidation()
        }
      })
    })
  },
  beforeDestroy () {
    this.$bus.$off('open-change-password-form')
  },
  methods: {
    closeDialog () {
      this.dialog = false
      this.$overlay.hide()
    },
    clearData () {
      this.form = {
        old_password: '',
        password: '',
        confirm_password: ''
      }
    },
    save () {
      if (this.$refs.form.validate()) {
        this.saving = true
        this.$emit('save', this.form)
        this.dialog = false
      }
    }
  }
}
</script>
