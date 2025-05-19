<template>
  <v-dialog v-model="dialog" persistent scrollable max-width="800">
    <v-form ref="form" v-model="valid" @submit.prevent="save">
      <v-card>
        <v-toolbar
          color="bgLight"
          elevation="0"
          flat
        >
          <v-toolbar-title>
            <h3 class="primary--text">
              {{ edit ? $t('EDIT', { text: $t('PROFILE')}) : $t('PROFILE') }}
            </h3>
          </v-toolbar-title>
          <v-spacer />
          <v-btn v-if="edit" fab x-small text @click="closeDialog">
            <v-icon>
              fas fa-times
            </v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <p class="grey--text ml-3 font-weight-bold">
            Organization Info
          </p>
          <v-autocomplete
            v-model="form.organization_type_id"
            :items="organizationTypes"
            item-value="id"
            item-text="name"
            outlined
            dense
            :rules="rules.organization_type"
          >
            <template #label>
              Organization Type
              <v-icon color="error" x-small class="mt-n3">
                mdi-asterisk
              </v-icon>
            </template>
          </v-autocomplete>
          <v-text-field
            v-model="form.name"
            outlined
            :rules="rules.name"
            dense
            required
          >
            <template #label>
              Company Name
              <v-icon color="error" x-small class="mt-n3">
                mdi-asterisk
              </v-icon>
            </template>
          </v-text-field>

          <v-currency-field
            v-model="form.size"
            label="Amount of Staff"
            outlined
            :min="0"
            :decimal-length="0"
            dense
          />

          <v-textarea
            v-model="form.product"
            label="Product and Service"
            outlined
            dense
            rows="3"
          />
          <v-textarea
            v-model="form.research_area"
            label="Research Area"
            outlined
            dense
            rows="3"
          />
          <v-textarea
            v-model="form.address"
            label="Address"
            rows="3"
            outlined
            dense
          />

          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.city"
                label="City"
                outlined
                dense
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-autocomplete
                v-model="form.country_id"
                :items="countries"
                item-value="id"
                item-text="name"
                outlined
                dense
                :rules="rules.country"
              >
                <template #label>
                  Country
                  <v-icon color="error" x-small class="mt-n3">
                    mdi-asterisk
                  </v-icon>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
          <p class="grey--text ml-3 font-weight-bold">
            Contact Info
          </p>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="form.contact_name"
                outlined
                label="Contact Name"
                dense
              />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="form.department"
                label="Department"
                outlined
                dense
              />
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field
                v-model="form.contact_email"
                label="Contact E-mail"
                outlined
                dense
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-4 pb-4">
          <v-btn
            color="primary"
            large
            block
            elevation="0"
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
      countryApi: `${process.env.apiUrl}${process.env.apiDirectory}countries`,
      dialog: false,
      valid: true,
      saving: false,
      edit: true,
      countries: null,
      organizationTypes: null,
      rules: {
        name: [
          v => !!v || 'Name is required'
        ],
        department: [
          v => !!v || 'Department is required'
        ],
        country: [
          v => !!v || 'Country is required'
        ],
        organization_type: [
          v => !!v || 'Organization Type is required'
        ],
        size: [
          v => !!v || 'Amount of Co Staff is required'
        ],
        firstname: [
          v => !!v || this.$t('IS_REQUIRED', { text: this.$t('FIRSTNAME') })
        ],
        lastname: [
          v => !!v || this.$t('IS_REQUIRED', { text: this.$t('LASTNAME') })
        ]
      },
      form: {}
    }
  },
  created () {
    this.$bus.$on('open-organization-form', (oldData, edit = true) => {
      this.$overlay.showLoading()
      this.saving = false
      this.edit = edit
      this.clearData()
      this.form = { ...this.form, ...oldData.Organization }
      this.dialog = true
      setTimeout(() => {
        if (this.$refs.form) {
          this.$refs.form.resetValidation()
        }
      })
    })
  },
  async mounted () {
    try {
      await Promise.all([
        this.$axios.$get(`${this.apiPath}organization-types`),
        this.$axios.$get(`${this.apiPath}countries`)
      ]).then((values) => {
        this.organizationTypes = values[0].rows
        this.countries = values[1].rows
      })
    } catch (e) {
      console.log(e)
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
  },
  beforeDestroy () {
    this.$bus.$off('open-organization-form')
  },
  methods: {
    closeDialog () {
      this.dialog = false
      this.$overlay.hide()
    },
    clearData () {
      this.form = {
        name: '',
        organization_type_id: null,
        size: null,
        product: '',
        research_area: '',
        contact_name: '',
        contact_email: '',
        department: '',
        address: '',
        country_id: null,
        city: ''
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
