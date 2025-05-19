<template>
  <client-only v-if="setting">
    <div class="">
      <div class="hero-image" :style="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'height: 270px;' : 'height: 240px;'">
        <v-container :class="['d-flex align-center h-100',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column text-center' : 'justify-space-between px-16']">
          <h1 :class="['font-weight-bold themeAccent--text',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'headline my-6' : 'display-1']">
            ASEAN TALENT POOL DASHBOARD
          </h1>
          <img src="/images/dashboard.png" :height="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 132 : 196">
        </v-container>
      </div>

      <div v-if="firstLoad" class="py-16">
        <v-container :class="{ 'px-8': ['sm', 'xs'].includes($vuetify.breakpoint.name)}">
          <p v-if="setting.show_dashboard_overview" class="headline themeAccent--text font-weight-bold">
            Overview
          </p>

          <v-row v-if="setting.show_dashboard_overview" class="">
            <v-col cols="12" md="6">
              <div class="d-flex flex-wrap align-center justify-space-around">
                <v-card
                  outlined
                  class="rounded-lg count-card-border flex-grow-1 mx-2 mb-4"
                  :class="{ 'flex-grow-1': ['xs'].includes($vuetify.breakpoint.name)}"
                  min-width="173"
                  height="154"
                >
                  <v-card-text class="d-flex align-center flex-column themeAccent--text pt-4">
                    <v-img src="/images/talents.png" width="50" height="50" contain />
                    <h1 class="headline mt-4 font-weight-bold">
                      {{ $currencyText(countTalents) }}
                    </h1>
                    <p class="mb-0">
                      Talents
                    </p>
                  </v-card-text>
                </v-card>
                <v-card
                  outlined
                  class="rounded-lg count-card-border flex-grow-1 mx-2 mb-4"
                  :class="{ 'flex-grow-1': ['xs'].includes($vuetify.breakpoint.name)}"
                  min-width="173"
                  height="154"
                >
                  <v-card-text class="d-flex align-center flex-column themeAccent--text pt-4">
                    <v-img src="/images/keywords.png" width="50" height="50" contain />
                    <h1 class="headline mt-4 font-weight-bold">
                      {{ $currencyText(countKeywords) }}
                    </h1>
                    <p class="mb-0 ">
                      Keywords
                    </p>
                  </v-card-text>
                </v-card>
                <v-card
                  outlined
                  class="rounded-lg count-card-border flex-grow-1 mx-2 mb-4"
                  :class="{ 'flex-grow-1': ['xs'].includes($vuetify.breakpoint.name)}"
                  min-width="173"
                  height="154"
                >
                  <v-card-text class="d-flex align-center flex-column themeAccent--text pt-4">
                    <v-img src="/images/industries.png" width="50" height="50" contain />
                    <h1 class="headline mt-4 font-weight-bold">
                      {{ $currencyText(industries.length) }}
                    </h1>
                    <p class="mb-0">
                      Industries
                    </p>
                  </v-card-text>
                </v-card>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div style="height: 154px;" class="d-flex flex-column justify-space-around mb-10">
                <div :class="['xs'].includes($vuetify.breakpoint.name) ? '' : 'd-flex align-baseline'">
                  <div style="width: 120px;">
                    <p class="title mb-0 themeAccent--text font-weight-bold">
                      Talents
                    </p>
                  </div>
                  <div class="d-flex align-baseline">
                    <div class="d-flex" style="width: 135px; height: 12px">
                      <div
                        v-for="industry in industries"
                        :key="`stack-industry-${industry.domain_industry_id}`"
                        class="h-100"
                        :style="`background-color: ${industryColors[industry.name].color}; width: ${(industry.countTalents/countTalents)*100}%`"
                      />
                    </div>
                    <p class="ml-5 title mb-0 themeAccent--text font-weight-bold">
                      {{ $currencyText(countTalents) }}
                    </p>
                  </div>
                </div>
                <div :class="['xs'].includes($vuetify.breakpoint.name) ? '' : 'd-flex align-baseline'">
                  <div style="width: 120px;">
                    <p class="title mb-0 themeAccent--text font-weight-bold">
                      Keywords
                    </p>
                  </div>
                  <div class="d-flex align-baseline w-70">
                    <div class="d-flex w-100" style="height: 12px">
                      <div
                        v-for="industry in industries"
                        :key="`stack-industry-${industry.domain_industry_id}`"
                        class="h-100"
                        :style="`background-color: ${industryColors[industry.name].color}; width: ${(industry.countKeywords/countKeywords)*100}%`"
                      />
                    </div>
                    <p class="ml-5 title mb-0 themeAccent--text font-weight-bold">
                      {{ $currencyText(countKeywords) }}
                    </p>
                  </div>
                </div>
                <div :class="['xs'].includes($vuetify.breakpoint.name) ? '' : 'd-flex align-baseline'">
                  <div style="width: 120px;">
                    <p class="title mb-0 themeAccent--text font-weight-bold">
                      Industries
                    </p>
                  </div>
                  <div class="d-flex align-baseline">
                    <div class="d-flex" style="width: 36px; height: 12px">
                      <div
                        v-for="industry in industries"
                        :key="`stack-industry-${industry.domain_industry_id}`"
                        class="h-100 w-20"
                        :style="`background-color: ${industryColors[industry.name].color};`"
                      />
                    </div>
                    <p class="ml-5 title mb-0 themeAccent--text font-weight-bold">
                      {{ $currencyText(industries.length) }}
                    </p>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
          <p v-if="setting.show_dashboard_overview" class="mb-8">
            The platform showcases data on a total of {{ $currencyText(countTalents) }} ASEAN talents. These researchers have published articles sourced from the SciVal and Scopus databases, with a cumulative total of {{ $currencyText(countKeywords) }} keywords across five industries.
          </p>

          <p v-if="setting.show_dashboard_summary_industry" class="headline themeAccent--text font-weight-bold mt-16">
            Summary by industries
          </p>

          <v-slide-group
            v-if="setting.show_dashboard_summary_industry"
            show-arrows
          >
            <v-slide-item
              v-for="industry in industries"
              :key="`card-industry-${industry.domain_industry_id}`"
              class="mx-2"
            >
              <v-card
                outlined
                :min-width="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 200 : 230"
                class="rounded-lg industry-card-border"
                :style="`border-color: ${industryColors[industry.name].color};`"
              >
                <v-card-text class="d-flex align-center flex-column" :class="`${industryColors[industry.name].class}--text`">
                  <v-img :src="`/images/industries/icons/${industry.name}.png`" height="80" contain />
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
                    <v-icon left :color="industryColors[industry.name].class">
                      fas fa-user
                    </v-icon>
                    <p class="display-1 mb-0 font-weight-bold">
                      {{ $currencyText(industry.countTalents) }}
                    </p>
                  </div>
                </v-card-text>
              </v-card>
            </v-slide-item>
          </v-slide-group>
          <p v-if="setting.show_dashboard_summary_industry" class="mt-3 mb-8">
            A summary of industries where researchers have published articles, categorized under the name of organization (of Affiliation).
          </p>

          <p v-if="setting.show_dashboard_keyword" class="headline themeAccent--text font-weight-bold mt-16">
            Top 100 keywords
          </p>

          <v-card
            v-if="wordCloudKeywords && setting.show_dashboard_keyword"
            color="#FFFAE2"
            class="rounded-lg"
            elevation="0"
            height="456"
          >
            <v-card-text class="pa-2">
              <highcharts :options="wordCloudKeywords" />
            </v-card-text>
          </v-card>
          <p v-if="setting.show_dashboard_keyword" class="mt-3 mb-8">
            The source of our keyword queries from both the SciVal and Scopus databases, encompassing all publication types and categorizations by subject areas.
          </p>

          <p v-if="setting.show_dashboard_country_industry" class="headline themeAccent--text font-weight-bold mt-16">
            ASEAN Talents by country and industry
          </p>

          <v-card
            v-if="heatMapAseanTalentsByIndustries && setting.show_dashboard_country_industry"
            color="#FCECEE"
            class="rounded-lg"
            elevation="0"
          >
            <v-card-text class="pa-2">
              <highcharts :options="heatMapAseanTalentsByIndustries" />
            </v-card-text>
          </v-card>
          <p v-if="setting.show_dashboard_country_industry" class="mt-3 mb-8">
            The display of the number of ASEAN Talents is categorized based on the countries where researchers have published articles and the respective industries.
          </p>

          <p v-if="setting.show_dashboard_country" class="headline themeAccent--text font-weight-bold mt-16">
            ASEAN Talents by country
          </p>

          <v-row v-if="setting.show_dashboard_country">
            <v-col cols="12" md="8">
              <v-card
                v-if="mapTalents"
                class="rounded-lg"
                elevation="0"
                height="456"
              >
                <v-card-text class="pa-0">
                  <highcharts :constructor-type="'mapChart'" :options="mapTalents" />
                  <p v-if="mapTalentsBlank > 0" class="text-center mb-10 caption grey--text">
                    No Data :
                    <span class="font-weight-bold">
                      {{ $currencyText(mapTalentsBlank) }}
                    </span>
                  </p>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <table class="w-100 top-table rounded-lg" cellspacing="0" cellpadding="0">
                <thead>
                  <tr>
                    <th colspan="2" align="center" class="py-1">
                      <span class="title">
                        Top 10 Country
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(top10Country,index) in top10Countries" :key="`top10Country-${top10Country.name}`">
                    <td align="left" class="pl-5" :class="index===0 ? 'pt-5 pb-2' : 'py-2'">
                      <nuxt-link :to="localePath({ name: 'dashboard-slug', params: { slug: top10Country.name } })">
                        <div class="d-flex themeAccent--text">
                          <img :src="`https://flagsapi.com/${top10Country.iso2}/flat/32.png`" height="23" class="mr-1">
                          {{ top10Country.name }}
                          <v-icon v-if="index===0" right color="themeWarning">
                            fas fa-medal
                          </v-icon>
                        </div>
                      </nuxt-link>
                    </td>
                    <td align="right" class="pr-6 themeAccent--text" :class="index===0 ? 'pt-5 pb-2' : 'py-2'">
                      {{ $currencyText(top10Country.count) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </v-col>
          </v-row>
          <p v-if="setting.show_dashboard_country" class="mt-3 mb-8">
            The presentation of the number of ASEAN Talent is divided based on the countries where researchers have published articles.
          </p>

        <!-- <div v-if="aseanTalentsByCountriesAndIndustries" class="pb-16 mb-16">
          <p class="headline themeAccent--text text-center font-weight-bold mt-16">
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
        </v-container>
      </div>
    </div>
  </client-only>
</template>

<script>
export default {
  data () {
    return {
      pageName: 'DASHBOARD',
      basePath: `${process.env.baseUrl}${this.$route.fullPath}`,
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      firstLoad: false,
      industries: null,
      countTalents: 0,
      columnTalentsByIndustries: null,
      mapTalents: null,
      top10Countries: null,
      countKeywords: 0,
      wordCloudKeywords: null,
      heatMapWorldwideTalentsByIndustries: null,
      heatMapAseanTalentsByIndustries: null,
      aseanTalentsByCountriesAndIndustries: null
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
    await this.fetchData()
    this.firstLoad = true
    this.$overlay.hide()
  },
  methods: {
    async fetchData () {
      await Promise.all([
        this.$axios.$get(`${this.apiPath}talents-count`),
        this.$axios.$get(`${this.apiPath}dashboards/count-talents-group-industry?group=talent`),
        this.$axios.$get(`${this.apiPath}dashboards/count-talents-group-country?group=talent`),
        this.$axios.$get(`${this.apiPath}list-keywords-count?group=talent`),
        this.$axios.$get(`${this.apiPath}list-keywords?size=100 `),
        this.$axios.$get(`${this.apiPath}dashboards/count-talents-group-industry-country?group=talent`)
      ]).then((values) => {
        this.countTalents = values[0]
        this.industries = values[1]
        this.columnTalentsByIndustries = this.setColumnChartOptions(values[1].map(ele => [ele.name, ele.countTalents]), [])
        this.mapTalents = this.setMapOptions(values[2].filter(ele => ele.hc_key !== 'blank').map(ele => [ele.hc_key, ele.count]))
        this.mapTalentsBlank = values[2].filter(ele => ele.hc_key === 'blank').reduce((a, b) => a + (b.count || 0), 0)
        this.top10Countries = this.$_.orderBy(values[2], ['count'], 'desc').splice(0, 10)
        this.countKeywords = values[3]
        this.wordCloudKeywords = this.setWordcloudOptions(values[4].rows.map((ele) => {
          return {
            name: ele.keyword,
            weight: ele.weight
          }
        }))
        const heatmapX = this.$_.uniq(values[5].map(ele => ele.country)).sort()
        const heatmapAseanX = heatmapX.filter(ele => this.aseanCountries.includes(ele))
        const heatmapY = this.$_.uniq(values[5].map(ele => ele.industry)).sort()
        const heatmapWorldwideDatas = []
        const heatmapAseanDatas = []
        for (const [j, y] of heatmapY.entries()) {
          for (const [i, x] of heatmapX.entries()) {
            const heatmapData = []
            heatmapData.push(i)
            heatmapData.push(j)
            const data = this.$_.find(values[5], { country: x, industry: y })
            heatmapData.push(data ? data.count : 0)
            heatmapWorldwideDatas.push(heatmapData)
          }
          for (const [i, x] of heatmapAseanX.entries()) {
            const heatmapData = []
            heatmapData.push(i)
            heatmapData.push(j)
            const data = this.$_.find(values[5], { country: x, industry: y })
            heatmapData.push(data ? data.count : 0)
            heatmapAseanDatas.push(heatmapData)
          }
        }
        this.heatMapWorldwideTalentsByIndustries = this.setHeatmap(heatmapX, heatmapY, heatmapWorldwideDatas, '', '', '#0000FF')
        this.heatMapAseanTalentsByIndustries = this.setHeatmap(heatmapAseanX, heatmapY, heatmapAseanDatas)

        // const aseanTalentsByCountriesAndIndustries = {}
        // for (const data of this.$_.orderBy(values[5].filter(ele => this.aseanCountries.includes(ele.country)), ['country'], ['asc'])) {
        //   if (!aseanTalentsByCountriesAndIndustries[data.country]) {
        //     aseanTalentsByCountriesAndIndustries[data.country] = {
        //       iso2: data.iso2
        //     }
        //   }
        //   aseanTalentsByCountriesAndIndustries[data.country][data.industry] = data.count
        // }
        // this.aseanTalentsByCountriesAndIndustries = aseanTalentsByCountriesAndIndustries
      })
    },
    setMapOptions (data, chartTitle = '') {
      return {
        chart: {
          map: 'world',
          height: 430,
          backgroundColor: 'none'
        },

        title: {
          text: chartTitle,
          align: 'left',
          useHTML: true,
          style: {
            fontWeight: 'bold',
            fontSize: '14px',
            paddingTop: '5px'
          }
        },
        mapNavigation: {
          enabled: true,
          buttonOptions: {
            verticalAlign: 'bottom'
          }
        },
        // tooltip: {
        //   valueSuffix: ' Talents'
        // },
        credits: {
          enabled: false
        },
        colorAxis: {
          tickPixelInterval: 100
        },
        series: [{
          data,
          name: 'Talents',
          events: {
            click: (e) => {
              this.$router.push(this.localePath({ name: 'dashboard-slug', params: { slug: e.point.name } }))
            }
          },
          states: {
            hover: {
              color: '#713279'
            }
          },
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '{point.properties.postal}'
          }
        }]
      }
    },
    setWordcloudOptions (data, chartTitle = '') {
      return {
        chart: {
          height: 430,
          backgroundColor: 'none'
        },
        accessibility: {
          screenReaderSection: {
            beforeChartFormat: '<h5>{chartTitle}</h5>'
          }
        },
        series: [{
          type: 'wordcloud',
          rotation: 0,
          data,
          name: 'Weight',
          events: {
            click: (e) => {
              this.$router.push(this.localePath({ name: 'asean-talent-pool', query: { q: e.point.name } }))
            }
          },
          style: {
            cursor: 'pointer',
            padding: '0px',
            margin: '0px'
          }
        }],
        // tooltip: {
        //   valueSuffix: ' '
        // },
        credits: {
          enabled: false
        },
        title: {
          text: chartTitle,
          align: 'left',
          useHTML: true,
          style: {
            fontWeight: 'bold',
            fontSize: '14px',
            paddingTop: '5px'
          }
        }
      }
    },
    setBarChartOptions (data, plotColors, yAxisText = '', chartTitle = '', chartSubtitle = '', height = 350) {
      return {
        chart: {
          type: 'bar',
          height,
          backgroundColor: 'none'
        },
        title: {
          text: chartTitle,
          align: 'left',
          useHTML: true,
          style: {
            fontWeight: 'bold',
            fontSize: '14px',
            paddingTop: '5px'
          }
        },
        subtitle: {
          text: chartSubtitle
        },
        xAxis: {
          type: 'category',
          labels: {
            align: 'left',
            reserveSpace: true,
            // rotation: -60,
            useHTML: true,
            style: {
              fontSize: '12px',
              minWidth: '215px',
              textOverflow: 'ellipsis'
            }
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: yAxisText,
            align: 'high'
          },
          labels: {
            overflow: 'justify'
          }
        },
        tooltip: {
          valueSuffix: ' คน'
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          bar: {
            pointWidth: 15,
            dataLabels: {
              enabled: true
            }
          }
          // series: {
          //   color: plotColor
          // }
        },
        series: [{
          name: 'จำนวน',
          colors: plotColors,
          colorByPoint: true,
          data,
          dataLabels: {
            enabled: false,
            style: {
              fontSize: '10px'
            }
          }
        }]
      }
    },
    setColumnChartOptions (data, plotColors, yAxisText = '', chartTitle = '', chartSubtitle = '') {
      return {
        chart: {
          type: 'column',
          height: 350,
          backgroundColor: 'none'
        },
        title: {
          text: chartTitle,
          align: 'left',
          useHTML: true,
          style: {
            fontWeight: 'bold',
            fontSize: '14px',
            paddingTop: '5px'
          }
        },
        subtitle: {
          text: chartSubtitle
        },
        xAxis: {
          type: 'category',
          labels: {
            // rotation: -60,
            useHTML: true,
            style: {
              fontSize: '11px',
              maxWidth: '120px',
              textOverflow: 'ellipsis'
            }
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: yAxisText,
            align: 'high'
          },
          labels: {
            overflow: 'justify'
          }
        },

        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          bar: {
            pointWidth: 15,
            dataLabels: {
              enabled: true
            }
          }
          // series: {
          //   color: plotColor
          // }
        },
        series: [{
          name: 'Talents',
          colorByPoint: true,
          data,
          dataLabels: {
            enabled: false,
            style: {
              fontSize: '10px'
            }
          }
        }]
      }
    },
    setDonutChartOptions (data, plotColors, yAxisText = '', chartTitle = '', chartSubtitle = '') {
      return {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: 0,
          plotShadow: false,
          height: 350,
          backgroundColor: 'none'
        },
        title: {
          text: chartTitle,
          align: 'left',
          useHTML: true,
          style: {
            fontWeight: 'bold',
            fontSize: '14px',
            paddingTop: '5px'
          }
        },
        subtitle: {
          text: chartSubtitle
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: true,
              distance: -50,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color: 'white'
              }
            }
          }
        },
        series: [{
          type: 'pie',
          colors: plotColors,
          name: yAxisText,
          innerSize: '50%',
          data
        }]
      }
    },
    setHeatmap (x, y, data, chartTitle = '', chartSubtitle = '', color = '#FF0000') {
      return {

        chart: {
          type: 'heatmap',
          backgroundColor: 'none',
          plotBorderWidth: 1
        },

        title: {
          text: chartTitle,
          align: 'left',
          useHTML: true,
          style: {
            fontWeight: 'bold',
            fontSize: '14px',
            paddingTop: '5px'
          }
        },

        subtitle: {
          text: chartSubtitle
        },
        colorAxis: {
          min: 0,
          minColor: '#FFFFFF',
          maxColor: color
        },

        xAxis: {
          categories: x
        },

        yAxis: {
          categories: y,
          title: null,
          reversed: true
        },

        credits: {
          enabled: false
        },

        tooltip: {
          enabled: false
        },

        series: [{
          name: 'Sales per employee',
          borderWidth: 0,
          data,
          events: {
            click: (e) => {
              if (e.point.value > 0) {
                this.$router.push(this.localePath({ name: 'dashboard-slug', params: { slug: x[e.point.x] }, query: { industry: y[e.point.y] } }))
              }
            }
          },
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            color: '#000000'
          }
        }],

        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              yAxis: {
                labels: {
                  formatter () {
                    return this.value.charAt(0)
                  }
                }
              }
            }
          }]
        }

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
.count-card-border{
  border-width: 2px;
  border-color: #000063;
}
.top-table{
  border: 2px solid #000063;
  border-radius: 1rem;
  thead{
    background-color: #000063;
    color: white;
  }
}
.industry-card-border{
  border-width: 2px;
  border-top-width: 10px;
}
</style>
