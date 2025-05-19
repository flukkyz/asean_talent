<template>
  <v-dialog v-model="dialog" persistent scrollable :retain-focus="false" :max-width="dialogWidth">
    <v-form ref="form" v-model="valid" @submit.prevent="save">
      <v-card v-if="form" class="rounded-0">
        <v-toolbar flat>
          <v-toolbar-title>
            Update {{ modelName }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn fab x-small text @click="closeDialog">
            <v-icon>
              fas fa-times
            </v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <client-only placeholder="Loading...">
            <ck-editor
              v-model="form[field]"
              :config="upload ? $ckConfig(uploadConfig) : $ckConfig()"
            />
          </client-only>
        </v-card-text>
        <v-card-actions class="px-4 pb-4">
          <v-spacer />
          <v-btn
            color="info rounded-0"
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
      uploadConfig: {
        uploadUrl: `${process.env.apiUrl}${process.env.apiDirectory}upload-img`,
        headers: {
          Authorization: this.$auth.strategy.token.get()
        }
      },
      dialog: false,
      dialogWidth: 1399,
      valid: true,
      saving: false,
      form: null,
      field: '',
      modelName: '',
      upload: true
    }
  },
  created () {
    this.$bus.$on('open-popup-form', (oldData, field, modelName, upload = true) => {
      this.dialogWidth = 1399
      this.$overlay.showLoading()
      this.saving = false
      this.field = field
      this.modelName = modelName
      this.upload = upload
      this.form = { ...oldData }
      this.dialog = true
      setTimeout(() => {
        if (this.$refs.form) {
          this.$refs.form.resetValidation()
        }
      })
      setTimeout(() => {
        this.dialogWidth = 1400
      }, 300)
    })
  },
  beforeDestroy () {
    this.$bus.$off('open-popup-form')
  },
  methods: {
    closeDialog () {
      this.dialog = false
      this.$overlay.hide()
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
