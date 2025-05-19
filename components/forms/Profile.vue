<template>
  <v-dialog v-model="dialog" persistent scrollable max-width="400">
    <v-form ref="form" v-model="valid" @submit.prevent="save">
      <v-card class="">
        <v-toolbar flat>
          <v-toolbar-title>
            {{ $t('EDIT', { text: $t('PROFILE')}) }}
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
            label="Name"
            outlined
            dense
            :rules="rules.name"
            required
          />
        </v-card-text>
        <v-card-actions class="pt-0 px-4 pb-4">
          <v-btn
            color="primary"
            large
            block
            x-large
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
      dialog: false,
      valid: true,
      saving: false,
      rules: {
        name: [
          v => !!v || this.$t('IS_REQUIRED', { text: 'Name' })
        ]
      },
      form: {}
    }
  },
  created () {
    this.$bus.$on('open-profile-form', (oldData) => {
      this.$overlay.showLoading()
      this.saving = false
      this.clearData()
      this.form = { ...this.form, ...oldData }
      this.dialog = true
      setTimeout(() => {
        if (this.$refs.form) {
          this.$refs.form.resetValidation()
        }
      })
    })
  },
  beforeDestroy () {
    this.$bus.$off('open-profile-form')
  },
  methods: {
    closeDialog () {
      this.dialog = false
      this.$overlay.hide()
    },
    clearData () {
      this.form = {
        name: ''

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
