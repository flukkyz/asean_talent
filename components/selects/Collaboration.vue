<template>
  <v-dialog v-if="talent" v-model="dialog" persistent scrollable max-width="500">
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>
          <v-icon class="mr-2">
            fas fa-plus
          </v-icon>
          Add {{ modelName }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn fab x-small text @click="closeDialog">
          <v-icon>
            fas fa-times
          </v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-title class="pt-0">
        <v-text-field
          v-model="queryParams.q"
          class="mb-2"
          append-icon="mdi-magnify"
          label="Search Firstname or Lastname"
          autocomplete="off"
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
        <template #[`header.plus`]="{ }">
          <v-btn
            color="primary"
            class="mb-1"
            x-small
            @click="$bus.$emit('open-co-author-form')"
          >
            <v-icon
              x-small
              class="mr-1"
            >
              fas fa-plus
            </v-icon>
            Create {{ subModelName }}
          </v-btn>
        </template>
        <template #[`item.author`]="{ item }">
          <a
            v-if="item.talent_id"
            target="_blank"
            :href="localePath({ name: 'backend-manages-talents-id', params: { id: item.talent_id } })"
          >
            <p class="info--text my-1">
              <v-icon color="accent" small class="mr-1">
                fas fa-user-tie
              </v-icon>
              {{ item.firstname }}
              {{ item.lastname }}
            </p>
          </a>
          <p v-else class="my-1">
            <v-icon color="grey" small class="mr-1">
              far fa-user
            </v-icon>
            {{ item.firstname }}
            {{ item.lastname }}
          </p>
        </template>
        <template #[`item.plus`]="{ item }">
          <v-icon
            v-if="!talent.Collaborations.map(ele => ele.co_author_id).includes(item.id)"
            small
            color="primary"
            @click="addCoAuthor(item)"
          >
            fas fa-plus
          </v-icon>
          <v-icon
            v-else
            color="error"
            small
            @click="removeCoAuthor(item)"
          >
            fas fa-minus
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
            @input="fetchData"
          />
        </div>
        <p class="mt-3">
          {{ listDatas.totalItems }}
          {{ listDatas.totalItems > 1 ? 'Items' : 'item' }}
        </p>
      </v-card-text>
    </v-card>
    <forms-co-author @add="submitCreate" />
  </v-dialog>
</template>

<script>
export default {
  props: {
    talent: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      dialog: false,
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      collaborationApi: 'collaborations',
      coAuthorApi: 'co-authors',
      modelName: 'Collaboration',
      subModelName: 'Co Author',
      listDatas: [],
      queryParams: {
        size: 20,
        q: '',
        not: '',
        page: 1
      },
      tableHeaders: [
        {
          text: 'Author',
          value: 'author',
          sortable: false
        },
        {
          text: '',
          value: 'plus',
          width: 50,
          align: 'right',
          sortable: false
        }
      ]
    }
  },
  created () {
    this.$bus.$on('open-collaboration-select', async () => {
      this.$overlay.showLoading()
      await this.fetchData()
      this.dialog = true
    })
  },
  beforeDestroy () {
    this.$bus.$off('open-collaboration-select')
  },
  methods: {
    async fetchData () {
      this.queryParams.not = this.talent.id
      this.queryParams = {
        ...this.queryParams,
        ...this.$route.query
      }
      const searchParams = new URLSearchParams(this.queryParams).toString()
      try {
        const dataScopusNames = await this.$axios.$get(`${this.apiPath}${this.coAuthorApi}${(searchParams ? '?' + searchParams : '')}`)
        this.listDatas = dataScopusNames
        if (this.queryParams.page > this.listDatas.totalPages && this.listDatas.totalPages > 0) {
          this.queryParams.page = this.listDatas.totalPages
          await this.fetchData()
        }
      } catch (e) {
        this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
      }
    },
    async onSearch () {
      this.queryParams.page = 1
      await this.fetchData()
    },
    closeDialog () {
      this.dialog = false
      this.$overlay.hide()
    },
    async submitCreate (data) {
      try {
        const result = await this.$axios.$post(`${this.apiPath}${this.coAuthorApi}`, data)
        await this.fetchData()
        if (result) {
          this.$notifier.showMessage({ title: 'Created', content: `Create ${this.subModelName} Successfully`, color: 'success' })
        }
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
      this.$overlay.hide()
    },
    async addCoAuthor (item) {
      try {
        const result = await this.$axios.$post(`${this.apiPath}${this.collaborationApi}`, {
          talent_id: this.talent.id,
          co_author_id: item.id
        })
        await this.fetchData()
        if (result) {
          this.$notifier.showMessage({ title: 'Added', content: `Added ${this.modelName} Successfully`, color: 'success' })
        }
        this.$emit('refresh')
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
    },
    async removeCoAuthor (item) {
      const coAuthor = this.$_.find(this.talent.Collaborations, { co_author_id: item.id })
      try {
        const result = await this.$axios.delete(`${this.apiPath}${this.collaborationApi}/${coAuthor.id}`)
        await this.fetchData()
        if (result) {
          this.$notifier.showMessage({ title: 'Removed', content: `Removed ${this.modelName} Successfully`, color: 'success' })
        }
        this.$emit('refresh')
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
    }
  }
}
</script>
