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
                  :label="`${$t('SEARCH')} Training Course name`"
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
      <div v-if="trainingCourse" class="pt-5 pb-16">
        <v-container :class="{ 'px-8': ['sm', 'xs'].includes($vuetify.breakpoint.name)}">
          <v-btn small plain color="grey" class="mb-1" @click="clearTrainingCourse">
            <v-icon class="mr-1" small>
              fas fa-chevron-left
            </v-icon>

            Back
          </v-btn>

          <div :class="['d-flex mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column-reverse align-center training-profile-sm pt-10' : 'training-profile justify-space-between align-start']">
            <div class="py-8 px-12 flex-grow-1">
              <p class="title font-weight-bold mb-0">
                {{ trainingCourse.name }}
              </p>
              <div class="d-flex align-center mb-4">
                <v-chip class="mr-2" label>
                  {{ trainingFormats[trainingCourse.format] }}
                </v-chip>
                <p class="grey--text text--darken-2 body-1  mb-0">
                  {{ trainingCourse.instructor_name }}
                </p>
              </div>
              <div v-if="trainingCourse.description" class="my-6">
                <div class="ck-content" v-html="trainingCourse.description" />
              </div>
              <p>
                Place:
                {{ trainingCourse.University.name }},
                {{ trainingCourse.Country.name }}
                <span v-if="trainingCourse.place" class="caption grey--text">
                  <br>
                  {{ trainingCourse.place }}
                </span>
              </p>
              <p>
                Schedule:
                Start at
                {{ $dateText(trainingCourse.start_date,'medium','short') }}
                <span v-if="trainingCourse.detail_date" class="caption grey--text">
                  <br>
                  {{ trainingCourse.detail_date }}
                </span>
              </p>
            </div>
            <v-img v-if="trainingCourse.Img" :src="trainingCourse.Img.url" contain max-width="300" class="flex-shrink-0 align-self-center" />
          </div>

          <div v-if="recommendations && recommendations.length > 0" class="mt-12">
            <p class="title themeAccent--text mb-0">
              Recommended Training Course
            </p>
            <p>
              This section of the platform recommends Training Course with place type similar to the course you are interested in. And you can click on the name of the course you are interested in to view their course details.
            </p>
            <v-divider class="mb-6" />
            <v-row class="px-3">
              <v-col
                v-for="item in recommendations"
                :key="`recommendation-training-course-${item.id}-${item.row}`"
                cols="12"
                sm="12"
                md="6"
                lg="4"
                xl="4"
              >
                <cards-training :item="item" @show="showTrainingCourse" />
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
                          <v-expansion-panels v-model="expansions.format" accordion flat>
                            <v-expansion-panel :readonly="queryBody.filterFormats.length > 0">
                              <v-expansion-panel-header class="px-0">
                                <div class="d-flex justify-space-between align-baseline">
                                  <p class="mb-0 body-1 font-weight-bold">
                                    Format
                                  </p>
                                  <v-btn
                                    v-if="queryBody.filterFormats.length > 0"
                                    small
                                    class="mr-1"
                                    text
                                    color="themePrimary"
                                    @click="clearFormats"
                                  >
                                    Clear
                                  </v-btn>
                                </div>
                              </v-expansion-panel-header>
                              <v-expansion-panel-content class="mx-n6">
                                <v-autocomplete
                                  v-model="queryBody.filterFormats"
                                  :items="formats"
                                  multiple
                                  outlined
                                  placeholder="Select Format"
                                  class="rounded-lg"
                                  hide-details
                                  dense
                                />
                              </v-expansion-panel-content>
                            </v-expansion-panel>
                          </v-expansion-panels>
                        </v-col>
                        <!-- <v-col cols="12" md="3">
                          <v-expansion-panels v-model="expansions.organizationType" accordion flat>
                            <v-expansion-panel :readonly="queryBody.filterOrganizationTypes.length > 0">
                              <v-expansion-panel-header class="px-0">
                                <div class="d-flex justify-space-between align-baseline">
                                  <p class="mb-0 body-1 font-weight-bold">
                                    Organization Type
                                  </p>
                                  <v-btn
                                    v-if="queryBody.filterOrganizationTypes.length > 0"
                                    small
                                    class="mr-1"
                                    text
                                    color="themePrimary"
                                    @click="clearOrganizationTypes"
                                  >
                                    Clear
                                  </v-btn>
                                </div>
                              </v-expansion-panel-header>
                              <v-expansion-panel-content class="mx-n6">
                                <v-autocomplete
                                  v-model="queryBody.filterOrganizationTypes"
                                  :items="organizationTypes"
                                  multiple
                                  outlined
                                  item-text="name"
                                  item-value="id"
                                  placeholder="Select Organization Types"
                                  class="rounded-lg"
                                  hide-details
                                  dense
                                />
                              </v-expansion-panel-content>
                            </v-expansion-panel>
                          </v-expansion-panels>
                        </v-col> -->
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
                          <v-expansion-panels v-model="expansions.university" accordion flat>
                            <v-expansion-panel :readonly="queryBody.filterUniversities.length > 0">
                              <v-expansion-panel-header class="px-0">
                                <div class="d-flex justify-space-between align-baseline">
                                  <p class="mb-0 body-1 font-weight-bold">
                                    Organization
                                  </p>
                                  <v-btn
                                    v-if="queryBody.filterUniversities.length > 0"
                                    small
                                    class="mr-1"
                                    text
                                    color="themePrimary"
                                    @click="clearUniversities"
                                  >
                                    Clear
                                  </v-btn>
                                </div>
                              </v-expansion-panel-header>
                              <v-expansion-panel-content class="mx-n6">
                                <v-autocomplete
                                  v-model="queryBody.filterUniversities"
                                  :items="universities"
                                  multiple
                                  outlined
                                  item-text="name"
                                  item-value="id"
                                  placeholder="Select Universities"
                                  class="rounded-lg"
                                  hide-details
                                  dense
                                />
                              </v-expansion-panel-content>
                            </v-expansion-panel>
                          </v-expansion-panels>
                        </v-col>

                        <v-col cols="12" md="3">
                          <v-expansion-panels v-model="expansions.cost" accordion flat>
                            <v-expansion-panel :readonly="queryBody.filterMinCost !== null || queryBody.filterMaxCost !== null">
                              <v-expansion-panel-header class="px-0">
                                <div class="d-flex justify-space-between align-baseline">
                                  <p class="mb-0 body-1 font-weight-bold">
                                    Cost
                                  </p>
                                  <v-btn
                                    v-if="queryBody.filterMinCost !== null || queryBody.filterMaxCost !== null"
                                    small
                                    class="mr-1"
                                    text
                                    color="themePrimary"
                                    @click="clearCost"
                                  >
                                    Clear
                                  </v-btn>
                                </div>
                              </v-expansion-panel-header>
                              <v-expansion-panel-content class="mx-n6">
                                <div class="d-flex align-center justify-space-between">
                                  <v-currency-field
                                    v-model="queryBody.filterMinCost"
                                    outlined
                                    class="rounded-lg"
                                    :min="minCost"
                                    :max="maxCost"
                                    :placeholder="$currencyText(minCost)"
                                    :decimal-length="0"
                                    dense
                                    hide-details
                                  />
                                  <p class="mb-0 body-1 font-weight-bold mx-3">
                                    -
                                  </p>
                                  <v-currency-field
                                    v-model="queryBody.filterMaxCost"
                                    outlined
                                    class="rounded-lg"
                                    :min="minCost"
                                    :max="maxCost"
                                    :placeholder="$currencyText(maxCost)"
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
                      :key="`training-course-${item.id}-${item.row}`"
                      cols="12"
                      sm="12"
                      md="6"
                      lg="4"
                      xl="4"
                    >
                      <cards-training :item="item" @show="showTrainingCourse" />
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
      api: 'matchings-training',
      apiTrainingCourse: 'training-courses',
      pageName: 'Training Course Search',
      listDatas: null,
      listFilters: [],
      fetching: false,
      filters: {
        page: 1,
        size: 24,
        search: ''
      },
      defaultCountries: [],
      defaultCities: [],
      defaultUniversities: [],
      defaultOrganizationTypes: [],
      formats: [],
      countries: [],
      cities: [],
      universities: [],
      organizationTypes: [],
      minCost: null,
      maxCost: null,
      expansions: {
        all: 0,
        format: null,
        country: null,
        city: null,
        university: null,
        organizationType: null,
        cost: null
      },
      queryBody: {
        search: '',
        filterFormats: [],
        filterCountries: [],
        filterCities: [],
        filterUniversities: [],
        filterOrganizationTypes: [],
        filterMinCost: null,
        filterMaxCost: null
      },
      trainingCourse: null,
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
      return this.queryBody.filterFormats.length > 0 ||
      this.queryBody.filterCountries.length > 0 ||
      this.queryBody.filterCities.length > 0 ||
      this.queryBody.filterUniversities.length > 0 ||
      this.queryBody.filterOrganizationTypes.length > 0 ||
      this.queryBody.filterMinCost !== null || this.queryBody.filterMaxCost !== null
    },
    listPages () {
      return this.listFilters.slice((this.filters.page - 1) * this.filters.size, this.filters.page * this.filters.size)
    },
    trainingFormats () {
      return this.$store.state.enums.trainingFormats
    },
    defaultFormats () {
      return this.$objToArr(this.trainingFormats)
    }
  },
  beforeMount () {
    if (!this.$store.state.setting.show_menu_resourse_training_course) {
      this.$nuxt.error({ statusCode: 404, message: 'Not Found This Page' })
    }
  },
  created () {
    this.$breadcrumbs.clear()
  },
  async mounted () {
    try {
      const datas = await Promise.all([
        this.$axios.$get(`${this.apiPath}countries-trainings`),
        this.$axios.$get(`${this.apiPath}cities-trainings`),
        this.$axios.$get(`${this.apiPath}universities-trainings`),
        this.$axios.$get(`${this.apiPath}organization-types-trainings`)
      ])
      this.defaultCountries = datas[0]
      this.defaultCities = datas[1]
      this.defaultUniversities = datas[2]
      this.defaultOrganizationTypes = datas[3]
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
  },
  methods: {
    async onSearch () {
      this.clearTrainingCourse()
      await this.clearAllFilters()
      this.minCost = Math.min(...this.listDatas.map(ele => ele.cost))
      this.maxCost = Math.max(...this.listDatas.map(ele => ele.cost))
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
          this.defaultUniversities.filter(ele => this.listDatas.map(ele2 => ele2.university_id).includes(ele.id)),
          this.defaultOrganizationTypes.filter(ele => this.listDatas.map(ele2 => ele2.organization_type_id).includes(ele.id)),
          this.defaultFormats.filter(ele => this.listDatas.map(ele2 => ele2.format).includes(ele.value))
        ])
        if (this.queryBody.filterCountries.length === 0) {
          this.countries = genFilters[0]
        }
        if (this.queryBody.filterCities.length === 0) {
          this.cities = genFilters[1]
        }
        if (this.queryBody.filterUniversities.length === 0) {
          this.universities = genFilters[2]
        }
        if (this.queryBody.filterOrganizationTypes.length === 0) {
          this.organizationTypes = genFilters[3]
        }
        if (this.queryBody.filterFormats.length === 0) {
          this.formats = genFilters[4]
        }
      } catch (e) {
        this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
      } finally {
        this.$overlay.hide()
        this.fetching = false
      }
    },
    resetExpansions () {
      if (this.queryBody.filterFormats.length === 0) {
        this.expansions.format = null
      }
      if (this.queryBody.filterCountries.length === 0) {
        this.expansions.country = null
      }
      if (this.queryBody.filterCities.length === 0) {
        this.expansions.city = null
      }
      if (this.queryBody.filterUniversities.length === 0) {
        this.expansions.university = null
      }
      if (this.queryBody.filterOrganizationTypes.length === 0) {
        this.expansions.organizationType = null
      }
      if (this.queryBody.filterMinCost === null && this.queryBody.filterMaxCost === null) {
        this.expansions.cost = null
      }
    },
    async clearAllFilters () {
      this.queryBody.filterFormats = []
      this.queryBody.filterCountries = []
      this.queryBody.filterCities = []
      this.queryBody.filterUniversities = []
      this.queryBody.filterOrganizationTypes = []
      this.queryBody.filterMinCost = null
      this.queryBody.filterMaxCost = null
      await this.fetchData()
    },
    async clearFormats () {
      this.queryBody.filterFormats = []
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
    async clearUniversities () {
      this.queryBody.filterUniversities = []
      await this.fetchData()
    },
    async clearOrganizationTypes () {
      this.queryBody.filterOrganizationTypes = []
      await this.fetchData()
    },
    async clearCost () {
      this.queryBody.filterMinCost = null
      this.queryBody.filterMaxCost = null
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
    clearTrainingCourse () {
      this.trainingCourse = null
    },
    clearSearch () {
      this.listDatas = null
      this.clearTrainingCourse()
    },
    async showTrainingCourse (id) {
      this.$vuetify.goTo(0)
      try {
        const data = await this.$axios.$get(`${this.apiPath}${this.apiTrainingCourse}/${id}`)
        this.trainingCourse = data
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
.training-profile {
  background: linear-gradient(to right, #E1FFEF 0%, #FFF 100%);
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
}
.training-profile-sm{
  background-color: #E1FFEF;
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
