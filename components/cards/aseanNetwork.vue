<template>
  <v-card class="rounded-lg overflow-hidden" outlined style="border-width: 2px;">
    <v-card-text class="pa-0" style="height: 300px;">
      <div class="d-flex flex-column justify-space-between pt-2 pl-2 pb-2 h-100">
        <div class="">
          <div class="pointer flex-grow-1 mt-2 mx-2" @click="$emit('show', item.id)">
            <div v-resize-text="{ratio:1.8, minFontSize: '18px', maxFontSize: '24px'}" class="w-100 font-weight-bold themeAccent--text mb-0">
              {{ item.name }}
            </div>
          </div>
          <div class="overflow-hidden mt-1 mb-0 mx-2" style="height: 200px;">
            <p class="grey--text text--darken-2 caption">
              {{ item.description }}
            </p>
          </div>
        </div>
        <div class="mx-3 d-flex justify-end alien-center">
          <div class="">
            <a v-if="item.url" :href="item.url" target="_blank">
              Go to site...
            </a>
          </div>
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
