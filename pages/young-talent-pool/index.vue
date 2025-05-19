<template>
  <div class="">
    <div class="hero-image" :style="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'height: 270px;' : 'height: 240px;'">
      <v-container :class="['d-flex align-center h-100',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : 'justify-space-between px-16']">
        <h1 :class="['font-weight-bold themeAccent--text',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'headline my-6' : 'display-1']">
          Young Talent Pool
        </h1>
        <img src="/images/search.png" :height="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 152 : 196">
      </v-container>
    </div>
    <v-container class="py-16" :class="{ 'px-16': ['sm', 'xs'].includes($vuetify.breakpoint.name)}">
      <div :class="['d-flex align-center mb-8',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
        <p class="headline mb-0 themeAccent--text font-weight-bold mr-3 my-1">
          Search
        </p>
        <div :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'mr-3'" :style="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'width: 100%;' : 'width: 380px;'">
          <v-form @submit.prevent="$fetch()">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              :placeholder="`Search your Keyword`"
              class="my-1 rounded-lg"
              outlined
              dense
              hide-details
            >
              <template #append>
                <div class="h-100">
                  <v-icon style="cursor: pointer;" @click="$fetch()">
                    mdi-magnify
                  </v-icon>
                </div>
              </template>
            </v-text-field>
          </v-form>
        </div>
      </div>

      <div v-if="firstLoad && listDatas && allKeywordLength > 0" class="my-5">
        <div v-if="!['xs'].includes($vuetify.breakpoint.name)">
          <template v-for="data in listDatas">
            <div v-if="data.keywords.length > 0" :key="`domain-industry-${data.domain_industry_id}`" class="mb-8">
              <div class="d-flex align-start">
                <v-card
                  outlined
                  min-width="230"
                  class="rounded-lg industry-card-border mr-5"
                  :style="`border-color: ${industryColors[data.name].color};`"
                  :to="localePath({ name: 'young-talent-pool-slug', params: { slug: data.name } })"
                >
                  <v-card-text class="d-flex align-center flex-column" :class="`${industryColors[data.name].class}--text`">
                    <v-img :src="`/images/industries/icons/${data.name}.png`" height="80" contain />
                    <p class="body-1 mt-3 mb-0 font-weight-bold">
                      {{ data.name }}
                    </p>
                    <p class="display-1 mt-3 mb-0 font-weight-bold">
                      {{ $currencyText(data.countKeywords) }}
                    </p>
                    <p class="mb-0 font-weight-bold">
                      Keywords
                    </p>
                    <div class="d-flex mt-3 align-center">
                      <v-icon left :color="industryColors[data.name].class">
                        fas fa-user
                      </v-icon>
                      <p class="display-1 mb-0 font-weight-bold">
                        {{ $currencyText(data.countTalents) }}
                      </p>
                    </div>
                  </v-card-text>
                </v-card>
                <div class="d-flex flex-wrap">
                  <v-hover
                    v-for="(keyword,index) in data.keywords"
                    :key="`domain-industry-${data.id}-keyword-${keyword.ListKeyword.id}`"
                    v-slot="{ hover }"
                  >
                    <v-chip
                      :color="data.colors[index]"
                      class="mr-2 my-2 white--text"
                      :class="{'elevation-5': hover}"
                      label
                      :to="localePath({ name: 'young-talent-pool-slug-key', params: { slug: data.name, key: keyword.ListKeyword.keyword } })"
                    >
                      {{ keyword.ListKeyword.keyword }}
                    </v-chip>
                  </v-hover>
                  <v-btn
                    v-if="data.page < data.totalPages"
                    text
                    :disabled="data.loading"
                    :loading="data.loading"
                    color="themeAccent"
                    class="mt-2 mb-1 mx-1 rounded-lg"
                    @click="loadMore(data)"
                  >
                    Show more {{ data.name }} {{ data.page < data.totalPages-1 ? `${size} items` : '' }}
                  </v-btn>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div v-else>
          <v-slide-group
            v-model="slide"
            center-active
            mandatory
            show-arrows
          >
            <template v-for="data in listDatas">
              <v-slide-item
                v-if="data.keywords.length > 0"
                :key="`domain-industry-sm-${data.domain_industry_id}`"
                v-slot="{ active, toggle }"
                class="mx-2"
              >
                <div class="d-flex flex-column align-center">
                  <v-card
                    outlined
                    min-width="200"
                    class="rounded-lg industry-card-border mb-2"
                    :color="active ? industryColors[data.name].class : ''"
                    :style="`border-color: ${industryColors[data.name].color}; ${active ? 'border-width: 0px;' : ''}`"
                    @click="toggle"
                  >
                    <v-card-text class="d-flex align-center flex-column" :class="active ? 'white--text pt-6' : `${industryColors[data.name].class}--text`">
                      <v-img :src="`/images/industries/icons/${active ? `${data.name}-w` : data.name}.png`" height="80" contain />
                      <p class="body-1 mt-3 mb-0 font-weight-bold">
                        {{ data.name }}
                      </p>
                      <p class="display-1 mt-3 mb-0 font-weight-bold">
                        {{ $currencyText(data.countKeywords) }}
                      </p>
                      <p class="mb-0 font-weight-bold">
                        Keywords
                      </p>
                      <div class="d-flex mt-3 align-center">
                        <v-icon left :color="active ? 'white' : industryColors[data.name].class">
                          fas fa-user
                        </v-icon>
                        <p class="display-1 mb-0 font-weight-bold">
                          {{ $currencyText(data.countTalents) }}
                        </p>
                      </div>
                    </v-card-text>
                  </v-card>
                  <v-icon v-if="active" class="my-3" x-large :color="industryColors[data.name].class">
                    fas fa-caret-up
                  </v-icon>
                </div>
              </v-slide-item>
            </template>
          </v-slide-group>
          <v-expand-transition>
            <v-sheet
              v-if="slide != null && firstLoad"
              tile
            >
              <template v-for="(data,index) in listDatas">
                <div v-if="data.keywords.length > 0 && slide === index" :key="`keyword-group-industry-${data.domain_industry_id}`">
                  <div class="d-flex flex-wrap">
                    <v-hover
                      v-for="(keyword,index2) in data.keywords"
                      :key="`domain-industry-${data.domain_industry_id}-keyword-${keyword.ListKeyword.id}`"
                      v-slot="{ hover }"
                    >
                      <v-chip
                        :color="data.colors[index2]"
                        class="mr-2 my-2 white--text"
                        :class="{'elevation-5': hover}"
                        label
                        :to="localePath({ name: 'young-talent-pool-slug-key', params: { slug: data.name , key: keyword.ListKeyword.keyword }})"
                      >
                        {{ keyword.ListKeyword.keyword }}
                      </v-chip>
                    </v-hover>
                    <v-btn
                      v-if="data.page < data.totalPages"
                      text
                      :disabled="data.loading"
                      :loading="data.loading"
                      color="themeAccent"
                      class="mt-2 mb-1 mx-1 rounded-lg"
                      @click="loadMore(data)"
                    >
                      Show more {{ ['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : data.name }} {{ data.page < data.totalPages-1 ? `${size} items` : '' }}
                    </v-btn>
                  </div>
                </div>
              </template>
            </v-sheet>
          </v-expand-transition>
        </div>
      </div>
      <div v-else-if="firstLoad" class="py-16">
        <h1 class="text-center grey--text my-16">
          Not Found Keyword Search
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
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      listDatas: null,
      slide: 0,
      firstLoad: false,
      focusSearch: false,
      search: this.$route.query.q || '',
      size: 50
    }
  },

  async fetch () {
    this.$overlay.showLoading()
    try {
      const datas = await this.$axios.$get(`${this.apiPath}dashboards/count-talents-group-industry?group=young_talent&q=${this.search}`)
      this.listDatas = datas.map((ele) => {
        return {
          ...ele,
          page: 0,
          totalPages: 0,
          totalItems: 0,
          colors: [],
          keywords: [],
          loading: true
        }
      })

      const dataKeywords = await Promise.all(this.listDatas.map((ele) => {
        const searchParams = new URLSearchParams({
          size: this.size,
          q: this.search,
          page: ++ele.page,
          domain_industry_id: ele.domain_industry_id,
          group: 'young_talent'
        }).toString()
        return this.$axios.$get(`${this.apiPath}industry-keywords${(searchParams ? '?' + searchParams : '')}`)
      }))
      for (const [index, data] of this.listDatas.entries()) {
        data.keywords = [
          ...data.keywords,
          ...dataKeywords[index].rows.map((ele) => {
            return {
              ...ele,
              color: this.$randomColor('light')
            }
          })
        ]
        data.colors = this.$generateGradientColorList(this.industryColors[data.name].colorStart, this.industryColors[data.name].colorEnd, this.size * data.page)
        data.totalPages = dataKeywords[index].totalPages
        data.totalItems = dataKeywords[index].totalItems
        if (data.totalPages === 2) {
          this.loadMore(data)
        }
        data.loading = false
      }
      this.firstLoad = true
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
    allKeywordLength () {
      return this.listDatas ? this.listDatas.map(ele => ele.keywords.length).reduce((a, b) => a + b, 0) : 0
    },
    industryColors () {
      return this.$store.state.enums.industries
    }
  },
  beforeMount () {
    if (!this.$store.state.setting.show_menu_young_talent) {
      this.$nuxt.error({ statusCode: 404, message: 'Not Found This Page' })
    }
  },
  created () {
    this.$breadcrumbs.clear()
  },
  methods: {
    async loadMore (data) {
      try {
        data.loading = true
        const searchParams = new URLSearchParams({
          size: this.size,
          q: this.search,
          page: ++data.page,
          domain_industry_id: data.domain_industry_id,
          group: 'young_talent'
        }).toString()
        const datas = await this.$axios.$get(`${this.apiPath}industry-keywords${(searchParams ? '?' + searchParams : '')}`)
        data.keywords = [
          ...data.keywords,
          ...datas.rows.map((ele) => {
            return {
              ...ele,
              color: this.$randomColor('light')
            }
          })
        ]
        data.colors = this.$generateGradientColorList(this.industryColors[data.name].colorStart, this.industryColors[data.name].colorEnd, this.size * data.page)
        data.totalPages = datas.totalPages
        data.totalItems = datas.totalItems
        data.loading = false
      } catch (e) {
        this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
      }
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
.industry-card-border{
  border-width: 2px;
  border-top-width: 10px;
}
</style>
