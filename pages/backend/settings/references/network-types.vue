<template>
  <lists-name api="network-types" model-name="Network Type" />
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'admin']
}
</script>
