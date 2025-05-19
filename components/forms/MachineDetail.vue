<template>
  <v-dialog v-model="dialog" persistent scrollable max-width="800">
    <v-form ref="form" v-model="valid" @submit.prevent="save">
      <v-card>
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
              Equipment Name
              <v-icon color="error" x-small class="mt-n3">
                mdi-asterisk
              </v-icon>
            </template>
          </v-text-field>
          <v-currency-field
            v-model.number="form.price"
            outlined
            :decimal-length="{min:0 ,max:2}"
            dense
            class="flex-grow-1"
            required
          >
            <template #label>
              Equipment Price
              <!-- <v-icon color="error" x-small class="mt-n3">
                mdi-asterisk
              </v-icon> -->
            </template>
          </v-currency-field>
          <v-text-field
            v-model="form.link"
            :label="`${modelName} Link`"
            dense
            outlined
          />
          <v-currency-field
            v-model.number="form.service_condition"
            label="Equipment Service Cost"
            outlined
            :decimal-length="{min:0 ,max:2}"
            dense
          />
          <v-select
            v-model="form.currency_id"
            :items="currencies"
            item-value="id"
            item-text="code"
            outlined
            clearable
            dense
          >
            <template #label>
              Currency
              <!-- <v-icon color="error" x-small class="mt-n3">
                  mdi-asterisk
                </v-icon> -->
            </template>
          </v-select>
          <label for="form.role">Equipment Status</label>
          <v-radio-group
            v-model="form.status"
            class="mt-0 pt-0"
            column
          >
            <v-radio
              v-for="(value, name) in machineStatuses"
              :key="name"
              :label="value"
              :value="name"
            />
          </v-radio-group>
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
      modelName: 'Equipment',
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      dialog: false,
      mode: '',
      valid: true,
      saving: false,
      currencies: null,
      labLocation: null,
      rules: {
        name: [
          v => !!v || 'Equipment Name is required'
        ],
        price: [
          v => !!v || 'price is required'
        ]
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
    },
    machineStatuses () {
      return this.$store.state.enums.machineStatuses
    }
  },
  created () {
    this.$bus.$on('open-machine-detail-form', async (labLocation, data) => {
      this.$overlay.showLoading()
      await this.fetchRefs()
      this.labLocation = labLocation
      this.saving = false
      this.clearData()
      this.mode = 'add'
      if (data) {
        this.mode = 'edit'
        this.form = {
          ...this.form,
          ...data
        }
      } else {
        this.form.lab_location_id = labLocation.id
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
    this.$bus.$off('open-machine-detail-form')
  },
  methods: {
    async fetchRefs () {
      await Promise.all([
        this.$axios.$get(`${this.apiPath}currencies/asean`)
      ]).then((values) => {
        this.currencies = values[0]
      })
    },
    closeDialog () {
      this.dialog = false
      this.$overlay.hide()
    },
    clearData () {
      this.form = {
        name: '',
        status: 'active',
        price: null,
        currency_id: null,
        link: '',
        service_condition: null
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
