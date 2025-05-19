<template>
  <forms-talent :model-name="modelName" @save="save" @removeImage="removeImage" />
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'country_admin'],
  validate ({ params }) {
    return /^\d+$/.test(params.id)
  },
  data () {
    return {
      api: `${process.env.apiUrl}${process.env.apiDirectory}young-talents`,
      modelName: 'Young Talent',
      data: null
    }
  },
  head () {
    return {
      title: this.data ? `Update ${this.data.firstname} ${this.data.lastname}` : `Update ${this.modelName}`
    }
  },
  async mounted () {
    this.$overlay.showLoading()
    try {
      const data = await this.$axios.$get(`${this.api}/${this.$route.params.id}`)
      this.data = data
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
    this.$breadcrumbs.setItems([
      {
        text: this.modelName,
        to: { name: 'backend-manages-young-talents' }
      },
      {
        text: `${this.data.firstname} ${this.data.lastname}`,
        to: { name: 'backend-manages-young-talents-id', params: { id: this.$route.params.id } }
      },
      {
        text: 'Update'
      }
    ])
    this.$bus.$emit('open-talent-form', this.data)
  },
  methods: {
    async save (data) {
      try {
        const result = await this.$axios.$put(`${this.api}/${data.get('id')}`, data)
        if (result) {
          this.$notifier.showMessage({ title: 'Updated', content: `Updated ${this.modelName} Successfully`, color: 'success' })
          this.$router.push(this.localePath({ name: 'backend-manages-young-talents-id', params: { id: result.id } }))
        }
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
    },
    async removeImage (data) {
      try {
        const result = await this.$axios.$put(`${this.api}/${data.id}/remove-image`, data)
        if (result) {
          this.$notifier.showMessage({ title: 'Updated', content: 'Remove Image Successfully', color: 'success' })
        }
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
    }
  }
}
</script>
