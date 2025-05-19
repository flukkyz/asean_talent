<template>
  <forms-forum @save="save" />
</template>

<script>
export default {
  middleware: ['authen', 'frontend'],
  data () {
    return {
      modelName: 'Forums'
    }
  },
  head () {
    return {
      title: `Create ${this.modelName}`
    }
  },
  beforeMount () {
    if (!this.$store.state.setting.show_menu_resourse_forum) {
      this.$nuxt.error({ statusCode: 404, message: 'Not Found This Page' })
    }
  },
  mounted () {
    this.$overlay.showLoading()
    this.$breadcrumbs.setItems([
      {
        text: this.modelName,
        to: { name: 'forums' }
      },
      {
        text: 'Create'
      }
    ])
    this.$bus.$emit('open-forum-form')
  },
  methods: {
    async save (data) {
      try {
        const result = await this.$axios.$post(`${process.env.apiUrl}${process.env.apiDirectory}forums`, data)
        if (result) {
          this.$notifier.showMessage({ title: 'Published Forum', color: 'primary', icon: 'mdi-forum' })
          this.$router.push(this.localePath({ name: 'forums-slug', params: { slug: result.slug } }))
        }
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
    }
  }
}
</script>
