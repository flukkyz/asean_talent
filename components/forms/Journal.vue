<template>
  <v-dialog v-model="dialog" persistent scrollable max-width="600">
    <v-form ref="form" v-model="valid" @submit.prevent="save">
      <v-card v-if="indexStandards && publishers">
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
          <v-autocomplete
            v-model="form.publisher_id"
            :items="publishers"
            item-value="id"
            item-text="name"
            outlined
            dense
            :rules="rules.publisher_id"
          >
            <template #label>
              Publisher
              <v-icon color="error" x-small class="mt-n3">
                mdi-asterisk
              </v-icon>
            </template>
          </v-autocomplete>
          <v-autocomplete
            v-model="form.indexs"
            :items="indexStandards"
            item-value="id"
            item-text="name"
            outlined
            dense
            chips
            small-chips
            :rules="rules.indexs"
            multiple
          >
            <template #label>
              Index By
              <v-icon color="error" x-small class="mt-n3">
                mdi-asterisk
              </v-icon>
            </template>
          </v-autocomplete>
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
      modelName: 'Journal',
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      dialog: false,
      mode: '',
      valid: true,
      saving: false,
      publishers: null,
      indexStandards: null,
      rules: {
        name: [
          v => !!v || 'Title is required'
        ],
        publisher_id: [
          v => !!v || 'Publisher is required'
        ],
        indexs: [
          v => v.length > 0 || 'Index By is required'
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
  created () {
    this.$bus.$on('open-journal-form', async (data) => {
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
        this.form.indexs = this.form.IndexStandards.map(ele => ele.id)
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
    this.$bus.$off('open-journal-form')
  },
  methods: {
    async fetchRefs () {
      await Promise.all([
        this.$axios.$get(`${this.apiPath}publishers`),
        this.$axios.$get(`${this.apiPath}index-standards`)
      ]).then((values) => {
        this.publishers = values[0].rows
        this.indexStandards = values[1].rows
      })
    },
    closeDialog () {
      this.dialog = false
      this.$overlay.hide()
    },
    clearData () {
      this.form = {
        name: '',
        publisher_id: null,
        indexs: []
      }
    },
    save () {
      if (this.$refs.form.validate()) {
        this.form.IndexStandardJournals = this.form.indexs.map(ele => ({
          index_standard_id: ele
        }))
        this.saving = true
        this.$emit(this.mode, this.form)
        this.dialog = false
      }
    }
  }
}
</script>
