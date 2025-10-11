<template>
  <v-card class="rounded-lg overflow-hidden" outlined style="border-width: 2px;">
    <v-card-text class="pa-0" style="height: 250px;">
      <div class="d-flex flex-column justify-space-between pt-2 pl-2 pb-2 h-100">
        <div class="d-flex justify-space-between">
          <div class="pointer flex-grow-1 mt-2 ml-2" @click="$emit('show', item.id)">
            <div v-resize-text="{ratio:1.8, minFontSize: '18px', maxFontSize: '24px'}" class="w-100 font-weight-bold themeAccent--text mb-0">
              {{ item.name }}
            </div>
            <p class="grey--text text--darken-2 body-1 mt-2 mb-0">
              {{ item.country }}
            </p>
          </div>
          <img src="/images/ui/lab-right.png" class="flex-shrink-0" height="81">
        </div>
        <div class="d-flex mb-2 ml-2">
          <a v-if="item.lab_link" :href="item.lab_link" target="_blank">
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-avatar
                  v-bind="attrs"
                  color="#2385FF"
                  size="33"
                  dark
                  class="mr-3"
                  v-on="on"
                >
                  <v-icon size="22" color="white">mdi-link-variant</v-icon>
                </v-avatar>
              </template>
              <span>Lab Link</span>
            </v-tooltip>
          </a>
          <a v-if="item.email" :href="`mailto:${item.email}`" target="_blank">
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-avatar
                  v-bind="attrs"
                  color="#FF4545"
                  size="33"
                  dark
                  class="mr-3"
                  v-on="on"
                >
                  <v-icon size="22" color="white">mdi-email</v-icon>
                </v-avatar>
              </template>
              <span>E-mail</span>
            </v-tooltip>
          </a>
          <a v-if="item.phone" :href="`telto:${item.phone}`" target="_blank">
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-avatar
                  v-bind="attrs"
                  color="#9883FD"
                  size="33"
                  dark
                  class="mr-3"
                  v-on="on"
                >
                  <v-icon size="22" color="white">mdi-phone</v-icon>
                </v-avatar>
              </template>
              <span>Phone number</span>
            </v-tooltip>
          </a>
          <a v-if="item.website" :href="item.website" target="_blank">
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-avatar
                  v-bind="attrs"
                  color="#FE8303"
                  size="33"
                  dark
                  class="mr-3"
                  v-on="on"
                >
                  <v-icon size="22" color="white">mdi-web</v-icon>
                </v-avatar>
              </template>
              <span>Website</span>
            </v-tooltip>
          </a>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: null
    }
  }
}
</script>
