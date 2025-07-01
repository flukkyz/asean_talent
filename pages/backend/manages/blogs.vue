<template>
  <v-container>
    <v-row justify="center" class="mb-10">
      <v-col cols="12">
        <v-card v-if="listDatas">
          <v-card-title class="pb-0">
            <h3 class="mr-2">
              {{ modelName }}
            </h3>
            <v-btn
              class="mr-2"
              small
              depressed
              color="primary"
              @click="$bus.$emit('open-blog-form')"
            >
              <v-icon small class="mr-1">
                fas fa-plus
              </v-icon>
              Create
            </v-btn>
            <v-btn
              v-if="listDatas.totalItems > 0"
              outlined
              small
              color="primary"
              :loading="disabledExport"
              :disabled="disabledExport"
              @click="exportExcel"
            >
              <v-icon small class="mr-2">
                fas fa-file-excel
              </v-icon>
              Download Traffic Statistics
            </v-btn>
          </v-card-title>
          <v-card-title class="pt-0">
            <v-text-field
              v-model="queryParams.q"
              append-icon="mdi-magnify"
              :label="`Search ${modelName}`"
              single-line
              hide-details
              @input="onSearch"
            />
            <v-spacer />
            <div class="d-flex align-center">
              <p class="caption mb-0 font-weight-bold mr-2">
                Showing
              </p>
              <v-btn-toggle
                v-model="queryParams.show"
                color="info"
                tile
                group
                @change="onSearch"
              >
                <v-btn value="active" small>
                  Active
                </v-btn>

                <v-btn value="all" small>
                  All
                </v-btn>
              </v-btn-toggle>
            </div>
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
            <template #[`item.blog`]="{ item }">
              <p :id="`table-item-${item.id}`" class="mb-0 font-weight-bold">
                {{ item.title }}
              </p>
              <p class="caption mb-0">
                <v-icon x-small class="mt-n1">
                  fas fa-calendar-alt
                </v-icon>
                {{ $dateText(item.createdAt,'medium','short') }}
                <v-icon x-small class="ml-3 mt-n1">
                  fas fa-eye
                </v-icon>
                {{ $currencyText(item.hit) }}
              </p>
              <div v-if="item.tags" class="d-flex flex-wrap">
                <v-chip
                  v-for="(val, index) in item.tags.split('; ')"
                  :key="`tags-${index}`"
                  x-small
                  class="ma-1"
                  color="primary"
                >
                  {{ val }}
                </v-chip>
              </div>
            </template>
            <template #[`item.view`]="{ item }">
              <a v-if="item.active" :href="localePath({ name: 'blogs-slug', params: { slug: item.slug } })" target="_blank">
                <v-icon
                  small
                >
                  fas fa-eye
                </v-icon>
              </a>
            </template>
            <template #[`item.edit`]="{ item }">
              <v-icon
                small
                color="warning"
                @click="$bus.$emit('open-blog-form', item)"
              >
                fas fa-edit
              </v-icon>
            </template>
            <template #[`item.hide`]="{ item }">
              <v-tooltip top>
                <template #activator="{ on, attrs }">
                  <v-icon
                    small
                    v-bind="attrs"
                    :color="item.active ? 'primary' :'error' "
                    v-on="on"
                    @click="setActive(item)"
                  >
                    fas
                    {{ item.active ? 'fa-eye' :'fa-eye-slash' }}
                  </v-icon>
                </template>
                <span>{{ item.active ? 'Published':'Hidden' }}</span>
              </v-tooltip>
              <v-tooltip v-if="item.active" top>
                <template #activator="{ on, attrs }">
                  <v-icon
                    small
                    class="ml-1"
                    v-bind="attrs"
                    :color="!!item.expired_at ? 'warning': 'grey'"
                    v-on="on"
                    @click="$bus.$emit('open-expired-form', item)"
                  >
                    fas fa-hourglass-end
                  </v-icon>
                </template>
                <span>{{ item.expired_at ? `Expire at ${$dateText(item.expired_at)}` : 'No Expire' }}</span>
              </v-tooltip>
            </template>
            <template #[`item.delete`]="{ item }">
              <v-icon
                v-if="!item.active"
                small
                color="error"
                @click="$bus.$emit('open-delete-dialog', item.id, item.title)"
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
    <forms-blog
      @add="submitCreate"
      @edit="submitUpdate"
      @removeImage="removeImage"
    />
    <forms-expired
      @save="submitExpired"
    />
    <dialogs-delete @delete="submitDelete" />
  </v-container>
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'admin'],
  data () {
    return {
      api: `${process.env.apiUrl}${process.env.apiDirectory}blogs`,
      modelName: 'News & Activity',
      listDatas: null,
      disabledExport: false,
      queryParams: {
        size: 20,
        q: '',
        page: 1,
        show: 'active'
      },
      tableHeaders: [
        {
          text: '',
          value: 'img',
          align: 'center',
          cellClass: 'pa-1',
          sortable: false
        },
        {
          text: 'News & Activity',
          value: 'blog',
          cellClass: 'py-1 pl-1'
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
          text: 'Show/Hide',
          value: 'hide',
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
    const searchParams = new URLSearchParams(this.queryParams).toString()
    try {
      const datas = await this.$axios.$get(`${this.api}${(searchParams ? '?' + searchParams : '')}`)
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
  methods: {
    onSearch () {
      this.queryParams.page = 1
      this.$fetch()
    },
    async submitCreate (data) {
      try {
        const result = await this.$axios.$post(`${this.api}`, data)
        await this.$fetch()
        if (result) {
          this.$notifier.showMessage({ title: 'Created', content: `Create ${this.modelName} Successfully`, color: 'success' })
        }
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
      this.$overlay.hide()
    },
    async submitUpdate (data) {
      try {
        const result = await this.$axios.$put(`${this.api}/${data.get('id')}`, data)
        await this.$fetch()
        if (result) {
          this.$notifier.showMessage({ title: 'Updated', content: `Updated ${this.modelName} Successfully`, color: 'success' })
        }
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
      this.$overlay.hide()
    },
    async setActive (data) {
      try {
        const result = await this.$axios.$put(`${this.api}/${data.id}`, { ...data, active: !data.active })
        await this.$fetch()
        if (result) {
          this.$notifier.showMessage({ title: 'Updated', content: `Updated ${this.modelName} Successfully`, color: 'success' })
        }
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
      this.$overlay.hide()
    },
    async submitExpired (data) {
      try {
        const result = await this.$axios.$put(`${this.api}/${data.id}`, data)
        await this.$fetch()
        if (result) {
          this.$notifier.showMessage({ title: 'Set Expiration Date', content: 'Updated Expiration Date Successfully', color: 'success' })
        }
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
      this.$overlay.hide()
    },
    async removeImage (data) {
      try {
        const result = await this.$axios.$put(`${this.api}/${data.id}/remove-image`, data)
        await this.$fetch()
        if (result) {
          this.$notifier.showMessage({ title: 'Updated', content: 'Remove Image Successfully', color: 'success' })
        }
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
    },
    async submitDelete (id) {
      try {
        await this.$axios.delete(`${this.api}/${id}`)
        this.$notifier.showMessage({ title: 'Deleted', content: `Deleted ${this.modelName} Successfully`, color: 'success' })
        this.$fetch()
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
      this.$overlay.hide()
    },
    async exportExcel () {
      this.disabledExport = true
      const searchParams = new URLSearchParams({
        ...this.queryParams,
        size: this.listDatas.totalItems,
        page: 1
      }).toString()
      try {
        const datas = await this.$axios.$get(`${this.api}${(searchParams ? '?' + searchParams : '')}`)
        const dataWS = this.$xlsx.utils.json_to_sheet(datas.rows.map((ele) => {
          return {
            Title: ele.title,
            Viewer: ele.hit,
            'Created At': ele.createdAt
          }
        }))
        const wb = this.$xlsx.utils.book_new()
        this.$xlsx.utils.book_append_sheet(wb, dataWS)
        this.$xlsx.writeFile(wb, 'news-activities-traffic-statistics-' + new Date().getTime() + '.xlsx')
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
