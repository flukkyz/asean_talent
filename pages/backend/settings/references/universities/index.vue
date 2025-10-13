<template>
  <lists-location
    api="universities"
    model-name="University"
    model-detail="University refers to the name of the educational institution associated with the talent, young talent, training course, or lab location.
  Please enter the full name of the university without specifying internal departments or units, and do not use abbreviations.
  In cases where the university has campuses or branches located separately from the main campus or head office, you may include the campus or branch name as officially recognized by the university’s standard naming convention."
  />
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'admin']
}
</script>
