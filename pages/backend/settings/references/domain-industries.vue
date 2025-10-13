<template>
  <lists-name
    api="domain-industries"
    model-name="Domain Industry"
    disabled-delete model-detail="Refers to the specific sector or category of economic activity that a business or organization operates within. It helps classify the nature of the business for analysis, reporting, and regulatory purposes. Examples include BCG, Earth and Space, and AI."
  />
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'admin']
}
</script>
