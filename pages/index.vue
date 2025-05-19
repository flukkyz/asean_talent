<template>
  <div />
</template>

<script>
export default {
  head () {
    return this.$headUtil({
      lang: this.$lang.getISO,
      title: this.$t('HOME'),
      urlPath: this.basePath
    })
  },
  created () {
    this.$breadcrumbs.clear()
    this.$router.push(this.localePath({ name: 'home' }))
  }
}
</script>
