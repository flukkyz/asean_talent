<template>
  <forms-talent @save="save" />
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'country_admin'],
  data () {
    return {
      modelName: 'Talent'
    }
  },
  head () {
    return {
      title: `Create ${this.modelName}`
    }
  },
  mounted () {
    this.$overlay.showLoading()
    this.$breadcrumbs.setItems([
      {
        text: this.modelName,
        to: { name: 'backend-manages-talents' }
      },
      {
        text: 'Create'
      }
    ])
    this.$bus.$emit('open-talent-form')
  },
  methods: {
    async save (data) {
      try {
        const result = await this.$axios.$post(`${process.env.apiUrl}${process.env.apiDirectory}talents`, data)
        if (result) {
          this.$notifier.showMessage({ title: 'Created', content: `Create ${this.modelName} Successfully`, color: 'success' })
          this.$router.push(this.localePath({ name: 'backend-manages-talents-id', params: { id: result.id } }))
        }
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
    }
  }
}
</script>
