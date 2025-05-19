<template>
  <v-dialog v-model="dialog" persistent scrollable max-width="500">
    <v-form ref="form" v-model="valid" @submit.prevent="save">
      <v-card v-if="networkTypes">
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
            :label="`${modelName} Title`"
            outlined
            :autofocus="mode === 'add'"
            :rules="rules.name"
            required
          />
          <v-combobox
            v-model="combo.networkType"
            :items="networkTypes"
            item-value="id"
            :filter="comboFilter"
            outlined
            dense
            hide-details="auto"
            hint="Search to Select or Enter to Add new Network Type"
            persistent-hint
            :rules="rules.networkType"
            @change="updateNetworkType"
          >
            <template #label>
              Network Type
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
          <v-text-field
            v-model="form.url"
            label="URL"
            outlined
            :rules="rules.url"
            required
          />
          <v-textarea
            v-model="form.description"
            label="Description"
            outlined
            dense
            rows="3"
          />
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
      modelName: 'Portal Link',
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      dialog: false,
      mode: '',
      valid: true,
      saving: false,
      networkTypes: null,
      rules: {
        name: [
          v => !!v || `${this.modelName} Title is required`
        ],
        networkType: [
          v => !!v || 'Network Type is required'
        ],
        url: [
          v => !!v || 'URL is required'
        ]
      },
      combo: {
        networkType: null
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
    this.$bus.$on('open-asean-network-form', async (data) => {
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
      }
      this.combo.networkType = this.$_.find(this.networkTypes, { id: this.form.network_type_id })
      this.dialog = true
      setTimeout(() => {
        if (this.$refs.form) {
          this.$refs.form.resetValidation()
        }
      })
    })
  },
  beforeDestroy () {
    this.$bus.$off('open-asean-network-form')
  },
  methods: {
    async fetchRefs () {
      await Promise.all([
        this.$axios.$get(`${this.apiPath}network-types`)
      ]).then((values) => {
        this.networkTypes = values[0].rows
      })
    },
    comboFilter (item, queryText, itemText) {
      return [
        this.$findSome(queryText, item.name)
      ].some(ele => ele)
    },
    updateNetworkType (val) {
      if (val && val.id) {
        this.form.network_type_id = val.id
        this.form.networkType = null
      } else if (val && val.trim().length > 0) {
        const findLists = this.networkTypes.find(ele => ele.name.toLowerCase() === val.toLowerCase().trim())
        if (findLists) {
          this.combo.networkType = findLists
          this.form.network_type_id = findLists.id
          this.form.networkType = null
        } else {
          this.form.network_type_id = null
          this.form.networkType = val.trim()
        }
      } else {
        this.combo.networkType = null
        this.form.network_type_id = null
        this.form.networkType = null
      }
    },
    closeDialog () {
      this.dialog = false
      this.$overlay.hide()
    },
    clearData () {
      this.form = {
        name: '',
        description: '',
        url: '',
        network_type_id: null,
        networkType: null
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
