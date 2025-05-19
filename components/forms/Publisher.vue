<template>
  <v-dialog v-model="dialog" persistent scrollable :max-width="dialogWidth">
    <v-form ref="form" v-model="valid" @submit.prevent="save">
      <v-card v-if="countries">
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

        <v-card-text>
          <v-text-field
            v-model="form.name"
            outlined
            :autofocus="mode === 'add'"
            :rules="rules.name"
            required
          >
            <template #label>
              Title
              <v-icon color="error" x-small class="mt-n3">
                mdi-asterisk
              </v-icon>
            </template>
          </v-text-field>

          <v-combobox
            v-model="combo.country"
            :items="countries"
            item-value="id"
            :filter="comboFilter"
            outlined
            :disabled="!!form.country_id && ['country_admin'].includes($auth.user.role)"
            dense
            hide-details="auto"
            hint="Search to Select or Enter to Add new Country"
            persistent-hint
            :rules="rules.country"
            @change="updateCountry"
          >
            <template #label>
              Country
              <v-icon color="error" x-small class="mt-n3">
                mdi-asterisk
              </v-icon>
            </template>
            <template #item="{ item }">
              {{ item.name }}
            </template>
            <template #selection="data">
              <span
                v-if="data.item.id"
                class="info--text font-weight-bold"
                v-text="data.item.name"
              />
              <span v-else>
                {{ data.item }}
              </span>
            </template>
          </v-combobox>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            type="submit"
            x-large
            block
            color="primary"
            :disabled="saving || !valid"
            :loading="saving"
          >
            Save
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
      modelName: 'Publisher',
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      dialog: false,
      dialogWidth: 999,
      mode: '',
      valid: true,
      saving: false,
      countries: null,
      rules: {
        name: [
          v => !!v || 'Title is required'
        ],
        country: [
          v => !!v || 'Country is required'
        ]
      },
      combo: {
        country: null
      },
      form: {}
    }
  },
  computed: {
    headerText () {
      return this.mode === 'add' ? `Create ${this.modelName}` : `Update ${this.modelName}`
    },
    headerIcon () {
      return this.mode === 'add' ? 'fas fa-plus' : 'fas fa-edit'
    }
  },
  created () {
    this.$bus.$on('open-publisher-form', async (data) => {
      this.dialogWidth = 999
      this.$overlay.showLoading()
      await this.fetchRefs()
      this.saving = false
      this.clearData()
      this.mode = 'add'
      if (data) {
        this.mode = 'edit'
        this.form = {
          ...this.form,
          ...data
        }
      } else if (['country_admin'].includes(this.$auth.user.role)) {
        const findCountry = this.$_.find(this.countries, { name: this.$auth.user.country })
        this.form.country_id = findCountry.id
      }
      this.combo.country = this.$_.find(this.countries, { id: this.form.country_id })
      this.dialog = true
      setTimeout(() => {
        if (this.$refs.form) {
          this.$refs.form.resetValidation()
        }
      })
      setTimeout(() => {
        this.dialogWidth = 1000
      }, 300)
    })
  },
  beforeDestroy () {
    this.$bus.$off('open-publisher-form')
  },
  methods: {
    async fetchRefs () {
      await Promise.all([
        this.$axios.$get(`${this.apiPath}countries`)
      ]).then((values) => {
        this.countries = values[0].rows
      })
    },
    comboFilter (item, queryText, itemText) {
      return [
        this.$findSome(queryText, item.name)
      ].some(ele => ele)
    },
    updateCountry (val) {
      if (val && val.id) {
        this.form.country_id = val.id
        this.form.country = null
      } else if (val && val.trim().length > 0) {
        const findLists = this.countries.find(ele => ele.name.toLowerCase() === val.toLowerCase().trim())
        if (findLists) {
          this.combo.country = findLists
          this.form.country_id = findLists.id
          this.form.country = null
        } else {
          this.form.country_id = null
          this.form.country = val.trim()
        }
      } else {
        this.combo.country = null
        this.form.country_id = null
        this.form.country = null
      }
    },
    closeDialog () {
      this.dialog = false
      this.$overlay.hide()
    },
    clearData () {
      this.form = {
        name: '',
        country_id: null,
        country: null
      }
    },
    save () {
      if (this.$refs.form.validate()) {
        this.saving = true
        this.$emit(this.mode, this.form)
        this.dialog = false
      }
    }
  }
}
</script>
