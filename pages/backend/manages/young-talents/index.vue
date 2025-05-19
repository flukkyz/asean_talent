<template>
  <v-container>
    <v-row justify="center" class="mb-10">
      <v-col cols="12">
        <v-card v-if="listDatas">
          <v-card-title>
            <h3 class="mr-2">
              {{ modelName }}
            </h3>
            <v-btn
              class="mr-2"
              small
              depressed
              color="primary"
              :to="localePath({name: 'backend-manages-young-talents-form'})"
            >
              <v-icon small class="mr-1">
                fas fa-plus
              </v-icon>
              Create
            </v-btn>
            <v-btn
              class="mr-2"
              small
              depressed
              color="info"
              :to="localePath({name: 'backend-manages-young-talents-uploads'})"
            >
              <v-icon small class="mr-1">
                fas fa-upload
              </v-icon>
              Upload
            </v-btn>
            <v-btn
              class="mr-2"
              small
              depressed
              color="info"
              :to="localePath({name: 'backend-manages-young-talents-update-scopuses'})"
            >
              <v-icon small class="mr-1">
                fas fa-sync
              </v-icon>
              Update Scopus
            </v-btn>

            <v-spacer />
            <v-text-field
              v-model="queryParams.q"
              append-icon="mdi-magnify"
              :label="`Search ${modelName}`"
              single-line
              hide-details
              @input="onSearch"
            />
          </v-card-title>
          <v-card-title v-if="['secret', 'admin'].includes($auth.user.role)">
            <v-autocomplete
              v-model="queryParams.country"
              :items="countries"
              class="ma-1"
              clearable
              item-text="name"
              item-value="id"
              outlined
              persistent-hint
              label="Country"
              hide-details
              dense
              @change="onSearch"
            />
            <v-spacer />
            <v-autocomplete
              v-model="queryParams.city"
              :items="cities"
              class="ma-1"
              clearable
              item-text="name"
              item-value="id"
              outlined
              persistent-hint
              label="City"
              hide-details
              dense
              @change="onSearch"
            />
            <v-spacer />
            <v-autocomplete
              v-model="queryParams.university"
              :items="universities"
              class="ma-1"
              clearable
              item-text="name"
              item-value="id"
              outlined
              persistent-hint
              label="University"
              hide-details
              dense
              @change="onSearch"
            />
          </v-card-title>
          <v-data-table
            dense
            disable-pagination
            hide-default-footer
            :headers="tableHeaders"
            :items="listDatas.rows"
          >
            <template #[`item.img`]="{ item }">
              <v-img v-if="item.Img" :src="item.Img.url" width="80" />
              <v-img v-else src="/images/blank_data.jpg" width="80" />
            </template>
            <template #[`item.name`]="{ item }">
              {{ item.firstname }}
              {{ item.lastname }}
            </template>
            <template #[`item.view`]="{ item }">
              <nuxt-link :to="localePath({ name: 'backend-manages-young-talents-id', params: { id: item.id } })">
                <v-icon
                  small
                >
                  fas fa-list-ul
                </v-icon>
              </nuxt-link>
            </template>
            <template #[`item.edit`]="{ item }">
              <nuxt-link :to="localePath({ name: 'backend-manages-young-talents-form-id', params: { id: item.id } })">
                <v-icon
                  small
                  color="warning"
                >
                  fas fa-edit
                </v-icon>
              </nuxt-link>
            </template>
            <template #[`item.delete`]="{ item }">
              <v-icon
                small
                color="error"
                @click="deleteItem(item)"
              >
                fas fa-trash
              </v-icon>
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
    <dialogs-delete @delete="submitDelete" />
  </v-container>
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'country_admin'],
  data () {
    return {
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      modelName: 'Young Talent',
      listDatas: null,
      countries: null,
      cities: null,
      universities: null,
      queryParams: {
        size: 20,
        q: '',
        page: 1,
        country: '',
        city: '',
        university: ''
      },
      tableHeaders: [
        {
          text: '',
          value: 'img',
          align: 'center',
          cellClass: 'pa-0',
          sortable: false
        },
        {
          text: 'Young Talent Name',
          value: 'name',
          sortable: false
        },
        {
          text: 'University',
          value: 'University.name',
          sortable: false
        },
        {
          text: 'City',
          value: 'City.name',
          sortable: false
        },
        {
          text: 'Country',
          value: 'Country.name',
          sortable: false
        },
        {
          text: 'View',
          value: 'view',
          width: 50,
          align: 'center',
          sortable: false
        },
        {
          text: 'Edit',
          value: 'edit',
          width: 50,
          align: 'center',
          sortable: false
        },
        {
          text: 'Delete',
          value: 'delete',
          width: 50,
          align: 'center',
          sortable: false
        }
      ]
    }
  },
  async fetch () {
    this.queryParams = {
      ...this.queryParams,
      ...this.$route.query
    }
    if (!this.queryParams.country) {
      this.queryParams.country = ''
    }
    if (!this.queryParams.city) {
      this.queryParams.city = ''
    }
    if (!this.queryParams.university) {
      this.queryParams.university = ''
    }
    const searchParams = new URLSearchParams(this.queryParams).toString()
    try {
      const datas = await this.$axios.$get(`${this.apiPath}young-talents${(searchParams ? '?' + searchParams : '')}`)
      this.listDatas = datas
      if (this.queryParams.page > this.listDatas.totalPages && this.listDatas.totalPages > 0) {
        this.queryParams.page = this.listDatas.totalPages
        this.$fetch()
      }
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
    this.$breadcrumbs.clear()
  },
  head () {
    return {
      title: `Manage ${this.modelName}`
    }
  },
  async mounted () {
    try {
      await Promise.all([
        this.$axios.$get(`${this.apiPath}countries-talents`),
        this.$axios.$get(`${this.apiPath}cities-talents`),
        this.$axios.$get(`${this.apiPath}universities-talents`)
      ]).then((values) => {
        this.countries = values[0]
        this.cities = values[1]
        this.universities = values[2]
      })
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
  },
  methods: {
    onSearch () {
      this.queryParams.page = 1
      this.$fetch()
    },
    deleteItem (item) {
      this.$bus.$emit('open-delete-dialog', item.id, `${item.firstname} ${item.lastname}`)
    },
    async submitDelete (id) {
      try {
        await this.$axios.delete(`${this.apiPath}young-talents/${id}`)
        this.$notifier.showMessage({ title: 'Deleted', content: `Deleted ${this.modelName} Successfully`, color: 'success' })
        this.$fetch()
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
      this.$overlay.hide()
    }
  }
}
</script>
