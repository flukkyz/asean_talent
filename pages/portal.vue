<template>
  <div class="">
    <client-only v-if="setting">
      <v-container class="">
        <v-app-bar
          color="transparent"
          :dark="['xs', 'sm'].includes($vuetify.breakpoint.name)"
          elevation="0"
          :height="['xs', 'sm'].includes($vuetify.breakpoint.name) ? '50px' : '90px'"
          flat
        >
          <v-app-bar-nav-icon v-if="['xs', 'sm'].includes($vuetify.breakpoint.name)" class="mr-2" @click.stop="toggleDrawer" />
          <NuxtLink :to="localePath({name: 'index'})">
            <v-toolbar-title>
              <div class="d-flex align-center ml-3">
                <img src="/images/logo.png" :height="['xl', 'lg'].includes($vuetify.breakpoint.name) ? '52' : '40'" contain alt="Logo">
                <p class="mb-0 ml-5" :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'white--text' : 'display-1 themeAccent--text'">
                  {{ appName }}
                </p>
              </div>
            </v-toolbar-title>
          </NuxtLink>
          <v-spacer />
          <div v-if="!['xs', 'sm'].includes($vuetify.breakpoint.name)" class="d-flex align-center">
            <img
              src="/images/atm.png"
              height="45"
              class="mr-8"
            >
          </div>
        </v-app-bar>
      </v-container>
      <v-divider />

      <div class="py-8">
        <v-container>
          <h3 class="text-center font-weight-bold mb-3">
            ASEAN Talent Pool: Opportunities for Researchers, Industries, and Governments
            Come and be a part of the ASEAN community.
          </h3>
          <p class="">
            The {{ appName }} Community is designed to be a community for resilient, inclusive, and sustainable professional talent in ASEAN to support economic growth. The ATM Community is facilitated by the ASEAN Expert Group on Talent Mobility (EGTM), endorsed by SCIRD. Talent mobility and talent capacity building are significant initiatives for ATM to promote brain circulation in ASEAN and to be a solution provider for the development of ASEAN. The ATM aims to facilitate the mobility of professional talent across the ASEAN region to support economic growth driven by science, technology, and innovation (STI). Join the {{ appName }} Community today and become part of a dynamic network of professional talent driving inclusive and sustainable growth through science, technology, and innovation across the ASEAN region.
          </p>
          <div v-if="listDatas">
            <div v-if="listDatas.totalItems > 0" class="py-8">
              <v-row>
                <v-col
                  v-for="item in listDatas.rows"
                  :key="item.id"
                  cols="12"
                  sm="12"
                  md="6"
                  lg="4"
                  xl="3"
                >
                  <cards-portal
                    :item="item"
                  />
                </v-col>
              </v-row>
            </div>
            <div v-else class="mt-16 text-center">
              <h1 class="display-3 teal--text">
                No Content
              </h1>
            </div>
          </div>
        </v-container>
      </div>
      <layouts-footer>
        <div class="d-flex align-center justify-space-between">
          <a href="https://www.mhesi.go.th" target="_blank">
            <img
              src="/images/agencies/mhesi.png"
              class="mr-8"
              :style="['xs'].includes($vuetify.breakpoint.name) ? 'height: 30px' : 'height: 52px'"
            >
          </a>
          <a href="https://nxpo.or.th/" target="_blank">
            <img
              src="/images/agencies/nxpo.png"
              class="mr-8"
              :style="['xs'].includes($vuetify.breakpoint.name) ? 'height: 30px' : 'height: 52px'"
            >
          </a>
          <a href="https://www.pmu-hr.or.th" target="_blank">
            <img
              src="/images/agencies/pmu.png"
              class="mr-8"
              :style="['xs'].includes($vuetify.breakpoint.name) ? 'height: 30px' : 'height: 52px'"
            >
          </a>
        </div>
      </layouts-footer>
    </client-only>
  </div>
</template>

<script>
export default {
  layout: 'blank',
  data () {
    return {
      pageName: 'Portal',
      basePath: `${process.env.baseUrl}${this.$route.fullPath}`,
      api: `${process.env.apiUrl}${process.env.apiDirectory}portals`,
      listDatas: null,
      appName: process.env.appName
    }
  },

  async fetch () {
    try {
      const datas = await this.$axios.$get(`${this.api}`)
      this.listDatas = datas
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
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
