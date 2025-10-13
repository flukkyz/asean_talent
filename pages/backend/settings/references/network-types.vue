<template>
  <lists-name
    api="network-types"
    model-name="Network Type"
    model-detail="Network Type refers to the category of network you define, representing a group or connection you wish to link to platforms related to your own.
  You can create and name this group freely based on your existing network.
  Examples: Startup, Research Community."
  />
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'admin']
}
</script>
