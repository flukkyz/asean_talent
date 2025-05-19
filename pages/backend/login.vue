<template>
  <div class="backend-login d-flex align-center justify-center primary">
    <v-card
      elevation="0"
      class="mx-5 "
      width="400"
    >
      <v-card-text class="pa-8">
        <forms-login-back @login="login" />
        <nuxt-link :to="localePath({name: 'backend-forgot-password'})">
          <p class="text-right grey--text mt-2 mb-0">
            {{ $t('FORGOT_PASSWORD') }}
          </p>
        </nuxt-link>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  layout: 'blank',
  middleware: 'guest-admin',
  data () {
    return {
      pageName: 'BACKEND Login'
    }
  },
  head () {
    return {
      title: 'BACKEND Login'
    }
  },
  methods: {
    async login (data) {
      try {
        await this.$auth.loginWith('admin', { data })
        if (!this.$nuxt.context.from) {
          this.$router.push(this.localePath({ name: 'backend' }))
        } else {
          this.$router.back()
        }
      } catch (err) {
        this.$bus.$emit('incorrect-login')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.backend-login{
  height: 100%;
}
</style>
