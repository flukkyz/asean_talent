<template>
  <v-dialog v-model="dialog" persistent scrollable max-width="500">
    <v-form ref="form" v-model="valid" @submit.prevent="save">
      <v-card class="">
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon class="mr-2">
              {{ headerIcon }}
            </v-icon>
            {{ headerText }}
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
            v-model="form.name"
            label="Name"
            outlined
            class=""
            :autofocus="mode === 'add'"
            :rules="rules.nameRules"
            required
          />
          <v-text-field
            v-model="form.email"
            label="E-mail "
            outlined
            class=""
            :disabled="mode === 'edit'"
            autocomplete="off"
            :rules="rules.email"
            :hint="$t('INPUT_HINT',{text: ' E-mail '})"
            :error-messages="errors"
            required
            @input="checkDuplicate"
          />
          <v-text-field
            v-model="form.password"
            type="password"
            label="Password"
            outlined
            class=""
            autocomplete="off"
            :rules="rules.passwordRules"
            :hint="$t('INPUT_HINT',{text: ' Password '})"
            required
          />
          <v-text-field
            v-model="form.confirm_password"
            type="password"
            :label="$t('USER_CONFIRM_PASSWORD')"
            outlined
            class=""
            autocomplete="off"
            :rules="rules.confirmPasswordRules"
            :hint="$t('INPUT_HINT',{text: $t('USER_CONFIRM_PASSWORD')})"
            required
          />
          <div v-if="form.role !== 'secret'" class="">
            <label for="form.role" v-text="$t('ROLE')" />
            <v-radio-group
              v-model="form.role"
              column
              class="mt-0 pt-0"
              :rules="rules.roleRules"
              required
              @change="onSelectedRole"
            >
              <v-radio
                v-for="(value, name) in roles"
                :key="name"
                :label="value"
                :value="name"
              />
            </v-radio-group>
            <v-autocomplete
              v-if="form.role === 'country_admin'"
              v-model="form.country_id"
              :items="countries.filter(ele => aseanCountries.includes(ele.name))"
              item-value="id"
              item-text="name"
              outlined
              class="rounded-lg"
              label="Country"
              dense
              :rules="rules.country"
            />
          </div>
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
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      checkUserApi: `${process.env.apiUrl}${process.env.apiDirectory}users-check`,
      modelName: 'User',
      dialog: false,
      mode: '',
      countries: null,
      valid: true,
      saving: false,
      errors: [],
      rules: {
        nameRules: [
          v => !!v || this.$t('IS_REQUIRED', { text: 'Name' })
        ],
        email: [
          v => !!v || this.$t('IS_REQUIRED', { text: ' E-mail ' }),
          v => this.$email.validate(v) || this.$t('INVALID', { text: ' E-mail ' })
        ],
        passwordRules: [
          v => (!!v && this.mode === 'add') || this.mode === 'edit' || this.$t('IS_REQUIRED', { text: ' Password ' }),
          v => !v || (!!v && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(v)) || this.$t('INVALID_PASSWORD')
        ],
        confirmPasswordRules: [
          v => !this.form.password || (!!this.form.password && v === this.form.password) || this.$t('PASSWORD_NOT_MATCH')
        ],
        country: [
          v => !!v || 'Country is required'
        ],
        roleRules: [
          v => !!v || this.$t('IS_REQUIRED', { text: this.$t('ROLE') })
        ]
      },
      form: {},
      debounce: null,
      oldMail: ''
    }
  },
  computed: {
    headerText () {
      return this.mode === 'add' ? `Add ${this.modelName}` : `Edit ${this.modelName}`
    },
    headerIcon () {
      return this.mode === 'add' ? 'fas fa-plus' : 'fas fa-edit'
    },
    roles () {
      return this.$store.state.enums.roles
    },
    aseanCountries () {
      return this.$store.state.aseanCountries
    }
  },
  created () {
    this.$bus.$on('open-user-form', (data) => {
      this.$overlay.showLoading()
      this.saving = false
      this.clearData()
      this.mode = 'add'
      if (data) {
        this.mode = 'edit'
        this.form = {
          ...this.form,
          ...data
        }
        this.form.password = ''
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
    this.$bus.$off('open-user-form')
  },
  async mounted () {
    try {
      const countries = await this.$axios.$get(`${this.apiPath}countries`)
      this.countries = countries.rows
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
  },
  methods: {
    onSelectedRole (val) {
      if (val === 'admin') {
        this.form.country_id = null
      }
    },
    closeDialog () {
      this.dialog = false
      this.$overlay.hide()
    },
    checkDuplicate (val) {
      clearTimeout(this.debounce)
      this.debounce = setTimeout(async () => {
        this.errors = []
        if (this.$email.validate(val) && val !== this.oldMail) {
          try {
            const res = await this.$axios.$post(this.checkUserApi, { email: val.toLowerCase() })
            if (res) {
              this.errors = [this.$t('ALREADY', { text: ' E-mail ' })]
            }
          } catch (e) {

          }
        }
      }, 600)
    },
    clearData () {
      this.form = {
        email: '',
        password: '',
        confirm_password: '',
        role: 'country_admin',
        country_id: null
      }
    },
    save () {
      if (this.$refs.form.validate() && this.errors.length === 0) {
        this.form.email = this.form.email.toLowerCase()
        if (!this.form.password) {
          delete this.form.password
        }
        this.saving = true
        this.$emit(this.mode, this.form)
        this.dialog = false
      }
    }
  }
}
</script>
