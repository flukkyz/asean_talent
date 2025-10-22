<template>
  <v-container>
    <v-row justify="center" class="mb-10">
      <v-col cols="12">
        <v-card v-if="listDatas">
          <v-card-title>
            <h3 class="mr-2">
              {{ modelName }} Report
            </h3>
            <v-card-title class="flex-nowrap">
              <v-autocomplete
                v-model="queryParams.industry"
                :items="industries"
                class="mx-2"
                item-text="name"
                item-value="name"
                hide-details
                outlined
                :disabled="industries.length === 0"
                clearable
                dense
                label="Industry"
                @change="onSearch"
              />
            </v-card-title>

            <v-spacer />
            <div class="d-flex">
              <v-btn-toggle v-model="showFilters">
                <v-btn small class="pt-5 pb-4 mr-3">
                  <v-icon small>
                    fas fa-filter
                  </v-icon>
                </v-btn>
              </v-btn-toggle>
              <v-btn
                v-if="listDatas.totalItems > 0"
                outlined
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
            </div>
          </v-card-title>
          <v-divider />
          <v-card-title v-if="showFilters === 0">
            <p class="caption grey--text mb-0">
              Show Columns
            </p>
            <v-chip-group
              v-model="showColumns"
              column
              multiple
            >
              <v-chip
                v-for="tableHeader in tableHeaders"
                :key="tableHeader.value"
                filter
                outlined
              >
                {{ tableHeader.text }}
              </v-chip>
            </v-chip-group>
          </v-card-title>
          <v-divider />

          <!-- <v-card-title class="py-0">
            <v-text-field
              v-model="filters.keyword"
              label="Keyword filter..."
              class="mr-2"
              outlined
              dense
            />
            <v-text-field
              v-model="filters.application"
              label="Application filter..."
              class="ml-2"
              outlined
              dense
            />
          </v-card-title> -->
          <v-divider />
          <v-data-table
            ref="dataTable"
            dense
            disable-pagination
            hide-default-footer
            :headers="tableHeaders.filter((ele,i) => {return showColumns.includes(i)})"
            :items="listDatas.rows"
          >
            <template #[`item.link_scopus`]="{ item }">
              <a
                v-if="item.scopus_id"
                :href="`https://www.scopus.com/authid/detail.url?authorId=${item.scopus_id}`"
                target="_blank"
              >
                <v-btn
                  x-small
                  text
                  color="info"
                >
                  Link to Scopus
                </v-btn>
              </a>
            </template>
            <template #[`item.link_linkedin`]="{ item }">
              <a
                v-if="item.Talent.link_linkedin"
                :href="`https://${item.Talent.link_linkedin.replace('https://', '')}`"
                target="_blank"
              >
                <v-btn
                  x-small
                  text
                  color="info"
                >
                  Link to Linkedin
                </v-btn>
              </a>
            </template>
            <template #[`item.research_gate`]="{ item }">
              <a
                v-if="item.Talent.research_gate"
                :href="`https://${item.Talent.research_gate.replace('https://', '')}`"
                target="_blank"
              >
                <v-btn
                  x-small
                  text
                  color="info"
                >
                  Link to Research Gate
                </v-btn>
              </a>
            </template>
            <template #[`item.link_tnrr`]="{ item }">
              <a
                v-if="item.Talent.link_tnrr"
                :href="`https://${item.Talent.link_tnrr.replace('https://', '')}`"
                target="_blank"
              >
                <v-btn
                  x-small
                  text
                  color="info"
                >
                  Link to TNRR
                </v-btn>
              </a>
            </template>
            <template #[`item.name`]="{ item }">
              {{ `${item.Talent.lastname}, ${item.Talent.firstname}` }}
            </template>
            <template #[`item.group`]="{ item }">
              {{ $store.state.enums.talentGroups[item.Talent.talent_group] }}
            </template>
            <template #[`item.university`]="{ item }">
              {{ `${item.Talent.University.name.substring(0,20)}...` }}
            </template>
            <template #[`item.keyword`]="{ item }">
              {{ `${$_.uniq([...item.Keywords.map(ele => ele.keyword)]).join(': ').substring(0,20)}...` }}
            </template>
          </v-data-table>
          <v-divider v-if="listDatas.totalItems > 0" />
          <v-card-text v-if="listDatas.totalItems > 0" class="py-1">
            <div class="float-right">
              <v-pagination
                v-if="listDatas.totalPages > 1"
                v-model="queryParams.page"
                :length="listDatas.totalPages"
                :total-visible="5"
                @input="$fetch()"
              />
            </div>
            <p class="mt-3">
              {{ listDatas.totalItems }}
              {{ listDatas.totalItems > 1 ? 'Items' : 'item' }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'country_admin'],
  data () {
    return {
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      modelName: ' Scopus ',
      disabledExport: false,
      queryParams: {
        size: 50,
        industry: '',
        page: 1
      },
      industries: [],
      listDatas: null,
      showFilters: null,
      showColumns: [],
      tableHeaders: [
        {
          text: 'Industry',
          class: 'text-center',
          cellClass: 'text-center',
          sortable: false,
          value: 'domain_industry'
        },
        {
          text: 'Name',
          sortable: false,
          value: 'name'
        },
        {
          text: 'Gender',
          class: 'text-center',
          cellClass: 'text-center',
          sortable: false,
          value: 'Talent.gender'
        },
        {
          text: 'Religion',
          sortable: false,
          value: 'Talent.Religion.name'
        },
        {
          text: 'Domicile',
          sortable: false,
          value: 'Talent.Domicile.name'
        },
        {
          text: 'University',
          sortable: false,
          value: 'university'
        },
        {
          text: 'City',
          sortable: false,
          value: 'Talent.City.name'
        },
        {
          text: 'Country',
          sortable: false,
          value: 'Talent.Country.name'
        },
        {
          text: 'Group',
          sortable: false,
          value: 'group'
        },
        {
          text: 'H-index',
          class: 'text-center',
          cellClass: 'text-center',
          sortable: false,
          value: 'h_index'
        },
        {
          text: 'Keyword',
          sortable: false,
          value: 'keyword'
        },
        {
          text: 'FWCI',
          class: 'text-center',
          cellClass: 'text-center',
          sortable: false,
          value: 'fwci'
        },
        {
          text: 'Scholarly Output',
          class: 'text-center',
          cellClass: 'text-center',
          sortable: false,
          value: 'scholarly_output'
        },
        {
          text: 'Most Recent Publication',
          class: 'text-center',
          cellClass: 'text-center',
          sortable: false,
          value: 'most_recent_pub'
        },
        {
          text: 'Citation',
          class: 'text-center',
          cellClass: 'text-center',
          sortable: false,
          value: 'citation'
        },
        {
          text: 'Citation per Publication',
          class: 'text-center',
          cellClass: 'text-center',
          sortable: false,
          value: 'citation_per_pub'
        },
        {
          text: 'Citation Count',
          class: 'text-center',
          cellClass: 'text-center',
          sortable: false,
          value: 'citation_count'
        },
        {
          text: 'Cited by Count',
          class: 'text-center',
          cellClass: 'text-center',
          sortable: false,
          value: 'cited_by_count'
        },
        {
          text: 'Document Count',
          class: 'text-center',
          cellClass: 'text-center',
          sortable: false,
          value: 'document_count'
        },
        {
          text: 'Number of Co Author',
          class: 'text-center',
          cellClass: 'text-center',
          sortable: false,
          value: 'no_of_coauthor'
        },
        {
          text: 'Phone Number',
          sortable: false,
          value: 'Talent.phone_number'
        },
        {
          text: 'E-mail',
          sortable: false,
          value: 'Talent.email'
        },
        {
          text: 'Scopus ID',
          class: 'text-center',
          cellClass: 'text-center',
          sortable: false,
          value: 'scopus_id'
        },
        {
          text: 'Link to Scopus',
          class: 'text-center',
          cellClass: 'text-center',
          sortable: false,
          value: 'link_scopus'
        },
        {
          text: 'Linkedin',
          class: 'text-center',
          cellClass: 'text-center',
          sortable: false,
          value: 'link_linkedin'
        },
        {
          text: 'Research Gate',
          class: 'text-center',
          cellClass: 'text-center',
          sortable: false,
          value: 'research_gate'
        }
        // {
        //   text: 'TNRR',
        //   class: 'text-center',
        //   cellClass: 'text-center',
        //   sortable: false,
        //   value: 'link_tnrr'
        // }
      ]
    }
  },
  async fetch () {
    this.queryParams = {
      ...this.queryParams,
      ...this.$route.query,
      talent: 1
    }
    if (!this.queryParams.industry) {
      this.queryParams.industry = ''
    }
    const searchParams = new URLSearchParams(this.queryParams).toString()
    try {
      const datas = await this.$axios.$get(`${this.apiPath}scopuses${(searchParams ? '?' + searchParams : '')}`)
      this.listDatas = datas
      if (this.queryParams.page > this.listDatas.totalPages && this.listDatas.totalPages > 0) {
        this.queryParams.page = this.listDatas.totalPages
        this.$fetch()
      }
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
  },
  head () {
    return {
      title: `${this.modelName} Report`
    }
  },
  created () {
    this.$breadcrumbs.clear()
  },
  async beforeMount () {
    this.showColumns = this.tableHeaders.map((ele, i) => i)
    try {
      const dataIndustries = await this.$axios.$get(`${process.env.apiUrl}${process.env.apiDirectory}domain-industries`)
      this.industries = dataIndustries.rows
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
  },
  methods: {
    onSearch () {
      this.queryParams.page = 1
      this.$fetch()
    },
    async exportExcel () {
      this.disabledExport = true
      if (!this.queryParams.industry) {
        this.queryParams.industry = ''
      }
      const searchParams = new URLSearchParams({
        ...this.queryParams,
        size: 9999999,
        page: 1
      }).toString()
      try {
        const datas = await this.$axios.$get(`${this.apiPath}scopuses${(searchParams ? '?' + searchParams : '')}`)
        const dataWS = this.$xlsx.utils.json_to_sheet(datas.rows.map((ele) => {
          const newData = {
            Industry: ele.domain_industry,
            Name: `${ele.Talent.lastname}, ${ele.Talent.firstname}`,
            Gender: ele.Talent.gender,
            Religion: ele.Talent.Religion ? ele.Talent.Religion.name : '',
            Domicile: ele.Talent.Domicile ? ele.Talent.Domicile.name : '',
            University: ele.Talent.University ? ele.Talent.University.name : '',
            City: ele.Talent.City ? ele.Talent.City.name : '',
            Country: ele.Talent.Country ? ele.Talent.Country.name : '',
            Group: this.$store.state.enums.talentGroups[ele.Talent.talent_group],
            'H-index': ele.h_index,
            Keyword: this.$_.uniq([...ele.Keywords.map(ele => ele.keyword)]).join(': '),
            FWCI: ele.fwci,
            'Scholarly Output': ele.scholarly_output,
            'Most Recent Publication': ele.most_recent_pub,
            Citation: ele.citation,
            'Citation per Publication': ele.citation_per_pub,
            'Citation Count': ele.citation_count,
            'Cited by Count': ele.cited_by_count,
            'Document Count': ele.document_count,
            'Number of Co Author': ele.no_of_coauthor,
            'Phone Number': ele.Talent.phone_number,
            'E-mail': ele.Talent.email,
            'Scopus ID': ele.scopus_id ? ele.scopus_id : '',
            'Link to Scopus': ele.scopus_id ? `https://www.scopus.com/authid/detail.url?authorId=${ele.scopus_id}` : '',
            Linkedin: ele.Talent.link_linkedin ? `https://${ele.Talent.link_linkedin.replace('https://', '')}` : '',
            'Research Gate': ele.Talent.research_gate ? `https://${ele.Talent.research_gate.replace('https://', '')}` : '',
            TNRR: ele.Talent.link_tnrr ? `https://${ele.Talent.link_tnrr.replace('https://', '')}` : ''
          }
          const res = {}
          for (const tableHeader of this.tableHeaders.filter((ele, i) => { return this.showColumns.includes(i) })) {
            res[tableHeader.text] = newData[tableHeader.text]
          }
          return res
        }))
        const wb = this.$xlsx.utils.book_new()
        this.$xlsx.utils.book_append_sheet(wb, dataWS)
        this.$xlsx.writeFile(wb, 'talents-report-' + new Date().getTime() + '.xlsx')
      } catch (e) {
        console.log(e)
        this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
      } finally {
        this.disabledExport = false
      }
    }
  }
}
</script>
