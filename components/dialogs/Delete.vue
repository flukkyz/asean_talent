<template>
  <div>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="400"
    >
      <v-card class="">
        <v-card-title class="headline">
          Delete Selected ?
        </v-card-title>

        <v-card-text>
          Are you sure you want to delete {{ text }} ?
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            text

            :disabled="oneClick"
            @click="closeDialog"
          >
            Cancel
          </v-btn>

          <v-btn
            color="error"

            :disabled="oneClick"
            @click="onDelete"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      dialog: false,
      id: null,
      text: '',
      oneClick: false,
      key: null
    }
  },
  created () {
    this.$bus.$on(`open-delete-dialog${(this.value ? `-${this.value}` : '')}`, (id, text, key = null, showLoading = true) => {
      if (showLoading) {
        this.$overlay.showLoading()
      }
      this.oneClick = false
      this.id = id
      this.text = text
      this.key = key
      this.dialog = true
    })
  },
  beforeDestroy () {
    this.$bus.$off(`open-delete-dialog${(this.value ? `-${this.value}` : '')}`)
  },
  methods: {
    closeDialog () {
      this.dialog = false
      this.$overlay.hide()
    },
    onDelete () {
      this.oneClick = true
      this.$emit('delete', this.id, this.key)
      this.dialog = false
    }
  }
}
</script>
