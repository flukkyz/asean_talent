<template>
  <v-dialog v-model="dialog" persistent scrollable max-width="600">
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
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.firstname"
                outlined
                :autofocus="mode === 'add'"
                :rules="rules.firstname"
                required
              >
                <template #label>
                  Firstname
                  <v-icon color="error" x-small class="mt-n3">
                    mdi-asterisk
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.lastname"
                outlined
                :rules="rules.lastname"
                required
                @input="silentSearchTalents"
              >
                <template #label>
                  Lastname
                  <v-icon color="error" x-small class="mt-n3">
                    mdi-asterisk
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <!-- <v-autocomplete
            v-model="form.talent_id"
            :items="talents"
            :search-input.sync="searchTalents"
            :filter="talentCustomFilter"
            clearable
            item-value="id"
            outlined
            persistent-hint
            label="Talent"
            hint="Search Talent by Firstname or Lastname"
            hide-selected
          >
            <template #item="item">
              <v-list-item-content>
                <v-list-item-title v-text="`${item.item.firstname} ${item.item.lastname}`" />
                <v-list-item-subtitle v-text="item.item.email" />
              </v-list-item-content>
            </template>
            <template #selection="item">
              <v-list-item-content>
                <v-list-item-title v-text="`${item.item.firstname} ${item.item.lastname}`" />
                <v-list-item-subtitle v-text="item.item.email" />
              </v-list-item-content>
            </template>
            <template #no-data>
              <v-list-item v-if="isLoadingSearchTalents || timeoutDelaySearchTalents">
                <v-list-item-icon class="mr-2">
                  <v-progress-circular
                    :size="22"
                    :width="3"
                    color="info"
                    indeterminate
                  />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="grey--text" v-text="'Searching...'" />
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-else>
                <v-list-item-content>
                  <v-list-item-title class="error--text font-weight-bold" v-text="'Not found'" />
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-autocomplete> -->
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
      modelName: 'Co Author',
      api: `${process.env.apiUrl}${process.env.apiDirectory}talents`,
      dialog: false,
      mode: '',
      valid: true,
      saving: false,
      talents: [],
      isLoadingSearchTalents: false,
      timeoutDelaySearchTalents: null,
      searchTalents: null,
      rules: {
        firstname: [
          v => !!v || 'Firstname is required'
        ],
        lastname: [
          v => !!v || 'Lastname is required'
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
    }
  },
  watch: {
    searchTalents (val) {
      clearTimeout(this.timeoutDelaySearchTalents)
      this.timeoutDelaySearchTalents = null
      this.timeoutDelaySearchTalents = setTimeout(async () => {
        this.isLoadingSearchTalents = true
        await this.fetchTalents(val)
        this.timeoutDelaySearchTalents = null
        this.isLoadingSearchTalents = false
      }, 500)
    }
  },
  created () {
    this.$bus.$on('open-co-author-form', async (data) => {
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
        await this.fetchTalents(this.form.lastname)
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
    this.$bus.$off('open-co-author-form')
  },
  methods: {
    async fetchTalents (val) {
      try {
        const searchParams = new URLSearchParams({
          size: 50,
          q: val.trim(),
          page: 1
        }).toString()
        const datas = await this.$axios.$get(`${this.api}${(searchParams ? '?' + searchParams : '')}`)
        this.talents = datas.rows
      } catch (e) {
        this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
      }
    },
    talentCustomFilter (item, queryText, itemText) {
      return [
        this.$findSome(queryText, item.firstname),
        this.$findSome(queryText, item.lastname),
        this.$findSome(queryText, item.email)
      ].some(ele => ele)
    },
    async silentSearchTalents (val) {
      await this.fetchTalents(val)
    },
    closeDialog () {
      this.dialog = false
      this.$overlay.hide()
    },
    clearData () {
      this.form = {
        firstname: '',
        lastname: ''
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
