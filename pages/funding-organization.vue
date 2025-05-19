<template>
  <div class="">
    <div class="hero-image" style="height: 96px;">
      <v-container fluid :class="['d-flex align-center h-100',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column justify-center' : 'justify-space-between px-5']">
        <h1 :class="['font-weight-bold',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'headline' : 'display-1']">
          {{ pageName }}
        </h1>
      </v-container>
    </div>
    <div class="">
      <div class="search-panel py-6">
        <v-container :class="{ 'px-8': ['sm', 'xs'].includes($vuetify.breakpoint.name)}">
          <v-form @submit.prevent="onSearch">
            <div class="d-flex align-end">
              <div class="flex-grow-1 mr-3">
                <v-text-field
                  v-model="queryBody.search"
                  :label="`${$t('SEARCH')} Funding name`"
                  class="rounded-lg"
                  outlined
                  autofocus
                  dense
                  hide-details
                  clearable
                  @click:clear="clearSearch"
                />
              </div>
              <v-btn
                large
                depressed
                :disabled="!queryBody.search"
                type="submit"
                color="themeAccent"
                class="rounded-lg white--text"
              >
                <v-icon class="mr-1">
                  mdi-magnify
                </v-icon>

                Search
              </v-btn>
            </div>
          </v-form>
        </v-container>
      </div>
      <div v-if="fundingOrganization" class="pt-5 pb-16">
        <v-container :class="{ 'px-8': ['sm', 'xs'].includes($vuetify.breakpoint.name)}">
          <v-btn small plain color="grey" class="mb-1" @click="clearFundingOrganization">
            <v-icon class="mr-1" small>
              fas fa-chevron-left
            </v-icon>

            Back
          </v-btn>

          <div :class="['d-flex mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column-reverse align-center funding-profile-sm pt-10' : 'funding-profile justify-space-between align-stretch']">
            <div class="py-8 px-12 flex-grow-1 d-flex flex-column justify-space-between">
              <div class="mb-4">
                <p class="title font-weight-bold mb-0">
                  {{ fundingOrganization.name }}
                </p>
                <div class="d-flex align-center mb-0">
                  <p class="grey--text text--darken-2 body-1  mb-0">
                    {{ fundingOrganization.Department.name }},
                    {{ fundingOrganization.Country.name }}
                  </p>
                </div>
              </div>
              <div class="d-flex justify-space-between alien-center">
                <div class="">
                  <a v-if="fundingOrganization.email" :href="`mailto:${fundingOrganization.email}`" target="_blank">
                    <v-tooltip top>
                      <template #activator="{ on, attrs }">
                        <v-avatar
                          v-bind="attrs"
                          color="#FF4545"
                          size="33"
                          dark
                          class="mr-3"
                          v-on="on"
                        >
                          <v-icon size="22" color="white">mdi-email</v-icon>
                        </v-avatar>
                      </template>
                      <span>E-mail</span>
                    </v-tooltip>
                  </a>
                  <a v-if="fundingOrganization.website" :href="fundingOrganization.website" target="_blank">
                    <v-tooltip top>
                      <template #activator="{ on, attrs }">
                        <v-avatar
                          v-bind="attrs"
                          color="#FE8303"
                          size="33"
                          dark
                          class="mr-3"
                          v-on="on"
                        >
                          <v-icon size="22" color="white">mdi-web</v-icon>
                        </v-avatar>
                      </template>
                      <span>Website</span>
                    </v-tooltip>
                  </a>
                </div>
                <social-share
                  :path="localePath({ name: 'funding-organization', query: { id: fundingOrganization.id }})"
                  :title="fundingOrganization.name"
                  :content="fundingOrganization.description || ''"
                />
              </div>
            </div>
            <v-img v-if="fundingOrganization.Img" :src="fundingOrganization.Img.url" contain max-width="300" class="flex-shrink-0 align-self-center" />
          </div>

          <p class="primary--text my-6 font-weight-bold">
            Budget:
            {{ $currencyText(fundingOrganization.budget) }}
            <span v-if="fundingOrganization.Currency">
              {{ fundingOrganization.Currency.code }}
            </span>
          </p>

          <p class="primary--text my-6 font-weight-bold">
            Deadline:
            {{ $dateText(fundingOrganization.deadline_date,'medium','short') }}
          </p>

          <p v-if="fundingOrganization.description" class="title themeAccent--text mb-0">
            About
          </p>
          <div v-if="fundingOrganization.description" class="mt-2 mb-6">
            <div class="ck-content" v-html="fundingOrganization.description" />
          </div>

          <p v-if="fundingOrganization.eligibility" class="title themeAccent--text mb-0">
            Eligibility
          </p>
          <div v-if="fundingOrganization.eligibility" class="mt-2 mb-6">
            <div class="ck-content" v-html="fundingOrganization.eligibility" />
          </div>

          <div v-if="recommendations && recommendations.length > 0" class="mt-12">
            <p class="title themeAccent--text mb-0">
              Recommended Funding
            </p>
            <p>
              This section of the platform recommends Funding with place type similar to the funding you are interested in. And you can click on the name of the funding you are interested in to view their funding details.
            </p>
            <v-divider class="mb-6" />
            <v-row class="px-3">
              <v-col
                v-for="item in recommendations"
                :key="`recommendation-funding-${item.id}-${item.row}`"
                cols="12"
                sm="12"
                md="6"
                lg="4"
                xl="4"
              >
                <cards-funding :item="item" @show="showFundingOrganization" />
              </v-col>
            </v-row>
          </div>
        </v-container>
      </div>
      <div v-else>
        <div v-if="listDatas" class="pb-16">
          <v-container :class="{ 'px-8': ['sm', 'xs'].includes($vuetify.breakpoint.name)}">
            <div v-if="listDatas.length === 0 && !hasFilters && !fetching" class="py-16">
              <div class="d-flex align-center justify-center mt-16">
                <div class="border-normal rounded-lg pa-3 shadow">
                  <v-icon color="themeAccent" large>
                    mdi-magnify
                  </v-icon>
                </div>
              </div>
              <h1 class="text-center grey--text text--darken-2 mt-3">
                Search not found
              </h1>
            </div>
            <div v-else-if="!fetching || hasFilters" :class="['d-flex flex-column align-start',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column justify-center' : '']">
              <div :class="['border-normal rounded-lg overflow-hidden w-100 mb-5',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-grow-1' : 'flex-shrink-0']">
                <v-expansion-panels v-model="expansions.all" accordion flat>
                  <v-expansion-panel :readonly="!['sm', 'xs'].includes($vuetify.breakpoint.name) || hasFilters">
                    <v-expansion-panel-header :hide-actions="!['sm', 'xs'].includes($vuetify.breakpoint.name) || hasFilters">
                      <div class="d-flex justify-space-between align-baseline">
                        <p class="mb-0 font-weight-bold title">
                          Filter
                        </p>
                        <v-btn v-if="hasFilters" small text color="themePrimary" @click="clearAllFilters">
                          Clear all
                        </v-btn>
                      </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-row>
                        <v-col cols="12" md="3">
                          <v-expansion-panels v-model="expansions.country" accordion flat>
                            <v-expansion-panel :readonly="queryBody.filterCountries.length > 0">
                              <v-expansion-panel-header class="px-0">
                                <div class="d-flex justify-space-between align-baseline">
                                  <p class="mb-0 body-1 font-weight-bold">
                                    Country
                                  </p>
                                  <v-btn
                                    v-if="queryBody.filterCountries.length > 0"
                                    small
                                    class="mr-1"
                                    text
                                    color="themePrimary"
                                    @click="clearCountries"
                                  >
                                    Clear
                                  </v-btn>
                                </div>
                              </v-expansion-panel-header>
                              <v-expansion-panel-content class="mx-n6">
                                <v-autocomplete
                                  v-model="queryBody.filterCountries"
                                  :items="countries"
                                  multiple
                                  outlined
                                  item-text="name"
                                  item-value="id"
                                  placeholder="Select Country"
                                  class="rounded-lg"
                                  hide-details
                                  dense
                                />
                              </v-expansion-panel-content>
                            </v-expansion-panel>
                          </v-expansion-panels>
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-expansion-panels v-model="expansions.department" accordion flat>
                            <v-expansion-panel :readonly="queryBody.filterDepartments.length > 0">
                              <v-expansion-panel-header class="px-0">
                                <div class="d-flex justify-space-between align-baseline">
                                  <p class="mb-0 body-1 font-weight-bold">
                                    Department
                                  </p>
                                  <v-btn
                                    v-if="queryBody.filterDepartments.length > 0"
                                    small
                                    class="mr-1"
                                    text
                                    color="themePrimary"
                                    @click="clearDepartments"
                                  >
                                    Clear
                                  </v-btn>
                                </div>
                              </v-expansion-panel-header>
                              <v-expansion-panel-content class="mx-n6">
                                <v-autocomplete
                                  v-model="queryBody.filterDepartments"
                                  :items="departments"
                                  multiple
                                  outlined
                                  item-text="name"
                                  item-value="id"
                                  placeholder="Select Department"
                                  class="rounded-lg"
                                  hide-details
                                  dense
                                />
                              </v-expansion-panel-content>
                            </v-expansion-panel>
                          </v-expansion-panels>
                        </v-col>
                        <!-- <v-col cols="12" md="3">
                          <v-expansion-panels v-model="expansions.city" accordion flat>
                            <v-expansion-panel :readonly="queryBody.filterCities.length > 0">
                              <v-expansion-panel-header class="px-0">
                                <div class="d-flex justify-space-between align-baseline">
                                  <p class="mb-0 body-1 font-weight-bold">
                                    City
                                  </p>
                                  <v-btn
                                    v-if="queryBody.filterCities.length > 0"
                                    small
                                    class="mr-1"
                                    text
                                    color="themePrimary"
                                    @click="clearCities"
                                  >
                                    Clear
                                  </v-btn>
                                </div>
                              </v-expansion-panel-header>
                              <v-expansion-panel-content class="mx-n6">
                                <v-autocomplete
                                  v-model="queryBody.filterCities"
                                  :items="cities"
                                  multiple
                                  outlined
                                  item-text="name"
                                  item-value="id"
                                  placeholder="Select Cities"
                                  class="rounded-lg"
                                  hide-details
                                  dense
                                />
                              </v-expansion-panel-content>
                            </v-expansion-panel>
                          </v-expansion-panels>
                        </v-col> -->

                        <v-col cols="12" md="3">
                          <v-expansion-panels v-model="expansions.budget" accordion flat>
                            <v-expansion-panel :readonly="queryBody.filterMinBudget !== null || queryBody.filterMaxBudget !== null">
                              <v-expansion-panel-header class="px-0">
                                <div class="d-flex justify-space-between align-baseline">
                                  <p class="mb-0 body-1 font-weight-bold">
                                    Budget
                                  </p>
                                  <v-btn
                                    v-if="queryBody.filterMinBudget !== null || queryBody.filterMaxBudget !== null"
                                    small
                                    class="mr-1"
                                    text
                                    color="themePrimary"
                                    @click="clearBudget"
                                  >
                                    Clear
                                  </v-btn>
                                </div>
                              </v-expansion-panel-header>
                              <v-expansion-panel-content class="mx-n6">
                                <div class="d-flex align-center justify-space-between">
                                  <v-currency-field
                                    v-model="queryBody.filterMinBudget"
                                    outlined
                                    class="rounded-lg"
                                    :min="minBudget"
                                    :max="maxBudget"
                                    :placeholder="$currencyText(minBudget)"
                                    :decimal-length="0"
                                    dense
                                    hide-details
                                  />
                                  <p class="mb-0 body-1 font-weight-bold mx-3">
                                    -
                                  </p>
                                  <v-currency-field
                                    v-model="queryBody.filterMaxBudget"
                                    outlined
                                    class="rounded-lg"
                                    :min="minBudget"
                                    :max="maxBudget"
                                    :placeholder="$currencyText(maxBudget)"
                                    :decimal-length="0"
                                    dense
                                    hide-details
                                  />
                                </div>
                              </v-expansion-panel-content>
                            </v-expansion-panel>
                          </v-expansion-panels>
                        </v-col>
                      </v-row>

                      <v-btn
                        large
                        block
                        depressed
                        color="themeAccent"
                        class="rounded-lg mt-5 white--text"
                        @click="fetchData"
                      >
                        Apply Filter
                      </v-btn>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>
              <div class="flex-grow-1 w-100">
                <div v-if="listDatas.length === 0 && hasFilters" class="py-16">
                  <div class="d-flex align-center justify-center mt-16">
                    <div class="border-normal rounded-lg pa-3 shadow">
                      <v-icon color="themeAccent" large>
                        mdi-magnify
                      </v-icon>
                    </div>
                  </div>
                  <h1 class="text-center grey--text text--darken-2 mt-3">
                    Filter not found
                  </h1>
                  <p class="title grey--text text-center">
                    Please change filter or clear all filter.
                  </p>
                </div>
                <div v-else-if="!fetching">
                  <div :class="['d-flex',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : 'align-baseline justify-space-between mb-2']">
                    <div :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'mr-3'" :style="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'width: 100%;' : 'width: 380px;'">
                      <v-text-field
                        v-model="filters.search"
                        append-icon="mdi-magnify"
                        placeholder="Search within results"
                        class="my-1 rounded-lg"
                        outlined
                        clearable
                        dense
                        hide-details
                        @input="setListFilters"
                      />
                    </div>
                    <p class="title mb-0 text-right themeAccent--text font-weight-bold ml-3">
                      {{ ((filters.page-1)*filters.size)+1 }}
                      -
                      {{ ((filters.page-1)*filters.size)+listPages.length }}
                      of
                      {{ listDatas.length }}
                      {{ listDatas.length > 1 ? 'Courses' : 'Course' }}
                    </p>
                  </div>
                  <v-row>
                    <v-col
                      v-for="item in listPages"
                      :key="`funding-${item.id}-${item.row}`"
                      cols="12"
                      sm="12"
                      md="6"
                      lg="4"
                      xl="4"
                    >
                      <cards-funding :item="item" @show="showFundingOrganization" />
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
                    <div class="d-flex align-center justify-center mt-16">
                      <div class="border-normal rounded-lg pa-3 shadow">
                        <v-icon color="themeAccent" large>
                          mdi-magnify
                        </v-icon>
                      </div>
                    </div>
                    <h1 class="text-center grey--text text--darken-2 mt-3">
                      Search within results not found
                    </h1>
                    <p class="title grey--text text-center">
                      Please change keyword in search within results or clear keyword
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </v-container>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      basePath: `${process.env.baseUrl}${this.$route.fullPath}`,
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      api: 'matchings-funding',
      apiFundingOrganization: 'funding-organizations',
      pageName: 'Funding Search',
      listDatas: null,
      listFilters: [],
      fetching: false,
      filters: {
        page: 1,
        size: 24,
        search: ''
      },
      defaultCountries: [],
      defaultDepartments: [],
      defaultCities: [],
      countries: [],
      departments: [],
      cities: [],
      minBudget: null,
      maxBudget: null,
      expansions: {
        all: 0,
        country: null,
        department: null,
        city: null,
        budget: null
      },
      queryBody: {
        search: '',
        filterCountries: [],
        filterDepartments: [],
        filterCities: [],
        filterMinBudget: null,
        filterMaxBudget: null
      },
      fundingOrganization: null,
      tab: null,
      recommendations: null
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
    machineStatuses () {
      return this.$store.state.enums.machineStatuses
    },
    hasFilters () {
      return this.queryBody.filterCountries.length > 0 ||
      this.queryBody.filterDepartments.length > 0 ||
      this.queryBody.filterCities.length > 0 ||
      this.queryBody.filterMinBudget !== null || this.queryBody.filterMaxBudget !== null
    },
    listPages () {
      return this.listFilters.slice((this.filters.page - 1) * this.filters.size, this.filters.page * this.filters.size)
    }
  },
  beforeMount () {
    if (!this.$store.state.setting.show_menu_resourse_funding_organization) {
      this.$nuxt.error({ statusCode: 404, message: 'Not Found This Page' })
    }
  },
  created () {
    this.$breadcrumbs.clear()
  },
  async mounted () {
    try {
      const datas = await Promise.all([
        this.$axios.$get(`${this.apiPath}countries-fundings`),
        this.$axios.$get(`${this.apiPath}cities-fundings`),
        this.$axios.$get(`${this.apiPath}departments-fundings`)
      ])
      this.defaultCountries = datas[0]
      this.defaultCities = datas[1]
      this.defaultDepartments = datas[2]
      if (this.$route.query && this.$route.query.q) {
        this.queryBody.search = this.$route.query.q
        await this.onSearch()
      }
      if (this.$route.query && this.$route.query.id) {
        await this.showFundingOrganization(this.$route.query.id)
      }
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
  },
  methods: {
    async onSearch () {
      this.clearFundingOrganization()
      await this.clearAllFilters()
      this.minBudget = Math.min(...this.listDatas.map(ele => ele.budget))
      this.maxBudget = Math.max(...this.listDatas.map(ele => ele.budget))
    },
    async suggestionSearch (keyword) {
      this.queryBody.search = keyword
      await this.onSearch()
    },
    async fetchData () {
      setTimeout(() => {
        this.resetExpansions()
      }, 10)
      this.fetching = true
      this.$overlay.showLoading()
      try {
        const datas = await this.$axios.$post(`${this.apiPath}${this.api}`, this.queryBody)
        this.listDatas = datas
        await this.setListFilters()

        const genFilters = await Promise.all([
          this.defaultCountries.filter(ele => this.listDatas.map(ele2 => ele2.country_id).includes(ele.id)),
          this.defaultCities.filter(ele => this.listDatas.map(ele2 => ele2.city_id).includes(ele.id)),
          this.defaultDepartments.filter(ele => this.listDatas.map(ele2 => ele2.department_id).includes(ele.id))
        ])
        if (this.queryBody.filterCountries.length === 0) {
          this.countries = genFilters[0]
        }
        if (this.queryBody.filterCities.length === 0) {
          this.cities = genFilters[1]
        }
        if (this.queryBody.filterDepartments.length === 0) {
          this.departments = genFilters[2]
        }
      } catch (e) {
        this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
      } finally {
        this.$overlay.hide()
        this.fetching = false
      }
    },
    resetExpansions () {
      if (this.queryBody.filterCountries.length === 0) {
        this.expansions.country = null
      }
      if (this.queryBody.filterCities.length === 0) {
        this.expansions.city = null
      }
      if (this.queryBody.filterDepartments.length === 0) {
        this.expansions.department = null
      }
      if (this.queryBody.filterMinBudget === null && this.queryBody.filterMaxBudget === null) {
        this.expansions.budget = null
      }
    },
    async clearAllFilters () {
      this.queryBody.filterCountries = []
      this.queryBody.filterCities = []
      this.queryBody.filterDepartments = []
      this.queryBody.filterMinBudget = null
      this.queryBody.filterMaxBudget = null
      await this.fetchData()
    },
    async clearCountries () {
      this.queryBody.filterCountries = []
      await this.fetchData()
    },
    async clearCities () {
      this.queryBody.filterCities = []
      await this.fetchData()
    },
    async clearDepartments () {
      this.queryBody.filterDepartments = []
      await this.fetchData()
    },
    async clearBudget () {
      this.queryBody.filterMinBudget = null
      this.queryBody.filterMaxBudget = null
      await this.fetchData()
    },
    setListFilters () {
      this.filters.page = 1
      let listFilters = this.$_.orderBy(this.listDatas, ['name'], ['asc'])
      if (this.filters.search) {
        const search = this.filters.search
        listFilters = listFilters.filter((item) => {
          return [
            this.$findSome(search, item.name)
          ].some(ele => ele)
        })
      }
      this.listFilters = listFilters
    },
    clearFundingOrganization () {
      this.fundingOrganization = null
    },
    clearSearch () {
      this.listDatas = null
      this.clearFundingOrganization()
    },
    async showFundingOrganization (id) {
      this.$vuetify.goTo(0)
      try {
        const data = await this.$axios.$get(`${this.apiPath}${this.apiFundingOrganization}/${id}`)
        this.fundingOrganization = data
        const recommendations = await this.$axios.$get(`${this.apiPath}${this.api}/${id}/recommendations?size=12`)
        this.recommendations = recommendations
      } catch (e) {
        this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hero-image {
  background: linear-gradient(to left, #d6d6e6 0%, #f0f0f5 100%);
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
}
.funding-profile {
  background: linear-gradient(to right, #f5f2ff 0%, #FFF 100%);
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
}
.funding-profile-sm{
  background-color: #f5f2ff;
}
.search-panel {
  background-color: #F7F7F7;
}

.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > td:not(.v-data-table__mobile-row), .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > th:not(.v-data-table__mobile-row){
    border-bottom: none;
}
.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th{
    border-bottom: none;
}
</style>
