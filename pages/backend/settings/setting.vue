<template>
  <v-container v-if="setting">
    <v-row justify="center" class="mb-10">
      <v-col cols="12">
        <v-card class=" shadow mb-5" color="primary" dark>
          <v-card-title>
            <p class="mb-0 headline font-weight-bold mr-3">
              {{ modelName }}
            </p>
          </v-card-title>
        </v-card>
        <v-card class=" shadow mb-5">
          <v-card-title>
            <p class="mb-0 title font-weight-bold mr-3">
              Home
            </p>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="setting.home_header_title"
              label="Home Header Title"
              outlined
              @change="save(setting)"
            />
            <v-textarea
              v-model="setting.home_header_detail"
              rows="4"
              label="Home Header Detail"
              outlined
              dense
              hide-details
              @change="save(setting)"
            />
          </v-card-text>
        </v-card>

        <v-card class=" shadow mb-5">
          <v-card-title>
            <p class="mb-0 title font-weight-bold mr-3">
              Contact
            </p>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="setting.website_name"
              label="Website Name"
              outlined
              @change="save(setting)"
            />
            <v-text-field
              v-model="setting.contact_name"
              label="Organization"
              outlined
              @change="save(setting)"
            />
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="setting.contact_office"
                  label="Office"
                  outlined
                  dense
                  @change="save(setting)"
                />
                <v-textarea
                  v-model="setting.contact_address"
                  rows="4"
                  label="Address"
                  outlined
                  dense
                  hide-details
                  @change="save(setting)"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="setting.contact_email"
                  class="mb-3 "
                  label="E-mail"
                  outlined
                  dense
                  hide-details
                  @change="save(setting)"
                />
                <v-text-field
                  v-model="setting.contact_tel"
                  class="mb-3 "
                  :label="$t('PHONE_NUMBER')"
                  outlined
                  dense
                  hide-details
                  @change="save(setting)"
                />
                <v-text-field
                  v-model="setting.contact_map_url"
                  class="mb-3 "
                  label="Url Map"
                  outlined
                  dense
                  hide-details
                  @change="save(setting)"
                />
                <v-text-field
                  v-model="setting.facebook_page_url"
                  class=""
                  label="facebook page Url"
                  outlined
                  dense
                  hide-details
                  @change="save(setting)"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class=" shadow mb-5">
          <v-card-title>
            <p class="mb-0 title font-weight-bold mr-3">
              Display Settings
            </p>
          </v-card-title>
          <v-card-text>
            <p class="font-weight-bold mb-3">
              Home
            </p>
            <v-row no-gutters>
              <v-col cols="12" md="6" lg="4" xl="3">
                <v-checkbox
                  v-model="setting.show_home_blog"
                  label="Show Blogs"
                  class="mr-8 mt-0"
                  hide-details
                  @change="save(setting)"
                />
              </v-col>
              <v-col cols="12" md="6" lg="4" xl="3">
                <v-checkbox
                  v-model="setting.show_home_pool"
                  class="mr-8 mt-0"
                  label="Show Talent Pool"
                  hide-details
                  @change="save(setting)"
                />
              </v-col>
            </v-row>

            <v-divider class="my-5" />

            <div class="d-flex align-center mb-3">
              <p class="font-weight-bold mb-0">
                Dashboard
              </p>
              <v-checkbox
                v-model="setting.show_menu_dashboard"
                class="ml-3 mt-0 pt-0"
                hide-details
                label="Show Menu"
                @change="dashboardMenuChange"
              />
            </div>
            <v-row no-gutters>
              <v-col cols="12" md="6" lg="4" xl="3">
                <v-checkbox
                  v-model="setting.show_dashboard_overview"
                  class="mr-8 mt-0"
                  label="Show Overview"
                  hide-details
                  @change="subDashboardMenuChange"
                />
              </v-col>
              <v-col cols="12" md="6" lg="4" xl="3">
                <v-checkbox
                  v-model="setting.show_dashboard_summary_industry"
                  class="mr-8 mr-8 mt-0"
                  label="Show Summary by industries"
                  hide-details
                  @change="subDashboardMenuChange"
                />
              </v-col>
              <v-col cols="12" md="6" lg="4" xl="3">
                <v-checkbox
                  v-model="setting.show_dashboard_keyword"
                  class="mr-8 mr-8 mt-0"
                  label="Show Top 100 keywords"
                  hide-details
                  @change="subDashboardMenuChange"
                />
              </v-col>
              <v-col cols="12" md="6" lg="4" xl="3">
                <v-checkbox
                  v-model="setting.show_dashboard_country_industry"
                  class="mr-8 mr-8 mt-0"
                  label="Show ASEAN Talents by country and industry"
                  hide-details
                  @change="subDashboardMenuChange"
                />
              </v-col>
              <v-col cols="12" md="6" lg="4" xl="3">
                <v-checkbox
                  v-model="setting.show_dashboard_country"
                  class="mr-8 mt-0"
                  label="Show ASEAN Talents by country"
                  hide-details
                  @change="subDashboardMenuChange"
                />
              </v-col>
            </v-row>

            <v-divider class="my-5" />

            <div class="d-flex align-center mb-3">
              <p class="font-weight-bold mb-0">
                Talent Pool
              </p>
              <v-checkbox
                v-model="setting.show_menu_talent_pool"
                class="ml-3 mt-0 pt-0"
                hide-details
                label="Show Menu"
                @change="talentPoolMenuChange"
              />
            </div>
            <v-row no-gutters>
              <v-col cols="12" md="6" lg="4" xl="3">
                <v-checkbox
                  v-model="setting.show_menu_asean_talent"
                  class="mt-0"
                  label="Show ASEAN Talent Menu"
                  hide-details
                  @change="subTalentPoolMenuChange"
                />
              </v-col>
              <v-col cols="12" md="6" lg="4" xl="3">
                <v-checkbox
                  v-model="setting.show_menu_young_talent"
                  class="mt-0"
                  label="Show Young Talent Menu"
                  hide-details
                  @change="subTalentPoolMenuChange"
                />
              </v-col>
            </v-row>

            <v-divider class="my-5" />

            <div class="d-flex align-center mb-3">
              <p class="font-weight-bold mb-0">
                Resources Menu
              </p>
              <v-checkbox
                v-model="setting.show_menu_resourse"
                class="ml-3 mt-0 pt-0"
                hide-details
                label="Show Menu"
                @change="resourcesMenuChange"
              />
            </div>
            <v-row no-gutters>
              <v-col cols="12" md="6" lg="4" xl="3">
                <v-checkbox
                  v-model="setting.show_menu_resourse_publication"
                  class="mt-0"
                  label="Show Publication Menu"
                  hide-details
                  @change="subResourcesMenuChange"
                />
              </v-col>
              <v-col cols="12" md="6" lg="4" xl="3">
                <v-checkbox
                  v-model="setting.show_menu_resourse_training_course"
                  class="mt-0"
                  label="Show Training Course Menu"
                  hide-details
                  @change="subResourcesMenuChange"
                />
              </v-col>
              <v-col cols="12" md="6" lg="4" xl="3">
                <v-checkbox
                  v-model="setting.show_menu_resourse_funding_organization"
                  class="mt-0"
                  label="Show Funding Organization Menu"
                  hide-details
                  @change="subResourcesMenuChange"
                />
              </v-col>
              <v-col cols="12" md="6" lg="4" xl="3">
                <v-checkbox
                  v-model="setting.show_menu_resourse_host"
                  class="mt-0"
                  label="Show Host Menu"
                  hide-details
                  @change="subResourcesMenuChange"
                />
              </v-col>
              <v-col cols="12" md="6" lg="4" xl="3">
                <v-checkbox
                  v-model="setting.show_menu_resourse_lab_location"
                  class="mt-0"
                  label="Show Lab Location Menu"
                  hide-details
                  @change="subResourcesMenuChange"
                />
              </v-col>
              <v-col cols="12" md="6" lg="4" xl="3">
                <v-checkbox
                  v-model="setting.show_menu_resourse_forum"
                  class="mt-0"
                  label="Show Forum Menu"
                  hide-details
                  @change="subResourcesMenuChange"
                />
              </v-col>
            </v-row>

            <v-divider class="my-5" />

            <p class="font-weight-bold mb-3">
              Other Menu
            </p>
            <v-row no-gutters>
              <v-col cols="12" md="6" lg="4" xl="3">
                <v-checkbox
                  v-model="setting.show_menu_paring_search"
                  class="mt-0"
                  label="Show Pairing Search Menu"
                  hide-details
                  @change="save(setting)"
                />
              </v-col>
              <v-col cols="12" md="6" lg="4" xl="3">
                <v-checkbox
                  v-model="setting.show_menu_asean_network"
                  class="mt-0"
                  label="Show ASEAN Network Menu"
                  hide-details
                  @change="save(setting)"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class=" shadow mb-5">
          <v-card-title>
            <p class="mb-0 title font-weight-bold mr-3">
              About Page
            </p>
            <v-spacer />
            <v-btn
              fab
              class="shadow "
              x-small
              color="warning"
              @click="$bus.$emit('open-popup-form', setting,'about_page','About Page')"
            >
              <v-icon small>
                fas fa-edit
              </v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div v-if="setting.about_page" class="pa-8  white">
              <div class="ck-content" v-html="setting.about_page" />
            </div>
            <h2 v-else class="pa-8 text-center grey--text">
              No Data
            </h2>
          </v-card-text>
        </v-card>

        <v-card class=" shadow mb-5">
          <v-card-title>
            <p class="mb-0 title font-weight-bold mr-3">
              Member Notice
            </p>
            <v-spacer />
            <v-btn
              fab
              class="shadow "
              x-small
              color="warning"
              @click="$bus.$emit('open-popup-form', setting,'member_notice','Member Notice')"
            >
              <v-icon small>
                fas fa-edit
              </v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div v-if="setting.member_notice" class="pa-8  white">
              <div class="ck-content" v-html="setting.member_notice" />
            </div>
            <h2 v-else class="pa-8 text-center grey--text">
              No Data
            </h2>
          </v-card-text>
        </v-card>

        <v-card class=" shadow mb-5">
          <v-card-title>
            <p class="mb-0 title font-weight-bold mr-3">
              Pop up in Home page
            </p>
            <v-switch
              v-model="setting.popup_show"
              inset
              class="ml-1"
              :color="setting.popup_show ? 'success' : 'error'"
              @change="save(setting)"
            >
              <template #label>
                <span v-if="setting.popup_show" class="success--text font-weight-bold title">
                  Show popup first
                </span>
                <span v-else class="error--text font-weight-bold title">
                  Hide popup
                </span>
              </template>
            </v-switch>
            <v-checkbox
              v-model="setting.popup_close"
              class="ml-3"
              :disabled="!setting.popup_show"
              label="Show Pop up close"
              @change="save(setting)"
            />
            <v-spacer />
            <v-btn
              fab
              class="shadow "
              x-small
              color="warning"
              @click="$bus.$emit('open-popup-form', setting,'popup_content',' Pop up')"
            >
              <v-icon small>
                fas fa-edit
              </v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div v-if="setting.popup_content" class="pa-8  white">
              <div class="ck-content" v-html="setting.popup_content" />
            </div>
            <h2 v-else class="pa-8 text-center grey--text">
              No Data
            </h2>
          </v-card-text>
        </v-card>

        <v-card class=" shadow mb-5">
          <v-card-title>
            <p class="mb-0 title font-weight-bold mr-3">
              Cookies consent Detail
            </p>
            <v-spacer />
            <v-btn
              fab
              class="shadow "
              x-small
              color="warning"
              @click="$bus.$emit('open-popup-form', setting,'pdpa',' Cookies consent',false)"
            >
              <v-icon small>
                fas fa-edit
              </v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div v-if="setting.pdpa" class="pa-8  white">
              <div class="ck-content" v-html="setting.pdpa" />
            </div>
            <h2 v-else class="pa-8 text-center grey--text">
              No Data
            </h2>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <forms-editor @save="save" />
  </v-container>
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'admin'],
  data () {
    return {
      api: `${process.env.apiUrl}${process.env.apiDirectory}setting`,
      modelName: 'Settings',
      setting: null,
      logo: null,
      portait: null,
      landscape: null,
      logoPreview: null,
      portaitPreview: null,
      landscapePreview: null
    }
  },
  async fetch () {
    try {
      const setting = await this.$axios.$get(this.api)
      this.setting = setting
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
    this.$overlay.hide()
  },
  head () {
    return {
      title: this.modelName
    }
  },
  created () {
    this.$breadcrumbs.clear()
  },
  methods: {
    async dashboardMenuChange () {
      if (this.setting.show_menu_dashboard) {
        this.setting.show_dashboard_overview = true
        this.setting.show_dashboard_summary_industry = true
        this.setting.show_dashboard_keyword = true
        this.setting.show_dashboard_country_industry = true
        this.setting.show_dashboard_country = true
      } else {
        this.setting.show_dashboard_overview = false
        this.setting.show_dashboard_summary_industry = false
        this.setting.show_dashboard_keyword = false
        this.setting.show_dashboard_country_industry = false
        this.setting.show_dashboard_country = false
      }
      await this.save(this.setting)
    },
    async subDashboardMenuChange (val) {
      if (val) {
        this.setting.show_menu_dashboard = true
      } else if ([this.setting.show_dashboard_overview, this.setting.show_dashboard_summary_industry, this.setting.show_dashboard_keyword, this.setting.show_dashboard_country_industry, this.setting.show_dashboard_country].every(v => !v)) {
        this.setting.show_menu_dashboard = false
      }
      await this.save(this.setting)
    },
    async talentPoolMenuChange () {
      if (this.setting.show_menu_talent_pool) {
        this.setting.show_menu_asean_talent = true
        this.setting.show_menu_young_talent = true
      } else {
        this.setting.show_menu_asean_talent = false
        this.setting.show_menu_young_talent = false
      }
      await this.save(this.setting)
    },
    async subTalentPoolMenuChange (val) {
      if (val) {
        this.setting.show_menu_talent_pool = true
      } else if ([this.setting.show_menu_asean_talent, this.setting.show_menu_young_talent].every(v => !v)) {
        this.setting.show_menu_talent_pool = false
      }
      await this.save(this.setting)
    },
    async resourcesMenuChange () {
      if (this.setting.show_menu_resourse) {
        this.setting.show_menu_resourse_publication = true
        this.setting.show_menu_resourse_training_course = true
        this.setting.show_menu_resourse_funding_organization = true
        this.setting.show_menu_resourse_host = true
        this.setting.show_menu_resourse_lab_location = true
        this.setting.show_menu_resourse_forum = true
      } else {
        this.setting.show_menu_resourse_publication = false
        this.setting.show_menu_resourse_training_course = false
        this.setting.show_menu_resourse_funding_organization = false
        this.setting.show_menu_resourse_host = false
        this.setting.show_menu_resourse_lab_location = false
        this.setting.show_menu_resourse_forum = false
      }
      await this.save(this.setting)
    },
    async subResourcesMenuChange (val) {
      if (val) {
        this.setting.show_menu_resourse = true
      } else if ([this.setting.show_menu_resourse_publication, this.setting.show_menu_resourse_training_course, this.setting.show_menu_resourse_funding_organization, this.setting.show_menu_resourse_host, this.setting.show_menu_resourse_lab_location, this.setting.show_menu_resourse_forum].every(v => !v)) {
        this.setting.show_menu_resourse = false
      }
      await this.save(this.setting)
    },
    async save (data) {
      try {
        const result = await this.$axios.$put(this.api, data)
        await this.$fetch()
        if (result) {
          this.$notifier.showMessage({ title: 'Settings Updated', color: 'success' })
        }
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
      this.$overlay.hide()
    }
  }
}
</script>
