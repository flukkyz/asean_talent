<template>
  <div>
    <v-form ref="form" @submit.prevent="login">
      <v-text-field
        v-model="form.username"

        label="E-mail"
        outlined
        required
        autofocus
        dense
        @input="onInput"
      />
      <v-text-field
        v-model="form.password"
        label="Password"
        type="password"

        outlined
        required
        dense
        @input="onInput"
      />
      <p v-if="incorrect" class="red--text text-center font-weight-bold">
        {{ $t('INCORRECT', {text: ' E-mail ' + $t('OR') + ' Password '}) }}
      </p>
      <v-btn
        color="primary"
        outlined
        x-large
        elevation="0"
        block
        type="submit"
        :disabled="logingIn"
        :loading="logingIn"
      >
        Login
      </v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      logingIn: false,
      incorrect: false,
      notVerify: false,
      form: {
        username: '',
        password: ''
      }
    }
  },
  created () {
    this.$bus.$on('incorrect-login', () => {
      this.form.password = ''
      this.incorrect = true
      this.logingIn = false
    })
  },
  beforeDestroy () {
    this.$bus.$off('incorrect-login')
  },
  methods: {
    onInput () {
      this.incorrect = false
      this.notVerify = false
    },
    login () {
      this.form.username = this.form.username.toLowerCase().trim()
      this.form.password = this.form.password.trim()
      this.logingIn = true
      this.$emit('login', this.form)
    }
  }
}
</script>
