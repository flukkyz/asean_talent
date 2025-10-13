<template>
  <client-only v-if="setting">
    <div class="">
      <v-carousel
        v-if="slides && slides.length> 0"
        hide-delimiter-background
        :show-arrows="false"
        :hide-delimiters="slides.length < 2"
        :show-arrows-on-hover="slides.length> 1"
        height="100%"
        width="100%"
        cycle
      >
        <template v-for="slide in slides">
          <a
            v-if="slide.link"
            :key="`slide-${slide.id}`"
            :href="slide.link"
            target="_blank"
          >
            <v-carousel-item>
              <v-img :src="slide.Img.url" />

            </v-carousel-item>
          </a>
          <v-carousel-item
            v-else
            :key="`slide-${slide.id}`"
          >
            <v-img :src="slide.Img.url" />
          </v-carousel-item>
        </template>
      </v-carousel>

      <div class="bg-header">
        <v-container class="d-flex align-center py-10" :class="['xs','sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : 'justify-space-around'">
          <div :class="['xl', 'lg','md'].includes($vuetify.breakpoint.name) ? '' : 'mx-5'" style="max-width: 530px;">
            <h1 class="display-2 themeAccent--text font-weight-bold mb-6">
              {{ setting.home_header_title || 'ASEAN Talent Pool' }}
            </h1>
            <p class="mb-6">
              {{ setting.home_header_detail}}
            </p>
            <div style="max-width: 440px;" class="mb-4">
              <v-form @submit.prevent="onSearch">
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  :placeholder="`Search your Keyword`"
                  hide-details
                  class="rounded-lg"
                  dense
                  outlined
                  @focus="focusSearch = true"
                  @blur="focusSearch = false"
                >
                  <template #append>
                    <div class="h-100">
                      <v-icon style="cursor: pointer;" @click="onSearch">
                        mdi-magnify
                      </v-icon>
                    </div>
                  </template>
                </v-text-field>
              </v-form>
            </div>
            <p v-if="listPopulars && listPopulars.length > 0" class="mb-2">
              Trending searches
            </p>
            <v-chip
              v-for="(popular) in listPopulars"
              :key="`popular-${popular.id}`"
              :to="localePath({ name: 'asean-talent-pool', query: { q: popular.keyword } })"
              color="primary"
              outlined
              small
              class="mr-3 mb-3"
              label
            >
              {{ popular.keyword }}
            </v-chip>
          </div>
          <div :class="['xs','sm'].includes($vuetify.breakpoint.name) ? 'order-first mb-16 mx-10' : ''">
            <img
              src="/images/graphics/1.png"
            >
          </div>
        </v-container>
        <v-container class="d-flex flex-wrap align-center justify-center pb-10">
          <div class="d-flex align-center flex-column themeAccent--text  mb-5" :class="['md','sm'].includes($vuetify.breakpoint.name) ? 'mx-6' : 'mx-16'">
            <v-img src="/images/ui/talents.png" width="80" height="80" contain />
            <h1 class="display-1 mt-3 font-weight-bold">
              {{ $currencyText(countTalents) }}
            </h1>
            <p class="title mb-0">
              Talents
            </p>
          </div>
          <div class="d-flex align-center flex-column themeAccent--text mb-5" :class="['md','sm'].includes($vuetify.breakpoint.name) ? 'mx-6' : 'mx-16'">
            <v-img src="/images/ui/keywords.png" width="80" height="80" contain />
            <h1 class="display-1 mt-3 font-weight-bold">
              {{ $currencyText(countKeywords) }}
            </h1>
            <p class="title mb-0">
              Keywords
            </p>
          </div>
          <div class="d-flex align-center flex-column themeAccent--text mb-5" :class="['md','sm'].includes($vuetify.breakpoint.name) ? 'mx-6' : 'mx-16'">
            <v-img src="/images/ui/countries.png" width="80" height="80" contain />
            <h1 class="display-1 mt-3 font-weight-bold">
              {{ $currencyText(countCountries) }}
            </h1>
            <p class="title mb-0">
              Countries
            </p>
          </div>
          <div class="d-flex align-center flex-column themeAccent--text mb-5" :class="['md','sm'].includes($vuetify.breakpoint.name) ? 'mx-6' : 'mx-16'">
            <v-img src="/images/ui/industries.png" width="80" height="80" contain />
            <h1 class="display-1 mt-3 font-weight-bold">
              {{ $currencyText(countIndustries) }}
            </h1>
            <p class="title mb-0">
              Industries
            </p>
          </div>
        </v-container>
      </div>

        <div v-if="listBlogs && listBlogs.length > 0 && setting.show_home_blog" class="py-16">
          <v-container :class="{ 'px-16 text-center': ['sm', 'xs'].includes($vuetify.breakpoint.name)}">
            <h1 class="headline font-weight-bold mb-8 themeAccent--text text-center">
              {{ $t('NEWS_AND_ACTIVITIES') }}
            </h1>
            <v-row
              class="my-8"
              align="center"
              justify="center"
            >
              <v-col
                v-for="blog in listBlogs"
                :key="blog.id"
                cols="12"
              >
                <cards-blog
                  :item="blog"
                />
              </v-col>
            </v-row>
            <div class="text-right">
              <v-btn text color="info" large :to="localePath({name: 'blogs'})">
                View more
                <v-icon color="info" right>
                  fas fa-chevron-right
                </v-icon>
              </v-btn>
            </div>
          </v-container>
        </div>
        <div v-if="setting.show_home_pool && industries && industries.length > 0" class="pb-16">
          <v-divider class="pt-16" />
          <v-container class="">
            <!-- <div v-if="aseanTalentsByCountriesAndIndustries" class="pb-16 mb-16">
            <p class="headline font-weight-bold mb-8 themeAccent--text text-center">
              ASEAN Talents by country and industry
            </p>
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <thead>
                <tr>
                  <th width="25%">
                    &nbsp;
                  </th>
                  <th v-for="(industry,i) in industries" :key="`talents-by-countries-and-industries-industry-${i}`" :class="['text-right',['xs'].includes($vuetify.breakpoint.name) ? '' : 'px-2']" width="15%">
                    <v-tooltip top>
                      <template #activator="{ on, attrs }">
                        <v-img
                          v-bind="attrs"
                          :src="`/images/industries/icons/${industry.name}.png`"
                          :height="['xs','sm'].includes($vuetify.breakpoint.name) ? 35 : 40"
                          :width="['xs','sm'].includes($vuetify.breakpoint.name) ? 35 : 40"
                          contain
                          class="ml-auto"
                          v-on="on"
                        />
                      </template>
                      <span>{{ industry.name }}</span>
                    </v-tooltip>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(country, i) in aseanCountries" :key="`talents-by-countries-and-industries-country-${i}`" :class="i%2===0 ? 'grey lighten-4' : ''">
                  <td :class="['pt-2',['xs'].includes($vuetify.breakpoint.name) ? 'px-1' : 'pl-5 pr-3']">
                    <v-tooltip top>
                      <template #activator="{ on, attrs }">
                        <img
                          :src="`https://flagsapi.com/${aseanTalentsByCountriesAndIndustries[country].iso2}/flat/64.png`"
                          v-bind="attrs"
                          v-on="on"
                        >
                      </template>
                      <span>{{ country }}</span>
                    </v-tooltip>
                  </td>
                  <td v-for="(industry,j) in industries" :key="`talents-by-countries-and-industries-data-${i}-${j}`" :class="['text-right',['xs'].includes($vuetify.breakpoint.name) ? 'px-2' : 'pl-3 pr-5']">
                    <template v-if="aseanTalentsByCountriesAndIndustries[country][industry.name]">
                      <nuxt-link :to="localePath({ name: 'dashboard-slug', params: { slug: country }, query: { industry: industry.name } })">
                        <span class="font-weight-bold themeAccent--text">
                          {{ $currencyText(aseanTalentsByCountriesAndIndustries[country][industry.name]) }}
                        </span>
                      </nuxt-link>
                    </template>
                    <span v-else>-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div> -->

          <p v-if="industries && industries.length > 0" class="headline font-weight-bold mb-8 themeAccent--text text-center">
            ASEAN Talent Pool by Keywords
          </p>
          <v-slide-group
            v-model="slide"
            center-active
            show-arrows
          >
            <v-slide-item
              v-for="industry in industries"
              :key="`card-industry-${industry.domain_industry_id}`"
              v-slot="{ active, toggle }"
              class="mx-2"
            >
              <div class="d-flex flex-column align-center">
                <v-card
                  outlined
                  :min-width="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 200 : 230"
                  class="rounded-lg industry-card-border mb-2"
                  :color="active ? industryColors[industry.name].class : ''"
                  :style="`border-color: ${industryColors[industry.name].color}; ${active ? 'border-width: 0px;' : ''}`"
                  @click="toggle"
                >
                  <v-card-text class="d-flex align-center flex-column" :class="active ? 'white--text pt-6' : `${industryColors[industry.name].class}--text`">
                    <v-img :src="`/images/industries/icons/${active ? `${industry.name}-w` : industry.name}.png`" height="80" contain />
                    <p class="body-1 mt-3 mb-0 font-weight-bold">
                      {{ industry.name }}
                    </p>
                    <p class="display-1 mt-3 mb-0 font-weight-bold">
                      {{ $currencyText(industry.countKeywords) }}
                    </p>
                    <p class="mb-0 font-weight-bold">
                      Keywords
                    </p>
                    <div class="d-flex mt-3 align-center">
                      <v-icon left :color="active ? 'white' : industryColors[industry.name].class">
                        fas fa-user
                      </v-icon>
                      <p class="display-1 mb-0 font-weight-bold">
                        {{ $currencyText(industry.countTalents) }}
                      </p>
                    </div>
                  </v-card-text>
                </v-card>
                <v-icon v-if="active" class="my-3" x-large :color="industryColors[industry.name].class">
                  fas fa-caret-up
                </v-icon>
              </div>
            </v-slide-item>
          </v-slide-group>

          <v-expand-transition>
            <v-sheet
              v-if="slide != null && firstLoad"
              tile
            >
              <template v-for="(industry,index) in industries">
                <div v-if="industry.keywords.length > 0 && slide === index" :key="`keyword-group-industry-${industry.domain_industry_id}`">
                  <div class="d-flex flex-wrap">
                    <v-hover
                      v-for="(keyword,index2) in industry.keywords"
                      :key="`domain-industry-${industry.domain_industry_id}-keyword-${keyword.ListKeyword.id}`"
                      v-slot="{ hover }"
                    >
                      <v-chip
                        :color="industry.colors[index2]"
                        class="mr-2 my-2 white--text"
                        :class="{'elevation-5': hover}"
                        label
                        :to="localePath({ name: 'asean-talent-pool-slug-key', params: { slug: industry.name , key: keyword.ListKeyword.keyword }})"
                      >
                        {{ keyword.ListKeyword.keyword }}
                      </v-chip>
                    </v-hover>
                  </div>
                  <div class="text-center mt-10">
                    <v-btn
                      v-if="industry.keywords.length < industry.countKeywords"
                      text
                      rounded
                      color="themeAccent"
                      :to="localePath({ name: 'asean-talent-pool-slug', params: { slug: industry.name } })"
                    >
                      View All {{ industry.name }}
                      <v-icon small class="ml-1">
                        mdi-arrow-right-thin
                      </v-icon>
                    </v-btn>
                  </div>
                </div>
              </template>
            </v-sheet>
          </v-expand-transition>
        </v-container>
      </div>

      <div v-if="(supports && supports.length > 0) || (manages && manages.length > 0)" class="partner-section">
        <v-container>
          <div class="d-flex flex-wrap w-100 pt-12 pb-4" :class="['xs','sm'].includes($vuetify.breakpoint.name) ? 'flex-column align-center' : 'justify-space-around align-start'">
            <div v-if="supports && supports.length > 0" class="mb-10">
              <p class="themeAccent--text title">
                Supported by
              </p>
              <div v-if="supports" class="d-flex align-center flex-wrap" :class="['xs','sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : ''">
                <a v-for="item in supports" :key="`support-${item.id}`" :href="item.url" target="_blank">
                  <img
                    :src="item.Img ? item.Img.url : '/images/icon.png'"
                    :class="['xs','sm'].includes($vuetify.breakpoint.name) ? 'mb-8' : 'mr-8'"
                    height="52"
                  >
                </a>
              </div>
            </div>
            <div v-if="manages && manages.length > 0" class="mb-10">
              <p class="themeAccent--text title">
                Managed by
              </p>
              <div v-if="manages" class="d-flex align-center flex-wrap" :class="['xs','sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : ''">
                <a v-for="item in manages" :key="`support-${item.id}`" :href="item.url" target="_blank">
                  <img
                    :src="item.Img ? item.Img.url : '/images/icon.png'"
                    :class="['xs','sm'].includes($vuetify.breakpoint.name) ? 'mb-8' : 'mr-8'"
                    height="60"
                  >
                </a>
              </div>
            </div>
          </div>
        </v-container>
      </div>
    </div>
  </client-only>
