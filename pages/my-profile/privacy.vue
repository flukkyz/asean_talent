<template>
  <div class="">
    <div class="hero-image" style="height: 96px;">
      <v-container fluid :class="['d-flex align-center h-100',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column justify-center' : 'justify-space-between px-5']">
        <h1 :class="['font-weight-bold',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'headline' : 'display-1']">
          Settings
        </h1>
      </v-container>
    </div>
    <div class="pt-8 pb-16">
      <v-container fluid class="px-5">
        <v-form ref="form" v-model="valid" :disabled="saving" @submit.prevent="save">
          <div :class="['d-flex',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : 'justify-space-between align-start']">
            <div class="mr-3">
              <p class="title mb-0 font-weight-bold">
                Data and Privacy
              </p>
              <p class="mb-0 grey--text">
                Your personal information is confidential, but you have the option to selectively disclose
                <br v-if="!['xs', 'sm'].includes($vuetify.breakpoint.name)">
                certain details through the ASEAN talent service.
              </p>
            </div>
            <div v-if="editing" :class="['d-flex align-center',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column justify-center mt-3' : 'justify-space-between']">
              <v-btn
                large
                class="rounded-lg"
                :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'mt-3 order-last' : 'mr-3'"
                :disabled="saving"
                outlined
                :block="['xs', 'sm'].includes($vuetify.breakpoint.name)"
                color="themeAccent"
                :loading="saving"
                @click="cancelEditing"
              >
                <v-icon small left>
                  fas fa-times
                </v-icon>
                Cancel
              </v-btn>
              <v-btn
                type="submit"
                large
                dark
                :block="['xs', 'sm'].includes($vuetify.breakpoint.name)"
                class="rounded-lg"
                :disabled="saving || !valid"
                color="themeAccent"
                :loading="saving"
              >
                <v-icon small left>
                  fas fa-check
                </v-icon>
                Update Privacy
              </v-btn>
            </div>
            <v-btn
              v-else
              large
              dark
              depressed
              color="themeAccent"
              class="rounded-lg"
              :class="[['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'mt-3' : '']"
              @click="editing = true"
            >
              <v-icon small left>
                fas fa-edit
              </v-icon>

              Edit Privacy
            </v-btn>
          </div>
          <v-divider class="my-5" />

          <div class="">
            <v-checkbox
              label="Select All"
              hide-details
              :input-value="checkAll"
              :disabled="!editing"
              :indeterminate="!checkAll && checkSome"
              @change="selectAll"
            />
            <div class="pl-8">
              <v-checkbox
                v-model="form.gender"
                :disabled="!editing"
                label="Gender"
                hide-details
              />
              <v-checkbox
                v-model="form.name"
                :disabled="!editing"
                label="Name"
                hide-details
              />
              <v-checkbox
                v-model="form.email"
                :disabled="!editing"
                label="E-mail"
                hide-details
              />
              <v-checkbox
                v-model="form.organization"
                :disabled="!editing"
                label="Organization"
                hide-details
              />
              <div v-if="$auth.user.member_type === 'researcher'">
                <v-checkbox
                  v-model="form.education_info"
                  :disabled="!editing"
                  label="Education Info"
                  hide-details
                />
                <v-checkbox
                  v-model="form.researcher_info"
                  :disabled="!editing"
                  label="Researcher Info"
                  hide-details
                />
              </div>
            </div>
          </div>
        </v-form>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'member',
  middleware: ['authen', 'frontend'],
  data () {
    return {
      pageName: 'Data and Privacy',
      basePath: `${process.env.baseUrl}${this.$route.fullPath}`,
      authApi: `${process.env.apiUrl}${process.env.apiDirectory}auth`,
      valid: true,
      saving: false,
      editing: false,
      form: {}
    }
  },
  async fetch () {
    try {
      await this.$auth.fetchUser()
      this.form = {
        ...this.$auth.user.DataPrivacy
      }
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
    this.$overlay.hide()
  },
  head () {
    return this.$headUtil({
      lang: this.$lang.getISO,
      title: this.pageName,
      urlPath: this.basePath
    })
  },
  computed: {
    checkAll () {
      return [
        this.form.gender,
        this.form.name,
        this.form.email,
        this.form.organization,
        this.form.education_info,
        this.form.researcher_info
      ].every(ele => ele)
    },
    checkSome () {
      return [
        this.form.gender,
        this.form.name,
        this.form.email,
        this.form.organization,
        this.form.education_info,
        this.form.researcher_info
      ].some(ele => ele)
    }
  },
  created () {
    this.$breadcrumbs.clear()
  },
  methods: {
    selectAll () {
      if (this.checkAll) {
        this.form.gender = false
        this.form.name = false
        this.form.email = false
        this.form.organization = false
        this.form.education_info = false
        this.form.researcher_info = false
      } else {
        this.form.gender = true
        this.form.name = true
        this.form.email = true
        this.form.organization = true
        this.form.education_info = true
        this.form.researcher_info = true
      }
    },
    async cancelEditing () {
      this.editing = false
      await this.$fetch()
    },
    async save  () {
      if (this.$refs.form.validate()) {
        this.saving = true
        this.editing = false
        try {
          await this.$axios.$post(`${this.authApi}/update-data-privacy`, this.form)
          this.$notifier.showMessage({ title: this.$t('UPDATED'), content: this.$t('UPDATED_', { text: 'Data Privacy' }), color: 'primary', icon: 'fas fa-check' })
          await this.$fetch()
        } catch (e) {
          this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
        } finally {
          this.saving = false
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hero-image {
  background: linear-gradient(to left, #d6d6e6 0%, #f0f0f5 100%);
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
