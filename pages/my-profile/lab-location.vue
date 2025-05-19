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
              <div class="mr-3" style="width: 150px;">
                <label class="body-2 font-weight-bold">Matching with</label>
                <v-autocomplete
                  v-model="queryBody.searchType"
                  :items="$objToArr(searchTypes)"
                  outlined
                  class="rounded-lg"
                  hide-details
                  dense
                />
              </div>
              <div class="flex-grow-1 mr-3">
                <v-text-field
                  v-model="queryBody.search"
                  :label="`${$t('SEARCH')} ${queryBody.searchType}`"
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
      <div v-if="labLocation" class="pt-5 pb-16">
        <v-container :class="{ 'px-8': ['sm', 'xs'].includes($vuetify.breakpoint.name)}">
          <v-btn small plain color="grey" class="mb-1" @click="clearLabLocation">
            <v-icon class="mr-1" small>
              fas fa-chevron-left
            </v-icon>

            Back
          </v-btn>

          <div :class="['d-flex mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column-reverse align-center lab-profile-sm pt-10' : 'lab-profile justify-space-between align-start']">
            <div class="py-8 px-12 flex-grow-1">
              <p class="title font-weight-bold">
                {{ labLocation.name }}
              </p>
              <p>
                {{ labLocation.University.name }}
              </p>
              <p v-if="labLocation.contact_person">
                Contact person:
                {{ labLocation.contact_person }}
              </p>
              <div class="d-flex flex-wrap">
                <a v-if="labLocation.lab_link" :href="labLocation.lab_link" target="_blank">
                  <v-tooltip top>
                    <template #activator="{ on, attrs }">
                      <v-avatar
                        v-bind="attrs"
                        color="#2385FF"
                        size="33"
                        dark
                        class="mr-3"
                        v-on="on"
                      >
                        <v-icon size="22" color="white">mdi-link-variant</v-icon>
                      </v-avatar>
                    </template>
                    <span>Lab Link</span>
                  </v-tooltip>
                </a>
                <a v-if="labLocation.email" :href="`mailto:${labLocation.email}`" target="_blank">
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
                <a v-if="labLocation.phone" :href="`telto:${labLocation.phone}`" target="_blank">
                  <v-tooltip top>
                    <template #activator="{ on, attrs }">
                      <v-avatar
                        v-bind="attrs"
                        color="#9883FD"
                        size="33"
                        dark
                        class="mr-3"
                        v-on="on"
                      >
                        <v-icon size="22" color="white">mdi-phone</v-icon>
                      </v-avatar>
                    </template>
                    <span>Phone number</span>
                  </v-tooltip>
                </a>
                <a v-if="labLocation.website" :href="labLocation.website" target="_blank">
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
            </div>
            <v-img v-if="labLocation.Img" :src="labLocation.Img.url" contain max-width="300" class="flex-shrink-0 align-self-center" />
          </div>

          <p class="font-weight-bold ml-12 mt-12">
            Equipments
          </p>
          <v-simple-table>
            <template #default>
              <thead>
                <tr>
                  <th class="body-1 text-center font-weight-bold">
                    No.
                  </th>
                  <th class="body-1 text-left font-weight-bold">
                    Equipment Name
                  </th>
                  <!-- <th class="body-1 text-center font-weight-bold">
                    Status
                  </th> -->
                  <th class="body-1 text-right font-weight-bold">
                    Service Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(machineDetail,index) in $_.orderBy(labLocation.MachineDetails,['status','name'],['asc','asc'])"
                  :key="`machineDetail-${machineDetail.id}`"
                  :class="index%2===0 ? 'lab-profile' : ''"
                  style="border: none;"
                >
                  <td class="text-center">
                    {{ index+1 }}
                  </td>
                  <td class="text-left">
                    {{ machineDetail.name }}
                  </td>
                  <!-- <td class="text-center">
                    {{ machineStatuses[machineDetail.status] }}
                  </td> -->
                  <td class="text-right">
                    {{ $currencyText(machineDetail.service_condition) }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <div v-if="recommendations && recommendations.length > 0" class="mt-12">
            <p class="title themeAccent--text mb-0">
              Recommended Lab
            </p>
            <p>
              This section of the platform recommends Lab Location with place and equipment type similar to the lab you are interested in. And you can click on the name of the lab you are interested in to view their lab details.
            </p>
            <v-divider class="mb-6" />
            <v-row class="px-3">
              <v-col
                v-for="item in recommendations"
                :key="`recommendation-lab-${item.id}-${item.row}`"
                cols="12"
                sm="12"
                md="6"
                lg="4"
                xl="4"
              >
                <cards-lab :item="item" @show="showLabLocation" />
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
                      {{ listDatas.length > 1 ? 'Labs' : 'Lab' }}
                    </p>
                  </div>
                  <v-row>
                    <v-col
                      v-for="item in listPages"
                      :key="`lab-location-${item.id}-${item.row}`"
                      cols="12"
                      sm="12"
                      md="6"
                      lg="4"
                      xl="4"
                    >
                      <cards-lab :item="item" @show="showLabLocation" />
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
  layout: 'member',
  middleware: ['authen', 'frontend'],
  data () {
    return {
      basePath: `${process.env.baseUrl}${this.$route.fullPath}`,
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      api: 'matchings-lab',
      apiLabLocation: 'lab-locations',
      pageName: 'Lab Location Search',
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
      countries: [],
      cities: [],
      universities: [],
      organizationTypes: [],
      expansions: {
        all: 0,
        country: null,
        city: null,
        university: null,
        organizationType: null
      },
      queryBody: {
        searchType: 'all',
        search: '',
        filterCountries: [],
        filterCities: [],
        filterUniversities: [],
        filterOrganizationTypes: []
      },
      labLocation: null,
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
    searchTypes () {
      return this.$store.state.enums.labSearchTypes
    },
    hasFilters () {
      return this.queryBody.filterCountries.length > 0 ||
      this.queryBody.filterCities.length > 0 ||
      this.queryBody.filterUniversities.length > 0 ||
      this.queryBody.filterOrganizationTypes.length > 0
    },
    listPages () {
      return this.listFilters.slice((this.filters.page - 1) * this.filters.size, this.filters.page * this.filters.size)
    }
  },
  beforeMount () {
    if (!this.$store.state.setting.show_menu_resourse_lab_location) {
      this.$nuxt.error({ statusCode: 404, message: 'Not Found This Page' })
    }
  },
  created () {
    this.$breadcrumbs.clear()
  },
  async mounted () {
    try {
      const datas = await Promise.all([
        this.$axios.$get(`${this.apiPath}countries-labs`),
        this.$axios.$get(`${this.apiPath}cities-labs`),
        this.$axios.$get(`${this.apiPath}universities-labs`),
        this.$axios.$get(`${this.apiPath}organization-types-labs`)
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
      this.clearLabLocation()
      await this.clearAllFilters()
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
          this.defaultOrganizationTypes.filter(ele => this.listDatas.map(ele2 => ele2.organization_type_id).includes(ele.id))
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
      if (this.queryBody.filterUniversities.length === 0) {
        this.expansions.university = null
      }
      if (this.queryBody.filterOrganizationTypes.length === 0) {
        this.expansions.organizationType = null
      }
    },
    async clearAllFilters () {
      this.queryBody.filterCountries = []
      this.queryBody.filterCities = []
      this.queryBody.filterUniversities = []
      this.queryBody.filterOrganizationTypes = []
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
    clearLabLocation () {
      this.labLocation = null
    },
    clearSearch () {
      this.listDatas = null
      this.clearLabLocation()
    },
    async showLabLocation (id) {
      this.$vuetify.goTo(0)
      try {
        const data = await this.$axios.$get(`${this.apiPath}${this.apiLabLocation}/${id}`)
        this.labLocation = data
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
.lab-profile {
  background: linear-gradient(to right, #E1FFEF 0%, #FFF 100%);
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
}
.lab-profile-sm{
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
