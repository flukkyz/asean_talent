<template>
  <v-app>
    <client-only>
      <layouts-sidebar-member />
      <v-main>
        <breadcrumbs />
        <nuxt />
      </v-main>
      <snackbar />
      <overlay />
      <b-t-t v-if="!$vuetify.breakpoint.mobile" />
    </client-only>
  </v-app>
</template>

<script>
export default {
  name: 'Back'
}
</script>
