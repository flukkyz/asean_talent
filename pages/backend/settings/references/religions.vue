<template>
  <lists-name
    api="religions"
    model-name="Religion"
    model-detail="Religion refers to the religious affiliation of the talent or young talent recorded in the database, such as Buddhism, Christianity, or Islam."
  />
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'admin']
}
</script>
