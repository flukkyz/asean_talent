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
              @click="$bus.$emit('open-host-form')"
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
              :to="localePath({name: 'backend-manages-hosts-uploads'})"
            >
              <v-icon small class="mr-1">
                fas fa-upload
              </v-icon>
              Upload
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
            single-expand
            :expanded.sync="expanded"
            show-expand
          >
            <template #[`item.img`]="{ item }">
              <v-img v-if="item.Img" :src="item.Img.url" width="80" />
            </template>
            <template #[`item.edit`]="{ item }">
              <v-icon
                small
                color="warning"
                @click="$bus.$emit('open-host-form', item)"
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

                  <!-- <label-value
                    label="Type"
                    :value="item.OrganizationType.name"
                  /> -->

                  <!-- <label-value
                    v-if="item.lat && item.lng"
                    label="Lat,Lng"
                    :value="`${item.lat}, ${item.lng}`"
                  /> -->

                  <!-- <label-value
                    label="City"
                    :value="item.City ? item.City.name : ''"
                  /> -->

                  <label-value
                    label="Country"
                    :value="item.Country.name"
                  />

                  <label-value
                    label="Contact name"
                    :value="item.contact_person"
                  />
                  <label-value
                    label="Contact phone"
                    :value="item.contact_phone"
                  />
                  <label-value
                    label="E-mail"
                    :value="item.email"
                  />
                  <label-value
                    label="Website"
                  >
                    <a v-if="item.website" :href="item.website" target="_blank" :rel="item.name">
                      {{ item.website }}
                    </a>
                    <p v-else class="caption mb-0 red--text">
                      No Data
                    </p>
                  </label-value>
                  <label-value
                    label="Social Media URL"
                  >
                    <a v-if="item.social_media_url" :href="item.social_media_url" target="_blank" :rel="item.name">
                      {{ item.social_media_url }}
                    </a>
                    <p v-else class="caption mb-0 red--text">
                      No Data
                    </p>
                  </label-value>
                  <p class="subtitle-1 font-weight-bold mb-0">
                    Keywords
                  </p>
                  <div v-if="item.keyword" class="d-flex flex-wrap">
                    <v-chip
                      v-for="(val, index) in item.keyword.split('; ')"
                      :key="`keyword-${index}`"
                      small
                      class="ma-1"
                      color="info"
                    >
                      {{ val }}
                    </v-chip>
                  </div>
                  <span v-else class="grey--text body-2">No Data</span>

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
    <forms-host
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
  middleware: ['authen-admin', 'backend', 'country_admin'],
  data () {
    return {
      api: `${process.env.apiUrl}${process.env.apiDirectory}hosts`,
      modelName: 'Host',
      listDatas: null,
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
          cellClass: 'pa-0',
          sortable: false
        },
        {
          text: 'Title',
          value: 'name',
          sortable: false
        },
        {
          text: 'Country',
          value: 'Country.name',
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
    }
  }
}
</script>
