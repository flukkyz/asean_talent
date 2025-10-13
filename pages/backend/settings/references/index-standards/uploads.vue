<template>
  <uploads-name api="index-standards" model-name="Indexed By" />
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'admin']
}
</script>
