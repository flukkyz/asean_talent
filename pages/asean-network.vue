<template>
  <div v-if="listDatas" class="">
    <client-only>
      <div class="hero-image" :style="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'height: 270px;' : 'height: 240px;'">
        <v-container :class="['d-flex align-center h-100',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : 'justify-space-between px-16']">
          <h1 :class="['font-weight-bold themeAccent--text',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'headline my-6' : 'display-1']">
            {{ pageName }}
          </h1>
          <img src="/images/asean_network.png" :height="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 152 : 196">
        </v-container>
      </div>

      <div class="py-8">
        <v-container>
          <div class="d-flex justify-space-between align-center mb-8">
            <div class="d-flex align-center">
              <h2 class="font-weight-bold themeAccent--text mb-0 mr-2">
                Search
              </h2>
              <div class="flex-grow-0 mr-2" style="width: 300px">
                <v-text-field
                  v-model="queryParams.q"
                  append-icon="mdi-magnify"
                  label="Search Network"
                  outlined
                  class="rounded-lg"
                  dense
                  hide-details
                  @input="onSearch"
                />
              </div>
              <v-autocomplete
                v-model="queryParams.networkType"
                :items="networkTypes"
                clearable
                item-text="name"
                item-value="id"
                outlined
                class="rounded-lg flex-grow-0 mr-2"
                persistent-hint
                label="Network Type"
                hide-details
                dense
                @change="onSearch"
              />
            </div>
            <h2 class="font-weight-bold themeAccent--text mb-0 mr-2">
              {{ listDatas.totalItems }}
              {{ listDatas.totalItems > 1 ? 'Networks' : 'Network' }}
            </h2>
          </div>
          <template v-for="networkType in networkTypes">
            <div v-if="listDatas.rows.filter(item => item.network_type_id === networkType.id).length > 0" :key="networkType.id" class="d-flex flex-column">
              <h1 class="font-weight-bold themeAccent--text mb-3">
                {{ networkType.name }}
              </h1>
              <v-row class="mb-6">
                <v-col
                  v-for="item in listDatas.rows.filter(item => item.network_type_id === networkType.id)"
                  :key="item.id"
                  cols="12"
                  sm="12"
                  md="6"
                  lg="4"
                  xl="3"
                >
                  <cards-asean-network
                    :item="item"
                  />
                </v-col>
              </v-row>
            </div>
          </template>
        </v-container>
      </div>
    </client-only>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pageName: 'ASEAN Network',
      basePath: `${process.env.baseUrl}${this.$route.fullPath}`,
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      api: `${process.env.apiUrl}${process.env.apiDirectory}asean-networks`,
      listDatas: null,
      networkTypes: null,
      queryParams: {
        size: 20,
        q: '',
        page: 1,
        networkType: ''
      }
    }
  },
  async fetch () {
    this.queryParams = {
      ...this.queryParams,
      ...this.$route.query
    }
    if (!this.queryParams.networkType) {
      this.queryParams.networkType = ''
    }
    const searchParams = new URLSearchParams(this.queryParams).toString()
    try {
      const datas = await this.$axios.$get(`${this.api}${(searchParams ? '?' + searchParams : '')}`)
      this.listDatas = datas
      if (this.queryParams.page > this.listDatas.totalPages && this.listDatas.totalPages > 0) {
        this.queryParams.page = this.listDatas.totalPages
        this.$fetch()
      }
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
    this.$breadcrumbs.clear()
  },
  head () {
    return this.$headUtil({
      lang: this.$lang.getISO,
      title: this.pageName,
      urlPath: this.basePath
    })
  },
  beforeMount () {
    if (!this.$store.state.setting.show_menu_asean_network) {
      this.$nuxt.error({ statusCode: 404, message: 'Not Found This Page' })
    }
  },
  async mounted () {
    try {
      await Promise.all([
        this.$axios.$get(`${this.apiPath}network-types-asean-networks`)
      ]).then((values) => {
        this.networkTypes = values[0]
      })
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
  },
  created () {
    this.$breadcrumbs.clear()
  },
  methods: {
    onSearch () {
      this.queryParams.page = 1
      this.$fetch()
    }
  }
}
</script>

<style lang="scss" scoped>
.hero-image {
  background-image: url("/images/bg-top.png");
  background-color: #cccccc;
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
