<template>
  <div class="">
    <v-footer class="px-10 py-12 white--text" color="themeAccent">
      <v-container class="">
        <div class="d-flex justify-space-between flex-wrap align-center w-100">
          <div class="mr-8">
            <p class="font-weight-bold">
              {{ setting.website_name }}
            </p>
            <p class="">
              {{ setting.contact_name }}
            </p>
            <p class="">
              {{ setting.contact_office }}
              <br>
              {{ setting.contact_address }}
            </p>
          </div>
          <div class="d-flex flex-wrap align-baseline mb-5">
            <div class="d-flex align-baseline mr-5">
              <a :href="`tel:${setting.contact_tel}`" target="_blank">
                <v-icon color="white">
                  mdi-phone
                </v-icon>
              </a>
              <a :href="`tel:${setting.contact_tel}`" target="_blank">
                <p class=" ml-2 mb-0 font-weight-bold white--text">
                  {{ setting.contact_tel }}
                </p>
              </a>
            </div>
            <div class="d-flex align-baseline mr-5">
              <a :href="`mailto:${setting.contact_email}`" target="_blank">
                <v-icon color="white">
                  mdi-email
                </v-icon>
              </a>
              <a :href="`mailto:${setting.contact_email}`" target="_blank">
                <p class="ml-2 mb-0  font-weight-bold white--text">
                  {{ setting.contact_email }}
                </p>
              </a>
            </div>
            <div v-if="setting && setting.facebook_page_url" class="d-flex align-baseline mr-5">
              <a :href="setting.facebook_page_url" target="_blank">
                <v-icon color="white">
                  mdi-facebook
                </v-icon>
              </a>
              <a :href="setting.facebook_page_url" target="_blank">
                <p class="ml-2 mb-0  font-weight-bold white--text">
                  {{ setting.facebook_page_url }}
                </p>
              </a>
            </div>
          </div>
          <slot />
        </div>
        <p class="mb-0 mt-5">
          © {{ new Date().getFullYear() }}  ASEAN Talent. All Rights Reserved.
        </p>
      </v-container>
    </v-footer>
  </div>
</template>

<script>
export default {
  computed: {
    setting () {
      return this.$store.state.setting
    }
  }
}
</script>
