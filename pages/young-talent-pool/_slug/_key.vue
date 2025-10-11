<template>
  <div v-if="listDatas" class="">
    <div class="hero-image" :style="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'height: 270px;' : 'height: 240px;'">
      <v-container :class="['d-flex align-center h-100',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : 'justify-space-between px-16']">
        <div :class="[['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'text-center' : '']">
          <v-chip label text-color="themeAccent" class="hero-chip font-weight-bold px-5 py-0" :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'mt-6 mb-3' : 'mb-5'">
            {{ listDatas.industry }}
          </v-chip>
          <h1 :class="['font-weight-bold themeAccent--text',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'headline mb-5' : 'display-1']">
            {{ listDatas.keyword }}
          </h1>
        </div>
        <img :src="`/images/industries/icons/${listDatas.industry}-img.png`" :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'mb-6' : ''" :height="['xs', 'sm'].includes($vuetify.breakpoint.name) ? '50%' : '80%'">
      </v-container>
    </div>

    <v-container class="py-16" :class="{ 'px-16': ['sm', 'xs'].includes($vuetify.breakpoint.name)}">
      <div :class="['d-flex',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : 'align-baseline justify-space-between mb-2']">
        <div :class="['d-flex align-center',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column mb-8' : '']">
          <p class="title mb-0 themeAccent--text font-weight-bold mr-3 my-1">
            Search
          </p>
          <div :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'mr-3'" :style="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'width: 100%;' : 'width: 380px;'">
            <v-text-field
              v-model="filters.search"
              append-icon="mdi-magnify"
              placeholder="Search Talents"
              class="my-1 rounded-lg"
              outlined
              dense
              hide-details
              @input="setListFilters"
            />
          </div>
          <div :style="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'width: 100%;' : ''">
            <v-autocomplete
              v-model="filters.countries"
              :items="countries"
              placeholder="Country"
              clearable
              class="my-1 rounded-lg"
              outlined
              multiple
              hide-details
              dense
              @change="setListFilters"
            />
          </div>
        </div>
        <p class="title mb-0 text-right themeAccent--text font-weight-bold ml-3">
          {{ ((filters.page-1)*filters.size)+1 }}
          -
          {{ ((filters.page-1)*filters.size)+listPages.length }}
          of
          {{ listDatas.rows.length }}
          {{ listDatas.rows.length > 1 ? 'Talents' : 'Talent' }}
        </p>
      </div>
      <v-row>
        <v-col
          v-for="item in listPages"
          :key="`talent-${item.id}-${item.row}`"
          cols="12"
          sm="12"
          md="6"
          lg="4"
          xl="3"
        >
          <v-card class="rounded-lg overflow-hidden" outlined style="border-width: 2px;">
            <v-card-text class="pa-0">
              <div class="d-flex justify-space-between mt-2 mr-n1">
                <div class="w-100 mt-2 ml-4">
                  <div v-resize-text="{ratio:1.8, minFontSize: '18px', maxFontSize: '24px'}" class="w-100 font-weight-bold themeAccent--text mb-0">
                    {{ item.lastname }},
                    {{ item.firstname }}
                  </div>
                  <p class="grey--text text--darken-2 body-1 mb-0">
                    {{ item.country }}
                  </p>
                </div>
                <img src="/images/ui/talent-right.png" height="81">
              </div>
            </v-card-text>
            <v-card-text class="d-flex justify-space-between align-end">
              <div class="d-flex">
                <a v-if="item.scopus" :href="`${api}/talent/scopus/${item.id}`" target="_blank">
                  <v-tooltip top>
                    <template #activator="{ on, attrs }">
                      <v-avatar
                        v-bind="attrs"
                        color="#FE8300"
                        size="33"
                        class="white--text mr-3"
                        v-on="on"
                      >
                        SC
                      </v-avatar>
                    </template>
                    <span>Scopus</span>
                  </v-tooltip>
                </a>
                <a v-if="item.research_gate" :href="`${api}/talent/research_gate/${item.id}`" target="_blank">
                  <v-tooltip top>
                    <template #activator="{ on, attrs }">
                      <img
                        src="/images/ui/rg.png"
                        height="33"
                        v-bind="attrs"
                        class="mr-3"
                        v-on="on"
                      >
                    </template>
                    <span>Research Gate</span>
                  </v-tooltip>
                </a>
                <a v-if="item.linkedin" :href="`${api}/talent/linkedin/${item.id}`" target="_blank">
                  <v-tooltip top>
                    <template #activator="{ on, attrs }">
                      <v-avatar
                        color="#0A66C2"
                        v-bind="attrs"
                        size="33"
                        class="white--text font-weight-bold mr-3"
                        v-on="on"
                      >
                        in
                      </v-avatar>
                    </template>
                    <span>Linkedin</span>
                  </v-tooltip>
                </a>
                <a v-if="item.link_tnrr" :href="`${api}/talent/link_tnrr/${item.id}`" target="_blank">
                  <v-tooltip top>
                    <template #activator="{ on, attrs }">
                      <img
                        src="/images/ui/tnrr.png"
                        height="33"
                        v-bind="attrs"
                        class="mr-3"
                        v-on="on"
                      >
                    </template>
                    <span>TNRR</span>
                  </v-tooltip>
                </a>
              </div>
              <!-- <div class="d-flex flex-column align-center">
                <p class="display-1 mb-0 primary--text font-weight-bold">
                  {{ item.h_index }}
                </p>
                <p class="mb-n1 primary--text">
                  H-index
                </p>
              </div> -->
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <div v-if="listFilters.length > 0" class="text-center my-16">
        <v-pagination
          v-if="Math.ceil(listFilters.length / filters.size) > 1"
          v-model="filters.page"
          :length="Math.ceil(listFilters.length / filters.size)"
          :total-visible="7"
          circle
          outlined
        />
      </div>
      <div v-else class="py-16">
        <h1 class="text-center grey--text my-16">
          Not Found Talent
        </h1>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      basePath: `${process.env.baseUrl}${this.$route.fullPath}`,
      api: `${process.env.apiUrl}${process.env.apiDirectory}pools`,
      listDatas: null,
      listFilters: [],
      filters: {
        page: 1,
        size: 24,
        search: '',
        countries: []
      },
      countries: []
    }
  },
  async fetch () {
    this.$overlay.showLoading()
    try {
      const datas = await this.$axios.$get(`${this.api}/${this.$route.params.slug}/${this.$route.params.key}?group=young_talent`)
      this.listDatas = datas
      this.countries = this.$_.uniq(this.listDatas.rows.map(ele => ele.country))
      this.$breadcrumbs.setItems([
        {
          text: 'Young Talent Pool',
          to: { name: 'young-talent-pool' }
        },
        {
          text: this.listDatas.industry,
          to: { name: 'young-talent-pool-slug', params: { slug: this.listDatas.industry } }
        },
        {
          text: this.listDatas.keyword
        }
      ])
      await this.setListFilters()
      this.$overlay.hide()
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
  },
  head () {
    return this.$headUtil({
      lang: this.$lang.getISO,
      title: 'Young Talent Pool',
      urlPath: this.basePath
    })
  },
  computed: {
    listPages () {
      return this.listFilters.slice((this.filters.page - 1) * this.filters.size, this.filters.page * this.filters.size)
    }
  },
  beforeMount () {
    if (!this.$store.state.setting.show_menu_young_talent) {
      this.$nuxt.error({ statusCode: 404, message: 'Not Found This Page' })
    }
  },
  methods: {
    setListFilters () {
      this.filters.page = 1
      let listFilters = this.$_.orderBy(this.listDatas.rows, ['h_index', 'country'], ['desc', 'asc'])
      if (this.filters.search) {
        const search = this.filters.search
        listFilters = listFilters.filter((item) => {
          return [
            this.$findSome(search, item.firstname),
            this.$findSome(search, item.lastname)
          ].some(ele => ele)
        })
      }
      if (this.filters.countries.length > 0) {
        listFilters = listFilters.filter((item) => {
          return this.filters.countries.includes(item.country)
        })
      }
      this.listFilters = listFilters
    }
  }
}
</script>

<style lang="scss" scoped>
.bottom-gradient {
    background-image: linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 160px);
  }
</style>

<style lang="scss" scoped>
.hero-image {
  background-image: url("/images/ui/bg-top.png");
  background-color: #cccccc;
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
}
.hero-chip{
  border: solid;
  border-width: 2px;
  border-color: #000063 !important;
  background-color: #FFFFFF !important;
  font-size: 16px;
}
</style>
