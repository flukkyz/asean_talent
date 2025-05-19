<template>
  <lists-name api="index-standards" model-name="Index By" upload />
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'admin']
}
</script>
