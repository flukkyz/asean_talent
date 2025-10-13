<template>
  <lists-location
    api="cities"
    model-name="City"
    model-detail="Refers to the administrative area or municipality where a talent resides, studies, or works. It helps identify the local region within a province for demographic, reporting, and regional program purposes. Examples include Chiang Mai, Bangkok, and Khon Kaen."
  />
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'admin']
}
</script>
