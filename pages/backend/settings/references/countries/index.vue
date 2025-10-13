<template>
  <lists-location
    api="countries"
    model-name="Country"
    model-detail="Refers to the nation of citizenship, residence, or activity of the talent. It identifies the country associated with personal or organizational data for demographic and reporting purposes. Examples include Thailand, Singapore, and Japan."
  />
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'admin']
}
</script>
