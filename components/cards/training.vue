<template>
  <v-card class="rounded-lg overflow-hidden" outlined style="border-width: 2px;">
    <v-card-text class="pa-0" style="height: 180px;">
      <div class="d-flex flex-column justify-space-between pt-2 pl-2 pb-2 h-100">
        <div class="d-flex justify-space-between align-start">
          <div class="pointer flex-grow-1 mt-2 ml-2" @click="$emit('show', item.id)">
            <div v-resize-text="{ratio:1.8, minFontSize: '18px', maxFontSize: '24px'}" class="w-100 font-weight-bold themeAccent--text mb-0">
              {{ item.name }}
            </div>
            <div class="d-flex mt-2 align-center">
              <v-chip class="mr-2 py-6" small label>
                {{ trainingFormats[item.format] }}
              </v-chip>
              <div class="">
                <p class="grey--text text--darken-2 body-1  mb-0">
                  {{ item.instructor_name }}
                </p>
                <p class="caption mb-0">
                  {{ $dateText(item.start_date,'medium','short') }}
                </p>
              </div>
            </div>
          </div>
          <p class="mb-0 pr-3 primary--text">
            <span class="font-weight-bold title">
              {{ $currencyText(item.cost) }}
            </span>
            {{ item.currency }}
          </p>
        </div>
        <div class="mb-2 ml-2">
          <p class="mb-0">
            {{ item.university }}
          </p>
          <p class="mb-0 grey--text">
            {{ item.country }}
          </p>
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
  },
  computed: {
    trainingFormats () {
      return this.$store.state.enums.trainingFormats
    }
  }
}
</script>
