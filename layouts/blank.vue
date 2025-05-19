<template>
  <v-app dark>
    <client-only>
      <nuxt />
      <snackbar />
      <overlay />
      <b-t-t />
    </client-only>
  </v-app>
</template>

<script>
export default {
  name: 'BlankLayout'
}
</script>
