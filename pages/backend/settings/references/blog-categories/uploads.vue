<template>
  <uploads-name api="blog-categories" model-name="Blog Category" />
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'admin']
}
</script>
