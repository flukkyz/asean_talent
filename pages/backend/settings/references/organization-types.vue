<template>
  <lists-name api="organization-types" model-name="Organization Type" />
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'admin']
}
</script>
