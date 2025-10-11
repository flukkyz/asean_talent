<template>
  <div class="">
    <div class="hero-image" :style="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'height: 270px;' : 'height: 240px;'">
      <v-container :class="['d-flex align-center h-100',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : 'justify-space-between px-16']">
        <h1 :class="['font-weight-bold themeAccent--text',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'headline my-6' : 'display-1']">
          {{ pageName }}
        </h1>
        <img src="/images/graphics/2.png" :height="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 152 : 196">
      </v-container>
    </div>
    <div class="">
      <div class="search-panel py-6">
        <v-container :class="{ 'px-8': ['sm', 'xs'].includes($vuetify.breakpoint.name)}">
          <p>
            Discover the ideal research collaborator with our Paring Search feature. This tool is designed to seamlessly connect you with researchers whose expertise and interests align with yours. Utilizing a comprehensive filter system, you can specify criteria such as university, country, or specific keywords, simplifying the process of finding partners for research projects or expanding your academic network within the ASEAN community.
          </p>
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
                  @click:clear="listDatas = null"
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
      <div v-if="listPopulars && (!listDatas || (listDatas && listDatas.length === 0)) && !hasFilters && !fetching" class="mt-5 mb-10">
        <v-container :class="{ 'px-8': ['sm', 'xs'].includes($vuetify.breakpoint.name)}">
          <p class="mb-2 themeAccent--text font-weight-bold">
            Suggestion search
          </p>
          <div class="d-flex align-baseline flex-wrap">
            <p
              v-for="(popular) in listPopulars"
              :key="`popular-${popular.id}`"
              class="themePrimary--text mb-0 font-weight-bold mr-4 pointer"
              @click="suggestionSearch(popular.keyword)"
            >
              "{{ popular.keyword }}"
            </p>
          </div>
        </v-container>
      </div>
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
            <p class="title grey--text text-center">
              Please change keyword or select our suggestion keywords.
            </p>
          </div>
          <div v-else-if="!fetching || hasFilters" :class="['d-flex align-start',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column justify-center' : '']">
            <div :class="[['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-grow-1 w-100 rounded-lg border-normal overflow-hidden mb-5' : 'flex-shrink-0 pr-5']" :style="['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'width: 260px;'">
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
                  <v-expansion-panel-content class="">
                    <v-expansion-panels v-model="expansions.university" accordion flat>
                      <v-expansion-panel :readonly="queryBody.filterUniversities.length > 0">
                        <v-expansion-panel-header class="px-0">
                          <div class="d-flex justify-space-between align-baseline">
                            <p class="mb-0 body-1 font-weight-bold">
                              University
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
                    <v-divider />

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
                    <v-divider />

                    <!-- <v-expansion-panels v-model="expansions.city" accordion flat>
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
                    <v-divider /> -->

                    <v-expansion-panels v-model="expansions.hIndex" accordion flat>
                      <v-expansion-panel :readonly="queryBody.filterMinHIndex !== null || queryBody.filterMaxHIndex !== null">
                        <v-expansion-panel-header class="px-0">
                          <div class="d-flex justify-space-between align-baseline">
                            <p class="mb-0 body-1 font-weight-bold">
                              H-index
                            </p>
                            <v-btn
                              v-if="queryBody.filterMinHIndex !== null || queryBody.filterMaxHIndex !== null"
                              small
                              class="mr-1"
                              text
                              color="themePrimary"
                              @click="clearHIndex"
                            >
                              Clear
                            </v-btn>
                          </div>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content class="mx-n6">
                          <div class="d-flex align-center justify-space-between">
                            <v-currency-field
                              v-model="queryBody.filterMinHIndex"
                              outlined
                              class="rounded-lg"
                              :min="minHIndex"
                              :max="maxHIndex"
                              :placeholder="$currencyText(minHIndex)"
                              :decimal-length="0"
                              dense
                              hide-details
                            />
                            <p class="mb-0 body-1 font-weight-bold mx-3">
                              -
                            </p>
                            <v-currency-field
                              v-model="queryBody.filterMaxHIndex"
                              outlined
                              class="rounded-lg"
                              :min="minHIndex"
                              :max="maxHIndex"
                              :placeholder="$currencyText(maxHIndex)"
                              :decimal-length="0"
                              dense
                              hide-details
                            />
                          </div>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                    <v-divider />

                    <v-expansion-panels v-model="expansions.mostRecentPub" accordion flat>
                      <v-expansion-panel :readonly="queryBody.filterMinMostRecentPub !== null || queryBody.filterMaxMostRecentPub !== null">
                        <v-expansion-panel-header class="px-0">
                          <div class="d-flex justify-space-between align-baseline">
                            <p class="mb-0 body-1 font-weight-bold">
                              Most recent publication
                            </p>
                            <v-btn
                              v-if="queryBody.filterMinMostRecentPub !== null || queryBody.filterMaxMostRecentPub !== null"
                              small
                              class="mr-1"
                              text
                              color="themePrimary"
                              @click="clearMostRecentPub"
                            >
                              Clear
                            </v-btn>
                          </div>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content class="mx-n6">
                          <div class="d-flex align-center justify-space-between">
                            <v-currency-field
                              v-model="queryBody.filterMinMostRecentPub"
                              outlined
                              class="rounded-lg"
                              :min="minMostRecentPub"
                              :max="maxMostRecentPub"
                              :placeholder="$currencyText(minMostRecentPub)"
                              :decimal-length="0"
                              dense
                              hide-details
                            />
                            <p class="mb-0 body-1 font-weight-bold mx-3">
                              -
                            </p>
                            <v-currency-field
                              v-model="queryBody.filterMaxMostRecentPub"
                              outlined
                              class="rounded-lg"
                              :min="minMostRecentPub"
                              :max="maxMostRecentPub"
                              :placeholder="$currencyText(maxMostRecentPub)"
                              :decimal-length="0"
                              dense
                              hide-details
                            />
                          </div>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                    <v-divider />

                    <v-expansion-panels v-model="expansions.documentCount" accordion flat>
                      <v-expansion-panel :readonly="queryBody.filterMinDocumentCount !== null || queryBody.filterMaxDocumentCount !== null">
                        <v-expansion-panel-header class="px-0">
                          <div class="d-flex justify-space-between align-baseline">
                            <p class="mb-0 body-1 font-weight-bold">
                              Document count
                            </p>
                            <v-btn
                              v-if="queryBody.filterMinDocumentCount !== null || queryBody.filterMaxDocumentCount !== null"
                              small
                              class="mr-1"
                              text
                              color="themePrimary"
                              @click="clearDocumentCount"
                            >
                              Clear
                            </v-btn>
                          </div>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content class="mx-n6">
                          <div class="d-flex align-center justify-space-between">
                            <v-currency-field
                              v-model="queryBody.filterMinDocumentCount"
                              outlined
                              class="rounded-lg"
                              :min="minDocumentCount"
                              :max="maxDocumentCount"
                              :placeholder="$currencyText(minDocumentCount)"
                              :decimal-length="0"
                              dense
                              hide-details
                            />
                            <p class="mb-0 body-1 font-weight-bold mx-3">
                              -
                            </p>
                            <v-currency-field
                              v-model="queryBody.filterMaxDocumentCount"
                              outlined
                              class="rounded-lg"
                              :min="minDocumentCount"
                              :max="maxDocumentCount"
                              :placeholder="$currencyText(maxDocumentCount)"
                              :decimal-length="0"
                              dense
                              hide-details
                            />
                          </div>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                    <v-divider />

                    <v-expansion-panels v-model="expansions.noOfCoAuthor" accordion flat>
                      <v-expansion-panel :readonly="queryBody.filterMinNoOfCoAuthor !== null || queryBody.filterMaxNoOfCoAuthor !== null">
                        <v-expansion-panel-header class="px-0">
                          <div class="d-flex justify-space-between align-baseline">
                            <p class="mb-0 body-1 font-weight-bold">
                              No. of Co-Author
                            </p>
                            <v-btn
                              v-if="queryBody.filterMinNoOfCoAuthor !== null || queryBody.filterMaxNoOfCoAuthor !== null"
                              small
                              class="mr-1"
                              text
                              color="themePrimary"
                              @click="clearNoOfCoAuthor"
                            >
                              Clear
                            </v-btn>
                          </div>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content class="mx-n6">
                          <div class="d-flex align-center justify-space-between">
                            <v-currency-field
                              v-model="queryBody.filterMinNoOfCoAuthor"
                              outlined
                              class="rounded-lg"
                              :min="minNoOfCoAuthor"
                              :max="maxNoOfCoAuthor"
                              :placeholder="$currencyText(minNoOfCoAuthor)"
                              :decimal-length="0"
                              dense
                              hide-details
                            />
                            <p class="mb-0 body-1 font-weight-bold mx-3">
                              -
                            </p>
                            <v-currency-field
                              v-model="queryBody.filterMaxNoOfCoAuthor"
                              outlined
                              class="rounded-lg"
                              :min="minNoOfCoAuthor"
                              :max="maxNoOfCoAuthor"
                              :placeholder="$currencyText(maxNoOfCoAuthor)"
                              :decimal-length="0"
                              dense
                              hide-details
                            />
                          </div>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                    <v-divider />

                    <v-expansion-panels v-model="expansions.gender" accordion flat>
                      <v-expansion-panel :readonly="queryBody.filterGenders.length > 0">
                        <v-expansion-panel-header class="px-0">
                          <div class="d-flex justify-space-between align-baseline">
                            <div class="d-flex align-baseline">
                              <p class="mb-0 body-1 font-weight-bold">
                                Gender
                              </p>
                              <v-tooltip top max-width="300">
                                <template #activator="{ on, attrs }">
                                  <v-icon
                                    right
                                    v-bind="attrs"
                                    color="info"
                                    v-on="on"
                                  >
                                    mdi-information-slab-circle-outline
                                  </v-icon>
                                </template>
                                <span>Selecting gender is part of the researcher data search process, to help researchers conveniently find information according to their interests.
                                </span>
                              </v-tooltip>
                            </div>
                            <v-btn
                              v-if="queryBody.filterGenders.length > 0"
                              small
                              class="mr-1"
                              text
                              color="themePrimary"
                              @click="clearGenders"
                            >
                              Clear
                            </v-btn>
                          </div>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content class="mx-n6">
                          <v-autocomplete
                            v-model="queryBody.filterGenders"
                            :items="genders"
                            multiple
                            outlined
                            placeholder="Select Gender"
                            class="rounded-lg"
                            hide-details
                            dense
                          />
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                    <v-divider />
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
                    {{ listDatas.length > 1 ? 'Talents' : 'Talent' }}
                  </p>
                </div>
                <v-row>
                  <v-col
                    v-for="item in listPages"
                    :key="`talent-${item.id}-${item.row}`"
                    cols="12"
                    sm="6"
                    md="6"
                    lg="6"
                    xl="4"
                  >
                    <v-card class="rounded-lg overflow-hidden" outlined style="border-width: 2px;">
                      <v-card-text class="pa-0">
                        <div class="d-flex justify-space-between mt-2 mr-n1">
                          <div class="w-100 mt-2 ml-4 pointer" @click="showScopusTalentProfile(item.id)">
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
                          <a v-if="item.scopus" :href="`${apiPath}${apiPool}/talent/scopus/${item.id}`" target="_blank">
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
                          <a v-if="item.research_gate" :href="`${apiPath}${apiPool}/talent/research_gate/${item.id}`" target="_blank">
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
                          <a v-if="item.linkedin" :href="`${apiPath}${apiPool}/talent/linkedin/${item.id}`" target="_blank">
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
                          <a v-if="item.link_tnrr" :href="`${apiPath}${apiPool}/talent/link_tnrr/${item.id}`" target="_blank">
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
</template>

