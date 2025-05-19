<template>
  <div />
</template>

<script>
export default {
  layout: 'member',
  middleware: ['authen', 'frontend'],
  created () {
    this.$breadcrumbs.clear()
    this.$router.push(this.localePath({ name: 'my-profile-dashboard' }))
  }
}
</script>
