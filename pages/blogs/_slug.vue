<template>
  <div>
    <v-container v-if="blog" class="py-16">
      <v-row justify="center">
        <v-col cols="12" lg="10">
          <h2 class="display-1 mb-0 mt-2 text-center themeAccent--text">
            {{ blog.title }}
          </h2>
          <div v-if="blog.tags" class="d-flex justify-center flex-wrap mt-1">
            <v-icon color="themeAccent" left>
              fas fa-tags
            </v-icon>
            <v-chip
              v-for="(val, index) in blog.tags.split('; ')"
              :key="`tags-${index}`"
              small
              class="ma-1"
              dark
              color="themeAccent"
              :to="localePath({ name: 'blogs', query: { q: val }})"
            >
              {{ val }}
            </v-chip>
          </div>
          <div class="text-center my-5">
            <img
              v-if="blog.Img"
              :src="blog.Img.url"
              :alt="blog.title"
              class="text-center"
              style="max-height: 300px; width: auto;"
            >
          </div>
          <div class="px-5 px-md-0">
            <div class="ck-content" v-html="blog.content" />
          </div>
          <div class="d-flex flex-wrap align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon x-small left>
                fas fa-calendar-plus
              </v-icon>
              <p class="teal--text caption px-5 px-md-0 mb-0">
                {{ $dateText(blog.createdAt,'medium','short') }}
              </p>
            </div>
            <social-share
              :path="$route.fullPath"
              :title="blog.title"
              :content="blog.content"
              :tag="blog.tags ? blog.tags.split('; ').join(',') : ''"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      baseUrl: process.env.baseUrl,
      basePath: `${process.env.baseUrl}${this.$route.fullPath}`,
      api: `${process.env.apiUrl}${process.env.apiDirectory}blogs`,
      blog: null
    }
  },
  async fetch () {
    try {
      const data = await this.$axios.$get(`${this.api}/${this.$route.params.slug}`)
      this.blog = await data
      this.$breadcrumbs.setItems([
        {
          to: { name: 'blogs' },
          text: this.$t('NEWS_AND_ACTIVITIES')
        },
        {
          text: this.blog.slug
        }
      ])
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
  },
  head () {
    return this.$headUtil({
      lang: this.$lang.getISO,
      title: this.blog ? this.blog.title : '',
      description: this.blog ? this.blog.content : '',
      image: this.blog && this.blog.Img ? `${this.baseUrl}${this.blog.Img.url}` : null,
      urlPath: this.basePath
    })
  }
}
</script>