<script>
export default {
  data () {
    return {
      basePath: `${process.env.baseUrl}${this.$route.fullPath}`,
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      api: 'matchings',
      apiPool: 'pools',
      pageName: 'Paring search',
      listPopulars: null,
      listDatas: null,
      listFilters: [],
      fetching: false,
      filters: {
        page: 1,
        size: 24,
        search: ''
      },
      defaultGenders: ['Male', 'Female'],
      defaultCountries: [],
      defaultCities: [],
      defaultUniversities: [],
      genders: [],
      countries: [],
      cities: [],
      universities: [],
      minHIndex: null,
      maxHIndex: null,
      minMostRecentPub: null,
      maxMostRecentPub: null,
      minDocumentCount: null,
      maxDocumentCount: null,
      minNoOfCoAuthor: null,
      maxNoOfCoAuthor: null,
      expansions: {
        all: 0,
        gender: null,
        country: null,
        city: null,
        university: null,
        hIndex: null,
        mostRecentPub: null,
        documentCount: null,
        noOfCoAuthor: null
      },
      queryBody: {
        searchType: 'all',
        search: '',
        filterGenders: [],
        filterCountries: [],
        filterCities: [],
        filterUniversities: [],
        filterMinHIndex: null,
        filterMaxHIndex: null,
        filterMinMostRecentPub: null,
        filterMaxMostRecentPub: null,
        filterMinDocumentCount: null,
        filterMaxDocumentCount: null,
        filterMinNoOfCoAuthor: null,
        filterMaxNoOfCoAuthor: null
      }
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
    searchTypes () {
      return this.$store.state.enums.talentSearchTypes
    },
    hasFilters () {
      return this.queryBody.filterGenders.length > 0 ||
      this.queryBody.filterCountries.length > 0 ||
      this.queryBody.filterCities.length > 0 ||
      this.queryBody.filterUniversities.length > 0 ||
      this.queryBody.filterMinHIndex !== null || this.queryBody.filterMaxHIndex !== null
    },
    listPages () {
      return this.listFilters.slice((this.filters.page - 1) * this.filters.size, this.filters.page * this.filters.size)
    }
  },
  beforeMount () {
    if (!this.$store.state.setting.show_menu_paring_search) {
      this.$nuxt.error({ statusCode: 404, message: 'Not Found This Page' })
    }
  },
  created () {
    this.$breadcrumbs.clear()
  },
  async mounted () {
    try {
      const datas = await Promise.all([
        this.$axios.$get(`${this.apiPath}list-keywords-popular?size=10&group=talent`),
        this.$axios.$get(`${this.apiPath}countries-talents`),
        this.$axios.$get(`${this.apiPath}cities-talents`),
        this.$axios.$get(`${this.apiPath}universities-talents`)
      ])
      this.listPopulars = datas[0].rows
      this.defaultCountries = datas[1]
      this.defaultCities = datas[2]
      this.defaultUniversities = datas[3]
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
  },
  methods: {
    async onSearch () {
      await this.clearAllFilters()
      this.minHIndex = Math.min(...this.listDatas.map(ele => ele.h_index))
      this.maxHIndex = Math.max(...this.listDatas.map(ele => ele.h_index))
      this.minMostRecentPub = Math.min(...this.listDatas.map(ele => ele.most_recent_pub))
      this.maxMostRecentPub = Math.max(...this.listDatas.map(ele => ele.most_recent_pub))
      this.minDocumentCount = Math.min(...this.listDatas.map(ele => ele.document_count))
      this.maxDocumentCount = Math.max(...this.listDatas.map(ele => ele.document_count))
      this.minNoOfCoAuthor = Math.min(...this.listDatas.map(ele => ele.no_of_coauthor))
      this.maxNoOfCoAuthor = Math.max(...this.listDatas.map(ele => ele.no_of_coauthor))
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
          this.defaultGenders.filter(ele => this.listDatas.map(ele2 => ele2.gender).includes(ele)),
          this.defaultCountries.filter(ele => this.listDatas.map(ele2 => ele2.country_id).includes(ele.id)),
          this.defaultCities.filter(ele => this.listDatas.map(ele2 => ele2.city_id).includes(ele.id)),
          this.defaultUniversities.filter(ele => this.listDatas.map(ele2 => ele2.university_id).includes(ele.id))
        ])
        if (this.queryBody.filterGenders.length === 0) {
          this.genders = genFilters[0]
        }
        if (this.queryBody.filterCountries.length === 0) {
          this.countries = genFilters[1]
        }
        if (this.queryBody.filterCities.length === 0) {
          this.cities = genFilters[2]
        }
        if (this.queryBody.filterUniversities.length === 0) {
          this.universities = genFilters[3]
        }
      } catch (e) {
        this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
      } finally {
        this.$overlay.hide()
        this.fetching = false
      }
    },
    resetExpansions () {
      if (this.queryBody.filterGenders.length === 0) {
        this.expansions.gender = null
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
      if (this.queryBody.filterMinHIndex === null && this.queryBody.filterMaxHIndex === null) {
        this.expansions.hIndex = null
      }
      if (this.queryBody.filterMinMostRecentPub === null && this.queryBody.filterMaxMostRecentPub === null) {
        this.expansions.mostRecentPub = null
      }
      if (this.queryBody.filterMinDocumentCount === null && this.queryBody.filterMaxDocumentCount === null) {
        this.expansions.documentCount = null
      }
      if (this.queryBody.filterMinNoOfCoAuthor === null && this.queryBody.filterMaxNoOfCoAuthor === null) {
        this.expansions.noOfCoAuthor = null
      }
    },
    async clearAllFilters () {
      this.queryBody.filterGenders = []
      this.queryBody.filterCountries = []
      this.queryBody.filterCities = []
      this.queryBody.filterUniversities = []
      this.queryBody.filterMinHIndex = null
      this.queryBody.filterMaxHIndex = null
      this.queryBody.filterMinMostRecentPub = null
      this.queryBody.filterMaxMostRecentPub = null
      this.queryBody.filterMinDocumentCount = null
      this.queryBody.filterMaxDocumentCount = null
      this.queryBody.filterMinNoOfCoAuthor = null
      this.queryBody.filterMaxNoOfCoAuthor = null
      await this.fetchData()
    },
    async clearGenders () {
      this.queryBody.filterGenders = []
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
    async clearHIndex () {
      this.queryBody.filterMinHIndex = null
      this.queryBody.filterMaxHIndex = null
      await this.fetchData()
    },
    async clearMostRecentPub () {
      this.queryBody.filterMinMostRecentPub = null
      this.queryBody.filterMaxMostRecentPub = null
      await this.fetchData()
    },
    async clearDocumentCount () {
      this.queryBody.filterMinDocumentCount = null
      this.queryBody.filterMaxDocumentCount = null
      await this.fetchData()
    },
    async clearNoOfCoAuthor () {
      this.queryBody.filterMinNoOfCoAuthor = null
      this.queryBody.filterMaxNoOfCoAuthor = null
      await this.fetchData()
    },
    setListFilters () {
      this.filters.page = 1
      let listFilters = this.$_.orderBy(this.listDatas, ['h_index', 'country'], ['desc', 'asc'])
      if (this.filters.search) {
        const search = this.filters.search
        listFilters = listFilters.filter((item) => {
          return [
            this.$findSome(search, item.firstname),
            this.$findSome(search, item.lastname)
          ].some(ele => ele)
        })
      }
      this.listFilters = listFilters
    },
    showScopusTalentProfile (id) {
      if (this.$auth.loggedIn) {
        this.$router.push(this.localePath({ name: 'my-profile-paring-search', query: { q: this.queryBody.search, id } }))
      } else {
        this.$notifier.showMessage({ title: 'Member only', content: 'Please, sign in for view ASEAN Talent profile', color: 'info' })
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
.search-panel {
  background-color: #F7F7F7;
}
</style>
