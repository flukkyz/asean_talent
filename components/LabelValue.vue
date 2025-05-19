<template>
  <div class="d-flex align-baseline">
    <div class="mr-2 flex-shrink-0" style="min-width: 200px; max-width: 300px;">
      <p class="subtitle-1 mb-0 font-weight-bold" :class="color ? `${color}--text` : ''">
        {{ label }}
      </p>
    </div>
    <div class="flex-grow-1">
      <slot>
        <p class="subtitle-1 mb-0" :class="color ? `${color}--text` : ''">
          <span v-if="value">
            {{ value }}
          </span>
          <span v-else class="caption red--text">
            {{ noDataText }}
          </span>
        </p>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      require: true,
      default: null
    },
    color: {
      type: String,
      require: true,
      default: null
    },
    value: {
      type: [String, Number],
      require: true,
      default: null
    },
    noDataText: {
      type: String,
      require: true,
      default: 'No Data'
    }
  }
}
</script>