</template>

<script>
export default {
  data () {
    return {
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      basePath: `${process.env.baseUrl}${this.$route.fullPath}`,
      search: '',
      listPopulars: null,
      firstLoad: false,
      listBlogs: null,
      slides: null,
      banners: null,
      slide: null,
      focusSearch: false,
      countTalents: 0,
      countKeywords: 0,
      countCountries: 0,
      countIndustries: 0,
      industries: null,
      supports: null,
      manages: null,
      slideSizes: {
        xs: 200,
        sm: 365,
        md: 365,
        lg: 360,
        xl: 525
      },
      blogShows: {
        xs: 2,
        sm: 2,
        md: 2,
        lg: 3,
        xl: 4
      }
      // aseanTalentsByCountriesAndIndustries: null
    }
  },
  head () {
    return this.$headUtil({
      lang: this.$lang.getISO,
      title: this.$t('HOME'),
      urlPath: this.basePath
    })
  },
  computed: {
    industryColors () {
      return this.$store.state.enums.industries
    },
    aseanCountries () {
      return this.$store.state.aseanCountries
    },
    setting () {
      return this.$store.state.setting
    }
  },
  created () {
    this.$breadcrumbs.clear()
  },
  async mounted () {
    try {
      const datas = await Promise.all([
        this.$axios.$get(`${this.apiPath}list-keywords-popular?size=6&group=talent`),
        this.$axios.$get(`${this.apiPath}talents-count`),
        this.$axios.$get(`${this.apiPath}list-keywords-count?group=talent`),
        this.$axios.$get(`${this.apiPath}dashboards/count-talents-group-country?group=talent`),
        this.$axios.$get(`${this.apiPath}dashboards/count-talents-group-industry?group=talent`),
        this.$axios.$get(`${this.apiPath}supports`),
        this.$axios.$get(`${this.apiPath}manages`)
        // this.$axios.$get(`${this.apiPath}dashboards/count-talents-group-industry-country?group=talent`)
      ])
      this.listPopulars = datas[0].rows
      this.countTalents = datas[1]
      this.countKeywords = datas[2]
      this.countCountries = datas[3].filter(ele => ele.hc_key !== 'blank').length
      this.countIndustries = datas[4].length
      this.industries = datas[4]
      this.supports = datas[5].rows
      this.manages = datas[6].rows

      // const aseanTalentsByCountriesAndIndustries = {}
      // for (const data of this.$_.orderBy(datas[5].filter(ele => this.aseanCountries.includes(ele.country)), ['country'], ['asc'])) {
      //   if (!aseanTalentsByCountriesAndIndustries[data.country]) {
      //     aseanTalentsByCountriesAndIndustries[data.country] = {
      //       iso2: data.iso2
      //     }
      //   }
      //   aseanTalentsByCountriesAndIndustries[data.country][data.industry] = data.count
      // }
      // this.aseanTalentsByCountriesAndIndustries = aseanTalentsByCountriesAndIndustries

      const dataKeywords = await Promise.all(this.industries.map((ele) => {
        const searchParams = new URLSearchParams({
          size: 20,
          domain_industry_id: ele.domain_industry_id,
          group: 'talent'
        }).toString()
        return this.$axios.$get(`${this.apiPath}industry-keywords${(searchParams ? '?' + searchParams : '')}`)
      }))

      for (const [index, data] of this.industries.entries()) {
        data.colors = this.$generateGradientColorList(this.industryColors[data.name].colorStart, this.industryColors[data.name].colorEnd, 20)
        data.keywords = [
          ...dataKeywords[index].rows.map((ele) => {
            return {
              ...ele
            }
          })
        ]
      }
      this.firstLoad = true

      const slides = await this.$axios.$get(`${this.apiPath}slides`)
      this.slides = slides
      // const banners = await this.$axios.$get(`${this.apiPath}banners`)
      // this.banners = banners
      const listBlogs = await this.$axios.$get(`${this.apiPath}blogs?${new URLSearchParams({ size: 10 }).toString()}`)
      this.listBlogs = listBlogs.rows
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
  },
  methods: {
    onSearch () {
      this.$router.push(this.localePath({ name: 'asean-talent-pool', query: { q: this.search } }))
    }
  }
}
</script>

<style lang="scss" scoped>
.bg-header{
  background: rgb(238,246,255);
  background: linear-gradient(0deg, rgba(238,246,255,1) 0%, rgba(255,255,255,1) 100%);
}
.partner-section{
  background-color: #EEF6FF;
}
.industry-card-border{
  border-width: 2px;
  border-top-width: 10px;
}
</style>
