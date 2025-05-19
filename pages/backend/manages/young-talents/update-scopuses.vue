<template>
  <v-container>
    <div class="d-flex align-center">
      <h3>
        Upload to {{ modelName }}
      </h3>
      <a href="/files/example_update_young_scopuses_template.xlsx" target="_blank" rel="Template Excel File">
        <v-btn small outlined elevation="0" color="info" class="ml-3">
          Download Template File
        </v-btn>
      </a>
    </div>
    <div class="mt-2 d-flex">
      <v-file-input
        v-model="fileUpload"
        label="Browse Excel file to upload"
        outlined
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        :rules="[
          (v) => {
            const mimetypeImages = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
            return !v || mimetypeImages.includes(v.type) || 'Support Ms Excel 2007+ (.xlsx) only'
          }
        ]"
        prepend-icon=""
        prepend-inner-icon="fas fa-file-excel"
        @change="onBrowse"
      />
      <v-btn
        v-if="fileUpload"
        :disabled="isUpload"
        depressed
        class="ml-2"
        x-large
        color="primary"
        @click="onUpload"
      >
        <v-icon left>
          fas fa-upload
        </v-icon>
        Upload
      </v-btn>
    </div>

    <v-row justify="center" class="mb-10">
      <v-col cols="12">
        <v-card v-if="listDatas">
          <v-card-title>
            <h3 class="mr-2">
              Upload to {{ modelName }} data from Excel
            </h3>
            <v-spacer />
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            />
          </v-card-title>
          <v-data-table
            ref="dataTable"
            dense
            :footer-props="{
              itemsPerPageOptions: [10,20,50,100,300,500,-1]
            }"
            :headers="tableHeaders"
            :items="listFilters"
            single-expand
            :expanded.sync="expanded"
            item-key="row"
            show-expand
          >
            <template #[`item.statusScopus`]="{ item }">
              <p v-if="item.statusScopus === 'W'" class="info--text mb-0">
                Wait for Upload
              </p>
              <p v-else-if="item.statusScopus === 'S'" class="success--text mb-0">
                <i class="fas fa-check" />
                Upload Successfully
              </p>
              <div v-else class="py-2">
                <p class="error--text mb-0">
                  <i class="fas fa-times" />
                  Upload Fail
                </p>
              </div>
            </template>
            <template #expanded-item="{ headers, item }">
              <td :colspan="headers.length" class="pa-5">
                <div class="float-right">
                  <v-card elevation="0" max-width="500px" color="blue lighten-5" class="mt-3">
                    <v-card-text class="pa-0">
                      <div class="d-flex align-center">
                        <p class="font-weight-bold caption mb-0 pa-3">
                          Status
                        </p>
                        <v-divider vertical class="mx-1" />
                        <div class="pa-3">
                          <p v-if="item.statusScopus === 'W'" class="info--text mb-0">
                            Wait for Upload
                          </p>
                          <p v-else-if="item.statusScopus === 'S'" class="success--text mb-0">
                            <i class="fas fa-check" />
                            Upload Successfully
                          </p>
                          <div v-else class="py-2">
                            <p class="error--text mb-0">
                              <i class="fas fa-times" />
                              Upload Fail
                            </p>
                            <p class="caption mb-0">
                              {{ item.statusText }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
                <p v-if="item.scopus_id" class="mb-0 title">
                  Scopus ID
                  &nbsp;
                  <span class="font-weight-bold">
                    <a :href="`https://www.scopus.com/authid/detail.url?authorId=${item.scopus_id}`" target="_blank">
                      {{ item.scopus_id }}
                    </a>
                  </span>
                </p>

                <p class="mb-0">
                  Name
                  &nbsp;
                  <span class="font-weight-bold">
                    {{ item.name }}
                  </span>
                </p>

                <p class="mb-0">
                  H-index
                  &nbsp;
                  <span v-if="item.h_index" class="font-weight-bold">
                    {{ item.h_index }}
                  </span>
                  <span v-else>Unknown data</span>
                </p>

                <p class="mb-0">
                  Scholarly Output
                  &nbsp;
                  <span v-if="item.scholarly_output" class="font-weight-bold">
                    {{ item.scholarly_output }}
                  </span>
                  <span v-else>Unknown data</span>
                </p>

                <p class="mb-0">
                  Most Recent Publication
                  &nbsp;
                  <span v-if="item.most_recent_pub" class="font-weight-bold">
                    {{ item.most_recent_pub }}
                  </span>
                  <span v-else>Unknown data</span>
                </p>

                <p class="mb-0">
                  Citation
                  &nbsp;
                  <span v-if="item.citation" class="font-weight-bold">
                    {{ item.citation }}
                  </span>
                  <span v-else>Unknown data</span>
                </p>

                <p class="mb-0">
                  Citation per Publication
                  &nbsp;
                  <span v-if="item.citation_per_pub" class="font-weight-bold">
                    {{ item.citation_per_pub }}
                  </span>
                  <span v-else>Unknown data</span>
                </p>

                <p class="mb-0">
                  Field-Weighted Citation Impact
                  &nbsp;
                  <span v-if="item.fwci" class="font-weight-bold">
                    {{ item.fwci }}
                  </span>
                  <span v-else>Unknown data</span>
                </p>

                <p class="mb-0">
                  Citation Count
                  &nbsp;
                  <span v-if="item.citation_count" class="font-weight-bold">
                    {{ item.citation_count }}
                  </span>
                  <span v-else>Unknown data</span>
                </p>

                <p class="mb-0">
                  Cited by Count
                  &nbsp;
                  <span v-if="item.cited_by_count" class="font-weight-bold">
                    {{ item.cited_by_count }}
                  </span>
                  <span v-else>Unknown data</span>
                </p>

                <p class="mb-0">
                  Document Count
                  &nbsp;
                  <span v-if="item.document_count" class="font-weight-bold">
                    {{ item.document_count }}
                  </span>
                  <span v-else>Unknown data</span>
                </p>

                <p class="mb-0">
                  No. of Co Authors
                  &nbsp;
                  <span v-if="item.no_of_coauthor" class="font-weight-bold">
                    {{ item.no_of_coauthor }}
                  </span>
                  <span v-else>Unknown data</span>
                </p>
              </td>
            </template>
            <template #[`item.delete`]="{ item }">
              <div v-if="!isUpload" class="text-right">
                <v-icon
                  small
                  @click="deleteItem(item)"
                >
                  fas fa-trash
                </v-icon>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-bottom-sheet
      v-model="sheetUpload"
      inset
      persistent
    >
      <v-sheet>
        <div>
          <div v-if="successUpload" class="text-right pt-5 pr-6">
            <v-icon color="grey" @click="sheetUpload = false">
              fas fa-times
            </v-icon>
          </div>

          <div class="px-16 py-5">
            <v-card elevation="0" color="teal lighten-5" class="mt-3">
              <v-card-text>
                <h4>Upload to {{ modelName }}</h4>
                <v-progress-linear
                  :value="progress.data.count / progress.data.all * 100"
                  color="accent"
                  class="mb-3"
                  height="10"
                  rounded
                >
                  <template #default="{ value }">
                    <span class="very-small" :class="value > 50 ? 'white--text' : ''">
                      {{ Math.ceil(value) }}%
                    </span>
                  </template>
                </v-progress-linear>
                <span v-if="progress.data.count > 0">
                  <span class="font-weight-bold">
                    {{ progress.data.complete }} / {{ progress.data.all-1 }}
                  </span>
                  Upload Successfully
                </span>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-sheet>
    </v-bottom-sheet>
    <dialogs-delete @delete="submitDelete" />
    <dialogs-confirm @confirm="submitUpload" />
  </v-container>
</template>

<script>
import ExcelJS from 'exceljs'
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'country_admin'],
  data () {
    return {
      modelName: 'Update Young Talent Scopus',
      modelRoute: 'update-scopuses',
      sheetUpload: false,
      fileUpload: null,
      search: '',
      listDatas: null,
      successUpload: false,
      isUpload: false,
      progress: {
        data: {
          all: 0,
          count: 0
        }
      },
      expanded: [],
      tableHeaders: [
        {
          text: 'No.',
          value: 'row',
          align: 'center',
          sortable: false
        },
        {
          text: 'Scopus ID',
          value: 'scopus_id',
          sortable: false
        },
        {
          text: 'Name',
          value: 'name',
          sortable: false
        },
        {
          text: 'Industry',
          value: 'industry',
          sortable: false
        },
        {
          text: 'More',
          value: 'data-table-expand'
        },
        {
          text: 'Status',
          value: 'statusScopus',
          align: 'center',
          sortable: false
        },
        {
          text: 'Delete',
          value: 'delete',
          align: 'right',
          sortable: false
        }
      ]
    }
  },
  head () {
    return {
      title: `Upload to ${this.modelName}`
    }
  },
  computed: {
    listFilters () {
      let listFilters = this.$_.orderBy(this.listDatas, ['statusScopus', 'row'], ['asc', 'asc', 'asc'])
      if (this.search) {
        const search = this.search
        listFilters = listFilters.filter((item) => {
          return [
            this.$findSome(search, item.name),
            this.$findSome(search, item.industry),
            this.$findSome(search, item.scopus_id)
          ].some(ele => ele)
        })
      }
      return listFilters
    }
  },
  created () {
    this.$breadcrumbs.setItems([
      {
        text: 'Talent Profile',
        to: { name: 'backend-manages-young-talents' }
      },
      {
        text: `Upload to ${this.modelName}`
      }
    ])
  },
  methods: {
    clearFile () {
      this.listDatas = null
    },
    async onBrowse (file) {
      if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.$overlay.showLoading()
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(file)

        const worksheet = workbook.getWorksheet(1)
        const datas = []
        let firstRow = null
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          const data = {}
          if (rowNumber === 1) {
            firstRow = row
          } else {
            data.row = rowNumber - 1
            data.statusScopus = 'W'
            data.statusScopusText = null
            row.eachCell((cell, celNumber) => {
              data[firstRow.getCell(celNumber)] = cell.value ? cell.value.toString().trim() : ''
            })
            datas.push(data)
          }
        })
        this.listDatas = datas
        this.$overlay.hide()
      } else {
        this.listDatas = null
        this.isUpload = false
      }
    },
    deleteItem (item) {
      this.$bus.$emit('open-delete-dialog', item.row - 1, item.name)
    },
    submitDelete (row) {
      this.listDatas.splice(row, 1)
      this.$notifier.showMessage({ title: 'Deleted', content: `Delete ${this.modelName} Successfully`, color: 'success' })
      this.$overlay.hide()
    },
    resetBeforeUpload () {
      this.successUpload = false
      this.progress = {
        data: {
          all: 0,
          count: 0,
          complete: 0
        }
      }
    },
    onUpload (item) {
      this.$bus.$emit('open-confirm-dialog', null, {
        header: {
          text: `Upload to ${this.modelName} data`
        },
        detail: {
          text: `Please confirm to Upload to ${this.modelName} data`
        },
        yesBtn: {
          icon: 'fas fa-upload',
          color: 'primary',
          text: 'Upload'
        },
        noBtn: {
          color: 'grey',
          text: 'Cancel'
        }
      })
    },
    submitUpload () {
      this.resetBeforeUpload()
      this.sheetUpload = true
      this.isUpload = true

      this.progress.data.all += this.listDatas.length + 1

      setTimeout(async () => {
        for (const data of this.listDatas) {
          try {
            await this.$axios.$post(`${process.env.apiUrl}${process.env.apiDirectory}uploads/${this.modelRoute}`, data)
            data.statusScopus = 'S'
            this.progress.data.complete++
          } catch (e) {
            data.statusScopus = 'E'
            if (e.response.data.message) {
              data.statusText = e.response.data.message
            } else {
              const errorText = []
              for (const error in e.response.data.errors) {
                errorText.push(`${e.response.data.errors[error].rule}: ${e.response.data.errors[error].message}`)
              }
              data.statusText = errorText.join(', ')
            }
          }
          this.progress.data.count++
        }
        this.progress.data.count++

        this.$overlay.hide()
        this.successUpload = true
      }, 1000)
    }
  }
}
</script>
