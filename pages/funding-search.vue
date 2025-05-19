<template>
  <div class="py-16">
    <v-container :class="$vuetify.breakpoint.mobile ? 'px-5' : 'px-16'">
      <h1 class="grey--text text-center">
        {{ pageName }} is coming
      </h1>
    </v-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pageName: 'Funding Search',
      basePath: `${process.env.baseUrl}${this.$route.fullPath}`
    }
  },
  head () {
    return this.$headUtil({
      lang: this.$lang.getISO,
      title: this.pageName,
      urlPath: this.basePath
    })
  },
  created () {
    this.$breadcrumbs.clear()
  }
}
</script>
