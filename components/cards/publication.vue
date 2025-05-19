<template>
  <v-card class="rounded-lg overflow-hidden" outlined style="border-width: 2px;">
    <v-card-text class="pa-0" style="height: 230px;">
      <div class="d-flex flex-column justify-space-between pt-2 pl-2 pb-2 h-100">
        <div class="d-flex justify-space-between align-start">
          <div class="pointer flex-grow-1 mt-2 ml-2" @click="$emit('show', item.id)">
            <div v-resize-text="{ratio:1.8, minFontSize: '18px', maxFontSize: '24px'}" class="w-100 font-weight-bold themeAccent--text mb-0">
              {{ item.name }}
            </div>

            <p class="grey--text text--darken-2 mt-1 mb-0">
              {{ item.department }}
            </p>
            <p class="grey--text text--darken-2 mb-0">
              {{ item.country }}
            </p>
            <p class="grey--text text--darken-2 mb-0">
              <span class="font-weight-bold">
                Publisher
              </span>
              {{ item.publisher }}
            </p>
            <p class="grey--text text--darken-2 mb-0">
              <span class="font-weight-bold">
                Journal
              </span>
              {{ item.journal }}
            </p>
            <p class="caption mb-0 text-truncate">
              Deadline:
              {{ $dateText(item.deadline_date,'medium','short') }}
            </p>
          </div>
          <p class="mb-0 pr-3 primary--text text-right">
            <span class="font-weight-bold title">
              {{ $currencyText(item.budget) }}
            </span>
            <span v-if="item.currency">
              {{ item.currency }}
            </span>
          </p>
        </div>
        <div class="mb-2 mx-2 d-flex justify-space-between alien-center">
          <div class="">
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
          <social-share
            :path="localePath({ name: 'funding-organization', query: { id: item.id }})"
            :title="item.name"
            :content="item.description"
          />
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
