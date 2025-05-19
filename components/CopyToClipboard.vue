<template>
  <v-btn
    x-small
    :disabled="disableCopyBtn"
    @click="copyToClipboard"
  >
    {{ btnText }}
    {{ btnAppendText }}
  </v-btn>
</template>

<script>
export default {
  props: {
    inputId: {
      type: String,
      default: 'input'
    },
    btnAppendText: {
      type: String,
      default: ''
    },
    copyText: {
      type: String,
      default: ''
    },
    disableDuration: {
      type: Number,
      default: 2000
    }
  },
  data () {
    return {
      btnText: 'Copy',
      disableCopyBtn: false
    }
  },
  methods: {
    copyToClipboard () {
      this.disableCopyBtn = true
      this.$copyText(this.copyText)
      this.$notifier.showMessage({ title: 'Copy to Clipboard', content: 'Copied ' + this.copyText, color: 'info' })
      this.btnText = 'Copied'
      setTimeout(() => {
        this.btnText = 'Copy'
        this.disableCopyBtn = false
      }, this.disableDuration)
    }
  }
}
</script>
