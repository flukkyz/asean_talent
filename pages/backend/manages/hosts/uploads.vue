<template>
  <v-container>
    <h3>
      Upload {{ modelName }}
      <a href="/files/example_host_template.xlsx" target="_blank" rel="Template Excel File">
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
            const mimetypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
            return !v || mimetypes.includes(v.type) || 'Support Ms Excel 2007+ (.xlsx) only'
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
              {{ modelName }} data from Excel for Upload
            </h3>
            <v-btn
              v-if="!isUpload"
              color="info"
              small
              class="mr-2"
              outlined
              @click="$bus.$emit(`open-img-browse-form-add`,'Add Logos')"
            >
              Add Logos
            </v-btn>
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
            <template #[`item.imgPreview`]="{ item }">
              <v-tooltip v-if="!isUpload" top>
                <template #activator="{ on, attrs }">
                  <img
                    :src="item.imgPreview"
                    v-bind="attrs"
                    style="cursor: pointer;"
                    v-on="on"
                    @click="$bus.$emit(`open-img-browse-form-change`,`Change Logo No.${item.row}`,item.row-1)"
                  >
                </template>
                <span>Change Logo</span>
              </v-tooltip>
              <img v-else :src="item.imgPreview">

              <v-tooltip top>
                <template #activator="{ on, attrs }">
                  <v-btn
                    v-if="!item.imgPreview && !isUpload"
                    color="info"
                    icon
                    v-bind="attrs"
                    class="mt-n2"
                    v-on="on"
                    @click="$bus.$emit(`open-img-browse-form-change`,`Add Logo No.${item.row}`,item.row-1)"
                  >
                    <v-icon>fas fa-plus-circle</v-icon>
                  </v-btn>
                </template>
                <span>Add Logo</span>
              </v-tooltip>
            </template>
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
                          <p v-if="item.status === 'W'" class="info--text mb-0">
                            Wait for Upload
                          </p>
                          <p v-else-if="item.status === 'S'" class="success--text mb-0">
                            <i class="fas fa-check" />
                            Upload Successfully
                          </p>
                          <div v-else-if="item.status === 'E'" class="py-2">
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
                <img
                  v-if="item.imgPreview"
                  :src="item.imgPreview"
                  height="300"
                >
                <p class="mb-0">
                  Name
                  &nbsp;
                  <span class="font-weight-bold">
                    {{ item.name }}
                  </span>
                </p>

                <!-- <p class="mb-0">
                  Organization Type
                  &nbsp;
                  <span v-if="item.organization_type" class="font-weight-bold">
                    {{ item.organization_type }}
                  </span>
                  <span v-else>Unknown data</span>
                </p> -->

                <p class="mb-0">
                  Contact name
                  &nbsp;
                  <span v-if="item.contact_person" class="font-weight-bold">
                    {{ item.contact_person }}
                  </span>
                  <span v-else>Unknown data</span>
                </p>

                <p class="mb-0">
                  Contact phone
                  &nbsp;
                  <span v-if="item.contact_phone" class="font-weight-bold">
                    {{ item.contact_phone }}
                  </span>
                  <span v-else>Unknown data</span>
                </p>

                <p class="mb-0">
                  E-mail
                  &nbsp;
                  <span v-if="item.email" class="font-weight-bold">
                    {{ item.email }}
                  </span>
                  <span v-else>Unknown data</span>
                </p>

                <p class="mb-0">
                  Website
                  &nbsp;
                  <span class="font-weight-bold">
                    <a
                      v-if="item.website"
                      :href="item.website"
                      target="_blank"
                    >
                      {{ item.website }}
                    </a>
                    <span v-else>Unknown data</span>
                  </span>
                </p>

                <p class="mb-0">
                  Social Media URL
                  &nbsp;
                  <span class="font-weight-bold">
                    <a
                      v-if="item.social_media_url"
                      :href="item.social_media_url"
                      target="_blank"
                    >
                      {{ item.social_media_url }}
                    </a>
                    <span v-else>Unknown data</span>
                  </span>
                </p>

                <div class="my-2">
                  <p class="subtitle-1 font-weight-bold mb-0">
                    Keywords
                  </p>
                  <div v-if="item.keyword" class="d-flex flex-wrap">
                    <v-chip
                      v-for="(val, index) in item.keyword.split('; ')"
                      :key="`keyword-${index}`"
                      small
                      class="ma-1"
                      color="success"
                    >
                      {{ val }}
                    </v-chip>
                  </div>
                  <span v-else class="grey--text body-2">Unknown data</span>
                </div>

                <!-- <p class="mb-0">
                  City
                  &nbsp;
                  <span v-if="item.city" class="font-weight-bold">
                    {{ item.city }}
                  </span>
                  <span v-else>Unknown data</span>
                </p> -->

                <p class="mb-0">
                  Country
                  &nbsp;
                  <span v-if="item.country" class="font-weight-bold">
                    {{ item.country }}
                  </span>
                  <span v-else>Unknown data</span>
                </p>

                <div class="my-2">
                  <p class="subtitle-1 font-weight-bold mb-0">
                    Description
                  </p>
                  <p v-if="item.description" class="caption mb-0">
                    {{ item.description }}
                  </p>
                  <span v-else class="grey--text body-2">Unknown data</span>
                </div>
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

          <div class="d-flex px-16 py-5 align-center flex-wrap">
            <div class="w-30 d-flex flex-column text-center justify-center">
              <h3 class="mb-3">
                Total Upload Status
              </h3>
              <div class="">
                <v-progress-circular
                  :rotate="-90"
                  :size="200"
                  :width="30"
                  :value="progress.all.count / progress.all.all * 100"
                  color="primary"
                >
                  <span class="font-weight-bold">
                    <span class="display-1">{{ Math.ceil(progress.all.count / progress.all.all * 100) }}</span><span class="title">%</span>
                  </span>
                </v-progress-circular>
              </div>
              <div class="mt-3">
                <p v-if="successUpload" class="success--text mb-0 font-weight-bold">
                  Upload Completed
                </p>
                <p v-else class="info--text mb-0 font-weight-bold">
                  Waiting to upload
                </p>
              </div>
            </div>
            <div class="w-70">
              <v-card elevation="0" color="teal lighten-5" class="mt-3">
                <v-card-text>
                  <h4>Upload References</h4>
                  <v-progress-linear
                    :value="progress.reference.count / progress.reference.all * 100"
                    color="info"
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
                </v-card-text>
              </v-card>
              <v-card elevation="0" color="teal lighten-5" class="mt-3">
                <v-card-text>
                  <h4>Upload {{ modelName }}</h4>
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
        </div>
      </v-sheet>
    </v-bottom-sheet>
    <image-browse value="add" multiple @selected="onAddImages" />
    <image-browse value="change" @selected="onChangeImage" />
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
      modelName: 'Host',
      modelRoute: 'hosts',
      sheetUpload: false,
      fileUpload: null,
      search: '',
      listDatas: null,
      successUpload: false,
      isUpload: false,
      progress: {
        all: {
          all: 0,
          count: 0
        },
        reference: {
          all: 0,
          count: 0
        },
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
          cellClass: 'caption',
          sortable: false
        },
        {
          text: 'Logo',
          value: 'imgPreview',
          width: 80,
          cellClass: 'pt-2',
          sortable: false
        },
        {
          text: 'Name',
          value: 'name',
          cellClass: 'caption',
          sortable: false
        },
        {
          text: 'Country',
          value: 'country',
          cellClass: 'caption',
          sortable: false
        },
        {
          text: 'More',
          value: 'data-table-expand'
        },
        {
          text: 'Upload Status',
          value: 'status',
          align: 'center',
          cellClass: 'caption',
          sortable: false
        },
        {
          text: 'Delete',
          value: 'delete',
          align: 'right',
          sortable: false
        }
      ],
      referenceData: {
        organizationTypes: {
          column: 'organization_type',
          api: `${process.env.apiUrl}${process.env.apiDirectory}organization-types`,
          datas: null,
          newDatas: []
        },
        cities: {
          column: 'city',
          api: `${process.env.apiUrl}${process.env.apiDirectory}cities`,
          datas: null,
          newDatas: []
        }
        // countries: {
        //   column: 'country',
        //   api: `${process.env.apiUrl}${process.env.apiDirectory}countries`,
        //   datas: null,
        //   newDatas: []
        // }
      }
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
            this.$findSome(search, item.name),
            this.$findSome(search, item.email),
            this.$findSome(search, item.country),
            this.$findSome(search, item.city),
            this.$findSome(search, item.organization_type),
            this.$findSome(search, item.keyword)
          ].some(ele => ele)
        })
      }
      return listFilters
    }
  },
  async beforeMount () {
    await this.fetchRefs()
    this.$breadcrumbs.setItems([
      {
        text: this.modelName,
        to: { name: 'backend-manages-hosts' }
      },
      {
        text: 'Upload'
      }
    ])
  },
  methods: {
    async fetchRefs () {
      await Promise.all(Object.keys(this.referenceData).map(key => this.$axios.$get(this.referenceData[key].api))).then((values) => {
        for (const [index, value] of Object.entries(Object.keys(this.referenceData))) {
          this.referenceData[value].datas = values[index].rows.map(ele => ele.name)
          this.referenceData[value].newDatas = []
        }
      })
    },
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
            data.logo = data.logo ? data.logo.trim() : ''
            data.imgPreview = ''
            data.file = null
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
    onAddImages (files) {
      for (const file of files) {
        const findIndex = this.$_.findIndex(this.listDatas, { logo: file.name })
        if (findIndex !== -1) {
          this.listDatas[findIndex].imgPreview = URL.createObjectURL(file)
          this.listDatas[findIndex].file = file
        }
      }
      this.$overlay.hide()
    },
    onChangeImage (file, index) {
      this.listDatas[index].logo = file.name
      this.listDatas[index].imgPreview = URL.createObjectURL(file)
      this.listDatas[index].file = file
      this.$overlay.hide()
    },
    resetBeforeUpload () {
      this.successUpload = false
      this.progress = {
        all: {
          all: 0,
          count: 0
        },
        reference: {
          all: 0,
          count: 0
        },
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

      for (const dataTable in this.referenceData) {
        this.referenceData[dataTable].newDatas = this.$_.uniq(this.listDatas.map((ele) => { return ele[this.referenceData[dataTable].column] ? ele[this.referenceData[dataTable].column].trim() : 'Unknown data' })).filter(ele => !this.referenceData[dataTable].datas.includes(ele)).map((ele) => {
          return { name: ele }
        })
        this.progress.reference.all += this.referenceData[dataTable].newDatas.length > 0 ? 1 : 0
      }

      this.progress.all.all += this.listDatas.length
      this.progress.all.all += this.progress.reference.all

      this.progress.reference.all++
      this.progress.data.all += this.listDatas.length + 1
      this.progress.all.all++

      setTimeout(async () => {
        for (const data in this.referenceData) {
          if (this.referenceData[data].newDatas.length > 0) {
            try {
              await this.$axios.$post(`${this.referenceData[data].api}-lists`, { lists: this.referenceData[data].newDatas })
              this.progress.reference.count++
              this.progress.all.count++
            } catch (e) {
              this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
            }
          }
        }
        this.progress.reference.count++

        for (const data of this.listDatas) {
          if (!data.imgPreview) {
            data.logo = ''
            data.file = null
          }
          try {
            await this.$axios.$post(`${process.env.apiUrl}${process.env.apiDirectory}uploads/${this.modelRoute}`, data)
            if (data.file && data.logo) {
              const formData = new FormData()
              formData.append('upload_filename', data.logo)
              formData.append('host_img', data.file)
              await this.$axios.$post(`${process.env.apiUrl}${process.env.apiDirectory}uploads/${this.modelRoute}-image`, formData)
            }
            data.status = 'S'
            this.progress.data.complete++
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
          this.progress.data.count++
          this.progress.all.count++
        }
        this.progress.data.count++

        this.progress.all.count++
        await this.fetchRefs()
        this.$overlay.hide()
        this.successUpload = true
      }, 1000)
    }
  }
}
</script>
