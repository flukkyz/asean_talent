<template>
  <v-container>
    <h3>
      Upload {{ modelName }}
      <a href="/files/example_location_template.xlsx" target="_blank" rel="Template Excel File">
        <v-btn small outlined elevation="0" color="info" class="ml-3">
          Download Template File
        </v-btn>
      </a>
    </h3>
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
        text
        class="ml-2 mt-1"
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
              Upload {{ modelName }} data from Excel
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
            item-key="row"
          >
            <template #[`item.status`]="{ item }">
              <p v-if="item.status === 'W'" class="info--text mb-0">
                Wait for Upload
              </p>
              <p v-else-if="item.status === 'S'" class="success--text mb-0">
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

          <div class="px-16 py-5 align-center flex-wrap">
            <v-card elevation="0" color="teal lighten-5" class="mt-3">
              <v-card-text>
                <h4>Upload {{ modelName }}</h4>
                <v-progress-linear
                  :value="progress.count / progress.all * 100"
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
                <span v-if="progress.count > 0">
                  <span class="font-weight-bold">
                    {{ progress.complete }} / {{ progress.all-1 }}
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
  props: {
    api: {
      type: String,
      default: null,
      require: true
    },
    modelName: {
      type: String,
      default: null,
      require: true
    }
  },
  data () {
    return {
      sheetUpload: false,
      fileUpload: null,
      search: '',
      listDatas: null,
      successUpload: false,
      isUpload: false,
      progress: {
        all: 0,
        count: 0
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
          text: 'Name',
          value: 'name',
          sortable: false
        },
        {
          text: 'Lat',
          value: 'lat',
          sortable: false
        },
        {
          text: 'Lng',
          value: 'lng',
          sortable: false
        },
        {
          text: 'Upload Status',
          value: 'status',
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
      title: `Upload ${this.modelName}`
    }
  },
  computed: {
    listFilters () {
      let listFilters = this.$_.orderBy(this.listDatas, ['status', 'row'], ['asc', 'asc'])
      if (this.search) {
        const search = this.search
        listFilters = listFilters.filter((item) => {
          return [
            this.$findSome(search, item.name)
          ].some(ele => ele)
        })
      }
      return listFilters
    }
  },
  beforeMount () {
    this.$breadcrumbs.setItems([
      {
        text: this.modelName,
        to: { name: `backend-settings-references-${this.api}` }
      },
      {
        text: 'Upload'
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
            data.status = 'W'
            data.statusText = null
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
        all: 0,
        count: 0,
        complete: 0
      }
    },
    onUpload (item) {
      this.$bus.$emit('open-confirm-dialog', null, {
        header: {
          text: `Upload ${this.modelName} data`
        },
        detail: {
          text: `Please confirm to Upload ${this.modelName} data`
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

      this.progress.all += this.listDatas.length + 1

      setTimeout(async () => {
        for (const data of this.listDatas) {
          try {
            await this.$axios.$post(`${process.env.apiUrl}${process.env.apiDirectory}uploads/${this.api}`, data)
            data.status = 'S'
            this.progress.complete++
          } catch (e) {
            data.status = 'E'
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
          this.progress.count++
        }
        this.progress.count++

        this.$overlay.hide()
        this.successUpload = true
      }, 1000)
    }
  }
}
</script>
