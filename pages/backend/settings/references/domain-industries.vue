<template>
  <lists-name api="domain-industries" model-name="Domain Industry" disabled-delete />
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'admin']
}
</script>
