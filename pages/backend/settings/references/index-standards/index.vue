<template>
  <lists-name
    api="index-standards"
    model-name="Indexed By"
    model-detail="Indicates the databases or organizations that have indexed or referenced this article. Examples include international indexing databases such as Scopus, Web of Science, PubMed, IEEE Xplore, Google Scholar, and other globally recognized citation indexes."
    upload
  />
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'admin']
}
</script>
