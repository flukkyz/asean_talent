<template>
  <v-card class="rounded-lg overflow-hidden" outlined style="border-width: 2px;">
    <v-card-text class="pa-0">
      <div class="d-flex justify-space-between mt-2 mr-n1">
        <div class="w-100 mt-2 ml-4 pointer" @click="$emit('show', item.id)">
          <div v-resize-text="{ratio:1.8, minFontSize: '18px', maxFontSize: '24px'}" class="w-100 font-weight-bold themeAccent--text mb-0">
            {{ item.lastname }},
            {{ item.firstname }}
          </div>
          <p class="grey--text text--darken-2 body-1 mb-0">
            {{ item.country }}
          </p>
        </div>
        <img src="/images/talent-right.png" height="81">
      </div>
    </v-card-text>
    <v-card-text class="d-flex justify-space-between align-end">
      <div class="d-flex">
        <a v-if="item.scopus" :href="`${apiPath}${apiPool}/talent/scopus/${item.id}`" target="_blank">
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-avatar
                v-bind="attrs"
                color="#FE8300"
                size="33"
                class="white--text mr-3"
                v-on="on"
              >
                SC
              </v-avatar>
            </template>
            <span>Scopus</span>
          </v-tooltip>
        </a>
        <a v-if="item.research_gate" :href="`${apiPath}${apiPool}/talent/research_gate/${item.id}`" target="_blank">
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <img
                src="/images/rg.png"
                height="33"
                v-bind="attrs"
                class="mr-3"
                v-on="on"
              >
            </template>
            <span>Research Gate</span>
          </v-tooltip>
        </a>
        <a v-if="item.linkedin" :href="`${apiPath}${apiPool}/talent/linkedin/${item.id}`" target="_blank">
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-avatar
                color="#0A66C2"
                v-bind="attrs"
                size="33"
                class="white--text font-weight-bold mr-3"
                v-on="on"
              >
                in
              </v-avatar>
            </template>
            <span>Linkedin</span>
          </v-tooltip>
        </a>
        <a v-if="item.link_tnrr" :href="`${apiPath}${apiPool}/talent/link_tnrr/${item.id}`" target="_blank">
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <img
                src="/images/tnrr.png"
                height="33"
                v-bind="attrs"
                class="mr-3"
                v-on="on"
              >
            </template>
            <span>TNRR</span>
          </v-tooltip>
        </a>
      </div>
      <!-- <div class="d-flex flex-column align-center">
        <p class="display-1 mb-0 primary--text font-weight-bold">
          {{ item.h_index }}
        </p>
        <p class="mb-n1 primary--text">
          H-index
        </p>
      </div> -->
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
  },
  data () {
    return {
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      apiPool: 'pools'
    }
  }
}
</script>
