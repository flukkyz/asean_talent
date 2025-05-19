<template>
  <lists-name api="domain-industries" model-name="Domain Industry" />
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'secret']
}
</script>
