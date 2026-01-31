<template>
  <lists-name
    api="blog-categories"
    model-name="Blog Category"
    model-detail="Blog Categories Management Page"
    upload
  />
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'admin']
}
</script>
