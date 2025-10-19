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
          <v-card-title>
            <v-checkbox
              v-for="(value,key) in memberTypes"
              :key="value"
              v-model="selectedMemberType"
              :label="key"
              class="mt-0 mr-3"
              :value="value"
              hide-details
              @change="onSelectMemberType"
            />
            <v-spacer />
            <v-autocomplete
              v-if="$auth.user.role !== 'country_admin'"
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
          </v-card-title>
          <v-data-table
            dense
            disable-pagination
            hide-default-footer
            :headers="tableHeaders"
            :items="listDatas.rows"
            show-expand
            single-expand
          >
            <template #[`item.name`]="{ item }">
              <span v-if="item.member_type === 'researcher'">
                {{ item.Researcher.lastname }},
                {{ item.Researcher.firstname }}
                {{ item.Researcher.middlename || '' }}
                <span v-if="item.Researcher.title && item.Researcher.title !== 'Unspecified'">
                  ({{ item.Researcher.title }})
                </span>
              </span>
              <span v-else-if="item.member_type === 'organization'">
                {{ item.Organization.name }}
              </span>
            </template>
            <template #[`item.verify`]="{ item }">
              <v-icon :color="item.verify_at ? 'success' : 'grey'" small>
                {{ item.verify_at ? 'fas fa-check' : 'fas fa-clock' }}
              </v-icon>
            </template>
            <template #[`item.country`]="{ item }">
              <span v-if="item.member_type === 'researcher'">
                {{ item.Researcher.Country.name }}
              </span>
              <span v-else-if="item.member_type === 'organization'">
                {{ item.Organization.Country.name }}
              </span>
            </template>
            <template #[`item.last_login`]="{ item }">
              <div>
                <template v-if="item.MemberAccessTokens.length > 0">
                  {{ $dateText(item.MemberAccessTokens[0].createdAt,'short','long') }}
                  &nbsp;
                  <span class="caption teal--text">
                    <span class="font-weight-bold">
                      ip
                    </span>
                    {{ item.MemberAccessTokens[0].ip }}
                  </span>
                </template>
                <span v-else class="red--text very-small">
                  No Data
                </span>
              </div>
            </template>
            <template #expanded-item="{ headers, item }">
              <td :colspan="headers.length" class="pa-5">
                <v-row>
                  <v-col md="3">
                    <div class="d-flex flex-column align-center mt-4">
                      <p class="body-1 mb-3 font-weight-bold">
                        {{ $t('PROFILE_IMAGE') }}
                      </p>
                      <v-avatar size="120" class="shadow">
                        <v-img v-if="item.avatar" :src="item.avatar" />
                        <v-img v-else src="/images/logo.png" />
                      </v-avatar>
                    </div>
                  </v-col>
                  <v-col md="9">
                    <div class="white px-5 py-3  mt-2">
                      <div class="mb-3">
                        <p class="mb-0 font-weight-bold mr-5 body-1">
                          E-mail
                          <v-btn
                            v-if="!item.verify_at"
                            x-small
                            class="ml-3"
                            color="success"
                            outlined
                            @click="onVerify(item)"
                          >
                            Verify this E-mail
                          </v-btn>
                        </p>
                        <p class="mb-0 title primary--text white">
                          {{ item.email }}
                          <v-icon
                            v-if="!item.verify_at"
                            small
                            color="warning"
                            @click="$bus.$emit('open-member-form', item)"
                          >
                            fas fa-edit
                          </v-icon>
                        </p>
                      </div>
                      <v-divider class="my-2" />
                      <div v-if="item.member_type === 'researcher'">
                        <p class="grey--text mb-1 mt-5 font-weight-bold">
                          Personal Info
                        </p>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            {{ $t('NAME') }}
                          </p>
                          <p class="mb-0">
                            {{ item.Researcher.lastname }},
                            {{ item.Researcher.firstname }}
                            {{ item.Researcher.middlename || '' }}
                            <span v-if="item.Researcher.title && item.Researcher.title !== 'Unspecified'">
                              ({{ item.Researcher.title }})
                            </span>
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Gender
                          </p>
                          <p class="mb-0">
                            {{ item.Researcher.gender }}
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Department
                          </p>
                          <p class="mb-0">
                            {{ item.Researcher.department }}
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Organization
                          </p>
                          <p class="mb-0">
                            {{ item.Researcher.organization }}
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Religion
                          </p>
                          <p class="mb-0">
                            {{ item.Researcher.religion || '-' }}
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Phone Number
                          </p>
                          <p class="mb-0">
                            {{ item.Researcher.phone_number || '-' }}
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            {{ $t('ADDRESS') }}
                          </p>
                          <p class="mb-0">
                            {{ item.Researcher.address || '-' }}
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            City
                          </p>
                          <p class="mb-0">
                            {{ item.Researcher.city || '-' }}
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Country
                          </p>
                          <p class="mb-0">
                            {{ item.Researcher.Country.name || '-' }}
                          </p>
                        </div>
                        <p class="grey--text mb-1 mt-5 font-weight-bold">
                          Education Info
                        </p>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Graduate (Top-Level)
                          </p>
                          <p class="mb-0">
                            {{ item.Researcher.graduate }}
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Graduate Country
                          </p>
                          <p class="mb-0">
                            {{ item.Researcher.GraduateCountry.name }}
                          </p>
                        </div>
                        <p class="grey--text mb-1 mt-5 font-weight-bold">
                          Researcher Info
                        </p>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Keywords
                          </p>
                          <div v-if="item.Researcher.keyword" class="d-flex flex-wrap">
                            <v-chip
                              v-for="(val, index) in item.Researcher.keyword.split('; ')"
                              :key="`keyword-${index}`"
                              small
                              class="ma-1"
                              color="info"
                            >
                              {{ val }}
                            </v-chip>
                          </div>
                          <p v-else class="mb-0">
                            -
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Expert
                          </p>
                          <div v-if="item.Researcher.expert" class="d-flex flex-wrap">
                            <v-chip
                              v-for="(val, index) in item.Researcher.expert.split('; ')"
                              :key="`expert-${index}`"
                              small
                              class="ma-1"
                              color="info"
                            >
                              {{ val }}
                            </v-chip>
                          </div>
                          <p v-else class="mb-0">
                            -
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Case Study / Sample Group
                          </p>
                          <p class="mb-0">
                            {{ item.Researcher.case_study || '-' }}
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Previous research location
                          </p>
                          <p class="mb-0">
                            {{ item.Researcher.hot_issue || '-' }}
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            New research location
                          </p>
                          <p class="mb-0">
                            {{ item.Researcher.research_country || '-' }}
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Research Period
                          </p>
                          <p class="mb-0">
                            <span v-if="item.Researcher.length">
                              {{ item.Researcher.length }}
                              Month
                            </span>
                            <span v-else>-</span>
                          </p>
                        </div>

                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Number of Research Team Members
                          </p>
                          <p class="mb-0">
                            {{ item.Researcher.no_of_coauthor || '-' }}
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Scopus URL
                          </p>
                          <a v-if="item.Researcher.link_scopus" :href="item.Researcher.link_scopus" target="_blank">
                            <p class="mb-0">
                              {{ item.Researcher.link_scopus }}
                            </p>
                          </a>
                          <p v-else class="mb-0">
                            -
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Linkedin URL
                          </p>
                          <a v-if="item.Researcher.link_linkedin" :href="item.Researcher.link_linkedin" target="_blank">
                            <p class="mb-0">
                              {{ item.Researcher.link_linkedin }}
                            </p>
                          </a>
                          <p v-else class="mb-0">
                            -
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Research Gate URL
                          </p>
                          <a v-if="item.Researcher.research_gate" :href="item.Researcher.research_gate" target="_blank">
                            <p class="mb-0">
                              {{ item.Researcher.research_gate }}
                            </p>
                          </a>
                          <p v-else class="mb-0">
                            -
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            CV
                          </p>
                          <a v-if="item.Researcher.cv" :href="item.Researcher.cv" target="_blank">
                            view CV
                          </a>
                          <p v-else class="mb-0">
                            -
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Patient of Researcher
                          </p>
                          <p class="mb-0">
                            {{ item.Researcher.patient || '-' }}
                          </p>
                        </div>
                      </div>
                      <div v-else-if="item.member_type === 'organization'">
                        <p class="grey--text mb-1 mt-5 font-weight-bold">
                          Organization Info
                        </p>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            {{ $t('NAME') }}
                          </p>
                          <p class="mb-0">
                            {{ item.Organization.name }}
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Organization Type
                          </p>
                          <p class="mb-0">
                            {{ item.Organization.OrganizationType.name }}
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Amount of Staff
                          </p>
                          <p class="mb-0">
                            {{ item.Organization.size || '-' }}
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Product and Service
                          </p>
                          <p class="mb-0">
                            {{ item.Organization.product || '-' }}
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Research Area
                          </p>
                          <p class="mb-0">
                            {{ item.Organization.product || '-' }}
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            {{ $t('ADDRESS') }}
                          </p>
                          <p class="mb-0">
                            {{ item.Organization.address || '-' }}
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            City
                          </p>
                          <p class="mb-0">
                            {{ item.Organization.city || '-' }}
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Country
                          </p>
                          <p class="mb-0">
                            {{ item.Organization.Country.name || '-' }}
                          </p>
                        </div>
                        <p class="grey--text mb-1 mt-5 font-weight-bold">
                          Contact Info
                        </p>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Contact Name
                          </p>
                          <p class="mb-0">
                            {{ item.Organization.contact_name || '-' }}
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Department
                          </p>
                          <p class="mb-0">
                            {{ item.Organization.department || '-' }}
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Phone Number
                          </p>
                          <p class="mb-0">
                            {{ item.Organization.contact_email || '-' }}
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Linkedin URL
                          </p>
                          <a v-if="item.Organization.link_linkedin" :href="item.Organization.link_linkedin" target="_blank">
                            <p class="mb-0">
                              {{ item.Organization.link_linkedin }}
                            </p>
                          </a>
                          <p v-else class="mb-0">
                            -
                          </p>
                        </div>
                        <div class="mb-3">
                          <p class="mb-0 font-weight-bold mr-5 caption">
                            Patient of the organization
                          </p>
                          <p class="mb-0">
                            {{ item.Organization.patient || '-' }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </td>
            </template>
            <template #[`item.delete`]="{ item }">
              <v-icon
                small
                color="error"
                @click="$bus.$emit('open-delete-dialog', item.id, item.member_type === 'researcher' ? `${item.Researcher.firstname} ${item.Researcher.lastname}` : item.Organization.name)"
              >
                fas fa-trash
              </v-icon>
            </template>
          </v-data-table>
          <v-divider />
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
    <forms-member @save="submitUpdate" />
    <dialogs-confirm @confirm="submitVerify" />
    <dialogs-delete @delete="submitDelete" />
  </v-container>
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'country_admin'],
  data () {
    return {
      api: `${process.env.apiUrl}${process.env.apiDirectory}members`,
      countryApi: `${process.env.apiUrl}${process.env.apiDirectory}countries`,
      modelName: 'Member List',
      selectedMemberType: [],
      listDatas: null,
      countries: null,
      queryParams: {
        size: 20,
        q: '',
        page: 1,
        country: '',
        memberType: ''
      },
      tableHeaders: [
        {
          text: 'E-mail',
          value: 'email',
          sortable: false
        },
        {
          text: 'Name',
          value: 'name',
          sortable: false
        },
        {
          text: 'Country',
          value: 'country',
          sortable: false
        },
        {
          text: 'Verify',
          value: 'verify',
          align: 'center',
          sortable: false
        },
        {
          text: 'Last Login',
          value: 'last_login',
          sortable: false
        },
        {
          text: 'Delete',
          value: 'delete',
          width: 50,
          align: 'center',
          sortable: false
        },
        { text: '', value: 'data-table-expand' }
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
    const searchParams = new URLSearchParams(this.queryParams).toString()
    try {
      const users = await this.$axios.$get(`${this.api}${(searchParams ? '?' + searchParams : '')}`)
      this.listDatas = users
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
    memberTypes () {
      return this.$store.state.enums.memberTypes
    }
  },
  async mounted () {
    if (this.$auth.user.role !== 'country_admin') {
      try {
        const countries = await this.$axios.$get(this.countryApi)
        this.countries = countries.rows
      } catch (e) {
        this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
      }
    }
  },
  methods: {
    async onSearch () {
      this.queryParams.page = 1
      await this.$fetch()
    },
    async onSelectMemberType () {
      this.queryParams.memberType = this.selectedMemberType.length === 1 ? this.selectedMemberType[0] : ''
      await this.onSearch()
    },
    async submitUpdate (data) {
      try {
        await this.$axios.$put(`${this.api}/${data.id}`, data)
        await this.$fetch()
        this.$notifier.showMessage({ title: 'Edited', content: 'Edit E-mail Successfully', color: 'success' })
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
      this.$overlay.hide()
    },
    onVerify (item) {
      this.$bus.$emit('open-confirm-dialog', item, {
        header: {
          text: 'Verify E-mail'
        },
        detail: {
          text: `Verify E-mail : ${item.email}`
        },
        yesBtn: {
          color: 'success',
          text: 'Verify'
        },
        noBtn: {
          color: 'grey',
          text: 'Cancel'
        }
      })
    },
    async submitVerify (data) {
      try {
        await this.$axios.$post(`${this.api}/verify`, { id: data.id })
        await this.$fetch()
        this.$notifier.showMessage({ title: 'Verified', content: 'Verify E-mail Successfully', color: 'success' })
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
