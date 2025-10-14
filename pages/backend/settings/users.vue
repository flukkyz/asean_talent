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
              @click="$bus.$emit('open-user-form')"
            >
              <v-icon small class="mr-1">
                fas fa-plus
              </v-icon>
              Create
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
          <v-data-table
            dense
            disable-pagination
            hide-default-footer
            :headers="tableHeaders"
            :items="listDatas.rows"
          >
            <template #[`item.role`]="{ item }">
              {{ roles[item.role] || 'admin' }}
              <span v-if="item.role === 'country_admin'" class="font-weight-bold grey--text">
                ({{ item.Country.name }})
              </span>
            </template>
            <template #[`item.last_login`]="{ item }">
              <div>
                <template v-if="item.AccessTokens.length > 0">
                  {{ $dateText(item.AccessTokens[0].createdAt,'short','long') }}
                  &nbsp;
                  <span class="caption teal--text">
                    <span class="font-weight-bold">
                      ip
                    </span>
                    {{ item.AccessTokens[0].ip }}
                  </span>
                </template>
                <span v-else class="red--text">
                  No Data
                </span>
              </div>
            </template>
            <template #[`item.edit`]="{ item }">
              <v-icon
                v-if="($auth.user.role === 'admin' && item.role !== 'secret') || $auth.user.role === 'secret'"
                small
                color="warning"
                @click="$bus.$emit('open-user-form', item)"
              >
                fas fa-edit
              </v-icon>
            </template>
            <template #[`item.delete`]="{ item }">
              <v-icon
                v-if="$auth.user.email !== item.email"
                small
                color="error"
                @click="$bus.$emit('open-delete-dialog', item.id, `${modelName} : ${item.name}`)"
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
    <forms-user
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
      api: `${process.env.apiUrl}${process.env.apiDirectory}users`,
      modelName: 'Staff Management',
      listDatas: null,
      queryParams: {
        size: 20,
        q: '',
        page: 1
      },
      tableHeaders: [
        {
          text: 'Name',
          value: 'name',
          sortable: false
        },
        {
          text: 'E-mail',
          value: 'email',
          sortable: false
        },
        {
          text: 'Role',
          value: 'role',
          cellClass: 'caption',
          sortable: false
        },
        {
          text: 'Last Login',
          value: 'last_login',
          sortable: false
        },
        {
          text: 'Edit',
          align: 'right',
          value: 'edit',
          sortable: false
        },
        {
          text: 'Delete',
          align: 'right',
          value: 'delete',
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
      title: this.modelName
    }
  },
  computed: {
    roles () {
      return this.$store.state.enums.roles
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
