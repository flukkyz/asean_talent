<template>
  <v-container>
    <v-row justify="center" class="mb-10">
      <v-col cols="12">
        <v-card v-if="listDatas">
          <v-card-title>
            <h3 class="mr-2">
              {{ modelName }}
            </h3>

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
            <template #[`item.title`]="{ item }">
              <p :id="`table-item-${item.id}`" class="mb-0">
                {{ item.title }}
              </p>
            </template>
            <template #[`item.member`]="{ item }">
              {{ item.Member.member_type === 'researcher' ? `${item.Member.Researcher.lastname}, ${item.Member.Researcher.firstname}` : item.Member.Organization.name }}
            </template>
            <template #[`item.createdAt`]="{ item }">
              {{ $dateText(item.createdAt,'medium','short') }}
            </template>
            <template #[`item.tags`]="{ item }">
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
            <template #[`item.hit`]="{ item }">
              {{ $currencyText(item.hit) }}
            </template>
            <template #[`item.comment`]="{ item }">
              {{ $abbreviateNumber(item.count_comments) }}
            </template>
            <template #[`item.view`]="{ item }">
              <nuxt-link :to="localePath({ name: 'backend-manages-forums-slug', params: { slug: item.slug } })">
                <v-icon
                  small
                >
                  fas fa-eye
                </v-icon>
              </nuxt-link>
            </template>
            <template #[`item.delete`]="{ item }">
              <v-icon
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
    <dialogs-delete @delete="submitDelete" />
  </v-container>
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'admin'],
  data () {
    return {
      api: `${process.env.apiUrl}${process.env.apiDirectory}forums-admin`,
      modelName: 'Forums',
      listDatas: null,
      queryParams: {
        size: 20,
        q: '',
        page: 1
      },
      tableHeaders: [
        {
          text: 'Title',
          value: 'title'
        },
        {
          text: 'Poster',
          value: 'member'
        },
        {
          text: 'Created At',
          value: 'createdAt'
        },
        {
          text: 'Tags',
          value: 'tags'
        },
        {
          text: 'Read',
          value: 'hit',
          width: 100,
          align: 'right',
          sortable: false
        },
        {
          text: 'Comment',
          value: 'comment',
          width: 100,
          align: 'right',
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
