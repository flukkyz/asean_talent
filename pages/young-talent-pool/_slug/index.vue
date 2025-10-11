<template>
  <div v-if="firstLoad">
    <div class="hero-image" :style="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'height: 270px;' : 'height: 240px;'">
      <v-container :class="['d-flex align-center h-100',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : 'justify-space-between px-16']">
        <div :class="['d-flex align-center',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : 'justify-space-between']">
          <img :src="`/images/industries/icons/${industry.name}-t.png`" :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'mt-6' : 'mr-5'" :height="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 40 : 80">
          <h1 :class="['font-weight-bold themeAccent--text',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'headline mb-3' : 'display-1']">
            {{ industry.name }}
          </h1>
        </div>
        <img :src="`/images/industries/icons/${industry.name}-img.png`" :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'mb-6' : ''" :height="['xs', 'sm'].includes($vuetify.breakpoint.name) ? '50%' : '80%'">
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
              :placeholder="`Search in ${industry.name}`"
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

      <div :class="['d-flex flex-wrap align-center mb-8',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'justify-center' : '']">
        <v-card
          outlined
          class="rounded-lg count-card-border mr-4 mb-4"
          :class="{ 'flex-grow-1': ['xs'].includes($vuetify.breakpoint.name)}"
          min-width="173"
          height="154"
        >
          <v-card-text class="d-flex align-center flex-column themeAccent--text pt-4">
            <v-img src="/images/ui/talents.png" width="50" height="50" contain />
            <h1 class="headline mt-4 font-weight-bold">
              {{ $currencyText(industry.countTalents) }}
            </h1>
            <p class="mb-0">
              Talents
            </p>
          </v-card-text>
        </v-card>
        <v-card
          outlined
          class="rounded-lg count-card-border mr-4 mb-4"
          :class="{ 'flex-grow-1': ['xs'].includes($vuetify.breakpoint.name)}"
          min-width="173"
          height="154"
        >
          <v-card-text class="d-flex align-center flex-column themeAccent--text pt-4">
            <v-img src="/images/ui/keywords.png" width="50" height="50" contain />
            <h1 class="headline mt-4 font-weight-bold">
              {{ $currencyText(industry.countKeywords) }}
            </h1>
            <p class="mb-0">
              Keywords
            </p>
          </v-card-text>
        </v-card>
        <v-card
          outlined
          class="rounded-lg count-card-border mr-4 mb-4"
          :class="{ 'flex-grow-1': ['xs'].includes($vuetify.breakpoint.name)}"
          min-width="173"
          height="154"
        >
          <v-card-text class="d-flex align-center flex-column themeAccent--text pt-4">
            <v-img src="/images/ui/countries.png" width="50" height="50" contain />
            <h1 class="headline mt-4 font-weight-bold">
              {{ $currencyText(industry.countCountries) }}
            </h1>
            <p class="mb-0">
              Countries
            </p>
          </v-card-text>
        </v-card>
      </div>

      <div v-if="industry.populars.length > 0" class="mb-8">
        <p class="headline mb-0 themeAccent--text font-weight-bold mb-3">
          Top Popular {{ industry.name }} Search
        </p>
        <div class="d-flex flex-wrap">
          <v-hover
            v-for="keyword in industry.populars"
            :key="`domain-industry-${industry.domain_industry_id}-popular-${keyword.ListKeyword.id}`"
            v-slot="{ hover }"
          >
            <v-chip
              :color="industryColors[industry.name].color"
              class="mr-2 my-2 white--text"
              :class="{'elevation-5': hover}"
              label
              :to="localePath({ name: 'young-talent-pool-slug-key', params: { slug: industry.name, key: keyword.ListKeyword.keyword } })"
            >
              {{ keyword.ListKeyword.keyword }}
            </v-chip>
          </v-hover>
        </div>
      </div>

      <p class="headline mb-0 themeAccent--text font-weight-bold mb-3">
        All Keyword {{ industry.name }}
      </p>
      <div v-if="industry.totalItems > 0" class="mb-8">
        <div class="d-flex flex-wrap">
          <v-hover
            v-for="(keyword,index) in industry.keywords"
            :key="`domain-industry-${industry.domain_industry_id}-keyword-${keyword.ListKeyword.id}`"
            v-slot="{ hover }"
          >
            <v-chip
              :color="industry.colors[index]"
              class="mr-2 my-2 white--text"
              :class="{'elevation-5': hover}"
              label
              :to="localePath({ name: 'young-talent-pool-slug-key', params: { slug: industry.name, key: keyword.ListKeyword.keyword } })"
            >
              {{ keyword.ListKeyword.keyword }}
            </v-chip>
          </v-hover>
        </div>
        <div class="text-center my-12">
          <v-btn
            v-if="industry.page < industry.totalPages"
            text
            class="rounded-lg"
            color="themeAccent"
            @click="loadMore"
          >
            Show more {{ industry.name }} {{ industry.page < industry.totalPages-1 ? `${size} items` : '' }}
            <v-icon small right>
              fas fa-chevron-down
            </v-icon>
          </v-btn>
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
      industry: null,
      firstLoad: false,
      search: this.$route.query.q || '',
      size: 50
    }
  },
  async fetch () {
    this.$overlay.showLoading()
    this.$breadcrumbs.setItems([
      {
        text: 'Young Talent Pool',
        to: { name: 'young-talent-pool' }
      },
      {
        text: this.$route.params.slug
      }
    ])
    try {
      const dataIndustry = await this.$axios.$get(`${this.apiPath}dashboards/count-talents-group-industry?group=young_talent&industry=${this.$route.params.slug}&q=${this.search}`)
      this.industry = {
        ...dataIndustry[0],
        page: 0,
        totalPages: 0,
        totalItems: 0,
        keywords: [],
        colors: [],
        populars: [],
        loading: true
      }
      const searchKeywordParams = new URLSearchParams({
        size: this.size,
        q: this.search,
        page: ++this.industry.page,
        domain_industry_id: this.industry.domain_industry_id,
        group: 'young_talent'
      }).toString()
      const dataKeywords = await this.$axios.$get(`${this.apiPath}industry-keywords${(searchKeywordParams ? '?' + searchKeywordParams : '')}`)

      this.industry.keywords = [
        ...this.industry.keywords,
        ...dataKeywords.rows
      ]
      this.industry.colors = this.$generateGradientColorList(this.industryColors[this.industry.name].colorStart, this.industryColors[this.industry.name].colorEnd, this.size * this.industry.page)
      this.industry.totalPages = dataKeywords.totalPages
      this.industry.totalItems = dataKeywords.totalItems
      if (this.industry.totalPages === 2) {
        this.loadMore()
      }

      const searchPopularParams = new URLSearchParams({
        size: 10,
        order: 'hit',
        domain_industry_id: this.industry.domain_industry_id,
        group: 'young_talent'
      }).toString()
      const dataPopulars = await this.$axios.$get(`${this.apiPath}industry-keywords${(searchPopularParams ? '?' + searchPopularParams : '')}`)
      this.industry.populars = [...dataPopulars.rows]

      this.industry.loading = false
      this.firstLoad = true
      this.$overlay.hide()
    } catch (e) {
      console.log(e)
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
    industryColors () {
      return this.$store.state.enums.industries
    }
  },
  beforeMount () {
    if (!this.$store.state.setting.show_menu_young_talent) {
      this.$nuxt.error({ statusCode: 404, message: 'Not Found This Page' })
    }
  },
  methods: {
    async loadMore () {
      try {
        this.industry.loading = true
        const searchParams = new URLSearchParams({
          size: this.size,
          q: this.search,
          page: ++this.industry.page,
          domain_industry_id: this.industry.domain_industry_id,
          group: 'young_talent'
        }).toString()
        const dataKeywords = await this.$axios.$get(`${this.apiPath}industry-keywords${(searchParams ? '?' + searchParams : '')}`)
        this.industry.keywords = [
          ...this.industry.keywords,
          ...dataKeywords.rows
        ]
        this.industry.colors = this.$generateGradientColorList(this.industryColors[this.industry.name].colorStart, this.industryColors[this.industry.name].colorEnd, this.size * this.industry.page)
        this.industry.totalPages = dataKeywords.totalPages
        this.industry.totalItems = dataKeywords.totalItems
        this.industry.loading = false
      } catch (e) {
        this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
      }
    }
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
.count-card-border{
  border-width: 2px;
  border-color: #000063;
}
</style>
