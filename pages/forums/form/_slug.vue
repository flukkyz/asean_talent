<template>
  <forms-forum @save="save" @removeImage="removeImage" />
</template>

<script>
export default {
  middleware: ['authen', 'frontend'],
  data () {
    return {
      api: `${process.env.apiUrl}${process.env.apiDirectory}forums`,
      modelName: 'Forums',
      data: null
    }
  },
  head () {
    return {
      title: this.data ? `Update ${this.data.firstname} ${this.data.lastname}` : `Update ${this.modelName}`
    }
  },
  beforeMount () {
    if (!this.$store.state.setting.show_menu_resourse_forum) {
      this.$nuxt.error({ statusCode: 404, message: 'Not Found This Page' })
    }
  },
  async mounted () {
    this.$overlay.showLoading()
    try {
      const data = await this.$axios.$get(`${this.api}/${this.$route.params.slug}`)
      this.data = data
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
    this.$breadcrumbs.setItems([
      {
        text: this.modelName,
        to: { name: 'forums' }
      },
      {
        text: this.data.title,
        to: { name: 'forums-slug', params: { id: this.data.slug } }
      },
      {
        text: 'Update'
      }
    ])
    this.$bus.$emit('open-forum-form', this.data)
  },
  methods: {
    async save (data) {
      try {
        const result = await this.$axios.$put(`${this.api}/${data.get('id')}`, data)
        if (result) {
          this.$notifier.showMessage({ title: 'Updated Forum', color: 'primary', icon: 'mdi-forum' })
          this.$router.push(this.localePath({ name: 'forums-slug', params: { slug: result.slug } }))
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
