<template>
  <uploads-name api="index-standards" model-name="Index By" />
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'admin']
}
</script>
