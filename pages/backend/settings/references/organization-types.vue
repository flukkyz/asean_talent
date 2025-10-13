<template>
  <lists-name
    api="organization-types"
    model-name="Organization Type"
    model-detail="Organization type refers to the category of the organizations of talents, young talents, and related resources included in this database. Please select your organization type based on its main activity or industry, following the International Standard Industrial Classification (ISIC). Examples: Education, Manufacturing, Health and Social Work, Public Administration."
  />
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'admin']
}
</script>
