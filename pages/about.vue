<template>
  <div class="">
    <client-only v-if="setting">
      <div class="hero-image" :style="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'height: 270px;' : 'height: 240px;'">
        <v-container :class="['d-flex align-center h-100',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : 'justify-space-between px-16']">
          <h1 :class="['font-weight-bold themeAccent--text',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'headline my-6' : 'display-1']">
            ABOUT
          </h1>
          <img src="/images/graphics/2.png" :height="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 152 : 196">
        </v-container>
      </div>

      <div class="py-16">
        <v-container>
          <client-only v-if="setting && setting.about_page" placeholder="Loading...">
            <div class="ck-content" v-html="setting.about_page" />
          </client-only>
          <div v-else>
            <h1 class="grey--text text-center">
              {{ pageName }} is coming
            </h1>
          </div>
        </v-container>
      </div>
    </client-only>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pageName: 'About',
      basePath: `${process.env.baseUrl}${this.$route.fullPath}`
    }
  },
  head () {
    return this.$headUtil({
      lang: this.$lang.getISO,
      title: this.pageName,
      urlPath: this.basePath
    })
  },
  computed: {
    setting () {
      return this.$store.state.setting
    }
  },
  created () {
    this.$breadcrumbs.clear()
  }
}
</script>

<style lang="scss" scoped>
.hero-image {
  background-image: url("/images/ui/bg-top.png");
  background-color: #cccccc;
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
