<template>
  <div />
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'country_admin'],
  created () {
    this.$breadcrumbs.clear()
    if (this.$auth.user.role === 'country_admin') {
      this.$router.push(this.localePath({ name: 'backend-manages-talents' }))
    } else {
      this.$router.push(this.localePath({ name: 'backend-settings-setting' }))
    }
  }
}
</script>
