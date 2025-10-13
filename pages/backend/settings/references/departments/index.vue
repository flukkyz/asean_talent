<template>
  <lists-location
    api="departments"
    model-name="Funding Agency"
    model-detail="Funding Agency refers to the organization that provides research grants or other types of funding support for activities recorded in the database.
  Examples include A*STAR (Singapore) or PMU-B (Thailand).
  Please enter the name of the funding agency only, without specifying the country."
  />
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'admin']
}
</script>
