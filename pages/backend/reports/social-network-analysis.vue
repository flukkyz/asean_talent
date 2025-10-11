<template>
  <v-container>
    <v-row justify="center" class="mb-10">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <h3 class="mr-2">
              {{ modelName }}
            </h3>
            <v-spacer />
            <v-autocomplete
              v-model="keyword"
              :items="keywords.rows"
              item-text="keyword"
              item-value="keyword"
              hide-details
              clearable
              outlined
              dense
              label="Keyword"
              @change="fetchData"
            >
              <template #item="{ item }">
                <span>
                  {{ item.keyword }}
                  <span class="caption teal--text">
                    ( {{ $currencyText(item.weight) }} )
                  </span>
                </span>
              </template>
            </v-autocomplete>
            <v-btn
              v-if="datas && datas.length > 0"
              outlined
              class="ml-2"
              color="primary"
              :loading="disabledExport"
              :disabled="disabledExport"
              @click="exportExcel"
            >
              <v-icon small class="mr-2">
                fas fa-file-excel
              </v-icon>
              Export to Excel
            </v-btn>
          </v-card-title>
          <v-divider />

          <v-card-text v-if="datas && datas.length > 0">
            <p v-if="nodes" class="primary--text text-right">
              Node: {{ nodes.length }}
              <br>
              Edge: {{ edges.length }}
            </p>
          </v-card-text>
          <highcharts v-if="datas && datas.length > 0" :options="networks" />
          <v-card-text v-else-if="keyword">
            <h3 class="text-center grey--text my-8">
              No Data
            </h3>
          </v-card-text>
          <v-card-text v-else>
            <h3 class="text-center grey--text my-8">
              Select your keyword
            </h3>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'admin'],
  data () {
    return {
      api: `${process.env.apiUrl}${process.env.apiDirectory}reports/social-network-analysis`,
      modelName: ' Social Network Analysis ',
      disabledExport: false,
      nodes: null,
      edges: null,
      keyword: '',
      keywords: [],
      networks: null,
      datas: null
    }
  },
  head () {
    return {
      title: this.modelName
    }
  },
  created () {
    this.$breadcrumbs.clear()
    this.$overlay.showLoading()
  },
  async beforeMount () {
    try {
      const data = await this.$axios.$get(`${process.env.apiUrl}${process.env.apiDirectory}list-keywords`)
      this.keywords = data
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
    this.$overlay.hide()
  },
  methods: {
    async fetchData () {
      this.networks = null
      if (this.keyword) {
        this.$overlay.showLoading()
        try {
          const dataSocialNetworkAnalysis = await this.$axios.$get(`${this.api}/${this.keyword}`)
          this.datas = dataSocialNetworkAnalysis.filter(ele => ele.name && ele.co)
          this.networks = this.socialNetworkAnalysisOptions(this.datas.map(ele => [ele.name, ele.co]))
          this.nodes = this.$_.uniq([...this.datas.map(ele => ele.name), ...this.datas.map(ele => ele.co)])
          this.edges = this.$_.uniq([...this.datas.map(ele => `${ele.name} - ${ele.co}`)])
        } catch (e) {
          console.log(e)
          this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
        }
      } else {
        this.datas = null
        this.nodes = null
        this.edges = null
      }
      this.$overlay.hide()
    },
    socialNetworkAnalysisOptions (data, chartTitle = '') {
      return {
        chart: {
          type: 'networkgraph',
          height: '100%'
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
        plotOptions: {
          networkgraph: {
            keys: ['from', 'to'],
            layoutAlgorithm: {
              enableSimulation: false,
              // friction: -0.9,
              // enableSimulation: true,
              linkLength: 33
              // integration: 'verlet',
            }
          }
        },
        series: [{
          events: {
            click: async (e) => {
              try {
                const author = await this.$axios.$get(`${process.env.apiUrl}${process.env.apiDirectory}authors/name/${e.point.id}`)
                window.open(this.localePath({ name: 'back-talent-manages-authors-id', params: { id: author.id } }), '_blank')
              } catch (err) {
                this.$notifier.showMessage({ title: 'Not Found', content: `No data found for ${e.point.id}`, color: 'warning' })
              }
            }
          },
          dataLabels: {
            enabled: true,
            linkFormat: ''
          },
          data
        }]
      }
    },
    exportExcel () {
      this.disabledExport = true
      setTimeout(() => {
        const dataWS = this.$xlsx.utils.json_to_sheet(this.datas.map((ele) => {
          return {
            Author: ele.name,
            'Co Author': ele.co
          }
        }))
        const wb = this.$xlsx.utils.book_new()
        this.$xlsx.utils.book_append_sheet(wb, dataWS)
        this.$xlsx.writeFile(wb, 'social-network-analysis-report-' + new Date().getTime() + '.xlsx')
        this.disabledExport = false
      }, 10)
    }
  }
}
</script>
