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
              @click="$bus.$emit('open-portal-form')"
            >
              <v-icon small class="mr-1">
                fas fa-plus
              </v-icon>
              Create
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
          </v-card-title>
          <v-data-table
            dense
            disable-pagination
            hide-default-footer
            :headers="tableHeaders"
            :items="listDatas.rows"
            single-expand
            :expanded.sync="expanded"
            show-expand
          >
            <template #[`item.url`]="{ item }">
              <a v-if="item.url" :href="item.url" target="_blank" :rel="item.name">
                {{ item.url }}
              </a>
            </template>
            <template #[`item.edit`]="{ item }">
              <v-icon
                small
                color="warning"
                @click="$bus.$emit('open-portal-form', item)"
              >
                fas fa-edit
              </v-icon>
            </template>
            <template #[`item.delete`]="{ item }">
              <v-icon
                small
                color="error"
                @click="$bus.$emit('open-delete-dialog', item.id, item.name)"
              >
                fas fa-trash
              </v-icon>
            </template>
            <template #expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <div class="pt-3 px-3 pb-6">
                  <div class="d-flex align-center justify-space-between">
                    <p class="headline mb-0">
                      {{ item.name }}
                    </p>
                  </div>

                  <v-divider class="my-3" />

                  <label-value
                    label="URL"
                  >
                    <a v-if="item.url" :href="item.url" target="_blank" :rel="item.name">
                      {{ item.url }}
                    </a>
                    <p v-else class="caption mb-0 red--text">
                      No Data
                    </p>
                  </label-value>

                  <div v-if="item.description">
                    <p class="subtitle-1 font-weight-bold mb-0">
                      Description
                    </p>
                    <div v-if="item.description" class="mb-3">
                      <div class="ck-content" v-html="item.description" />
                    </div>
                  </div>
                </div>
              </td>
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
    <forms-portal
      @add="submitCreate"
      @edit="submitUpdate"
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
      api: `${process.env.apiUrl}${process.env.apiDirectory}portals`,
      modelName: 'Portal Link',
      listDatas: null,
      queryParams: {
        size: 20,
        q: '',
        page: 1
      },
      tableHeaders: [
        {
          text: 'Title',
          value: 'name',
          sortable: false
        },
        {
          text: 'URL',
          value: 'url',
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
        },
        {
          text: '',
          value: 'data-table-expand'
        }
      ],
      expanded: []
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
        const result = await this.$axios.$put(`${this.api}/${data.id}`, data)
        await this.$fetch()
        if (result) {
          this.$notifier.showMessage({ title: 'Updated', content: `Updated ${this.modelName} Successfully`, color: 'success' })
        }
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
      this.$overlay.hide()
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
    }
  }
}
</script>
