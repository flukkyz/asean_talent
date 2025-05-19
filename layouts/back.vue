<template>
  <v-app>
    <client-only>
      <layouts-sidebar-back />
      <v-main class="bgLight">
        <breadcrumbs />
        <v-container class="pa-12 my-0 " fluid>
          <nuxt />
        </v-container>
      </v-main>
      <snackbar />
      <overlay />
      <b-t-t />
    </client-only>
  </v-app>
</template>

<script>
export default {
  name: 'Back'
}
</script>
