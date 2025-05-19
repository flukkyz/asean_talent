<template>
  <div>
    OK
  </div>
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'secret'],
  validate ({ $auth }) {
    return $auth.user.role === 'secret'
  },
  data () {
    return {
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`
    }
  },
  async mounted () {
    try {
      await this.$axios.get(`${this.apiPath}process-db`)
    } catch (e) {
      this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
    }
  }
}
</script>
