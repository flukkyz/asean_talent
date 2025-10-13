<template>
  <uploads-location api="departments" model-name="Funding Agency" />
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'admin']
}
</script>
