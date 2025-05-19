<template>
  <div>
    <v-form ref="form" v-model="valid" autocomplete="off" @submit.prevent="save">
      <v-tabs
        background-color="transparent"
        slider-color="transparent"
        active-class="themeAccent rounded-lg white--text"
        class="mb-12"
        centered
        height="30"
        @change="changeType"
      >
        <v-tab v-for="memberType in memberTypes" :key="`tab-${memberType}`">
          {{ memberType }}
        </v-tab>
      </v-tabs>
      <v-card
        :elevation="['xs', 'sm'].includes($vuetify.breakpoint.name) ? '0' : ''"
        :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'rounded-0' : 'shadow rounded-lg'"
        max-width="1200"
      >
        <v-card-text class="px-12 py-8">
          <p class="grey--text ml-3 font-weight-bold">
            Authentication Info
          </p>
          <v-text-field
            v-model="form.email"
            outlined
            class="rounded-lg"
            autocomplete="off"
            autofocus
            :rules="rules.email"
            :hint="$t('INPUT_HINT',{text: ' E-mail '})"
            :error-messages="errors"
            required
            dense
            @input="checkDuplicate"
          >
            <template #label>
              E-mail
              <v-icon color="error" x-small class="mt-n3">
                mdi-asterisk
              </v-icon>
            </template>
          </v-text-field>
          <v-text-field
            v-model="form.password"
            type="password"
            outlined
            class="rounded-lg"
            autocomplete="off"
            :rules="rules.password"
            :hint="$t('INPUT_HINT',{text: ' Password '})"
            dense
            required
          >
            <template #label>
              Password
              <v-icon color="error" x-small class="mt-n3">
                mdi-asterisk
              </v-icon>
            </template>
          </v-text-field>
          <v-text-field
            v-model="form.confirm_password"
            type="password"
            outlined
            class="rounded-lg"
            autocomplete="off"
            :rules="rules.confirmPassword"
            dense
            :hint="$t('INPUT_HINT',{text: $t('USER_CONFIRM_PASSWORD')})"
            required
          >
            <template #label>
              {{ $t('USER_CONFIRM_PASSWORD') }}
              <v-icon color="error" x-small class="mt-n3">
                mdi-asterisk
              </v-icon>
            </template>
          </v-text-field>
          <v-divider
            class="mb-5"
          />
          <div v-if="form.member_type === 'researcher'" class="mb-5">
            <p class="grey--text ml-3 font-weight-bold">
              Profile Info
            </p>
            <label>
              Gender
              <v-icon color="error" x-small class="mt-n3">
                mdi-asterisk
              </v-icon>
            </label>
            <v-radio-group
              v-model="researcher.gender"
              row
              class="mt-0 mb-3"
              :rules="rules.gender"
              required
            >
              <v-radio
                v-for="value in ['Male', 'Female','Unspecified']"
                :key="value"
                :label="value"
                :value="value"
              />
            </v-radio-group>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-combobox
                  v-model="researcher.title"
                  outlined
                  class="rounded-lg"
                  label="Academic Title"
                  :items="academicTitles"
                  clearable
                  dense
                />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field
                  v-model="researcher.firstname"
                  outlined
                  class="rounded-lg"
                  :rules="rules.firstname"
                  dense
                  required
                >
                  <template #label>
                    {{ $t('FIRSTNAME') }}
                    <v-icon color="error" x-small class="mt-n3">
                      mdi-asterisk
                    </v-icon>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field
                  v-model="researcher.middlename"
                  outlined
                  class="rounded-lg"
                  label="Middlename"
                  dense
                />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field
                  v-model="researcher.lastname"
                  outlined
                  class="rounded-lg"
                  :rules="rules.lastname"
                  dense
                  required
                >
                  <template #label>
                    {{ $t('LASTNAME') }}
                    <v-icon color="error" x-small class="mt-n3">
                      mdi-asterisk
                    </v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="researcher.department"
                  outlined
                  class="rounded-lg"
                  :rules="rules.department"
                  dense
                  required
                >
                  <template #label>
                    Department
                    <v-icon color="error" x-small class="mt-n3">
                      mdi-asterisk
                    </v-icon>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="researcher.organization"
                  outlined
                  class="rounded-lg"
                  :rules="rules.organization"
                  dense
                  required
                >
                  <template #label>
                    Organization
                    <v-icon color="error" x-small class="mt-n3">
                      mdi-asterisk
                    </v-icon>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-combobox
                  v-model="researcher.religion"
                  outlined
                  class="rounded-lg"
                  label="Religion"
                  :items="religions"
                  clearable
                  dense
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="researcher.phone_number"
                  label="Phone Number"
                  outlined
                  class="rounded-lg"
                  dense
                />
              </v-col>
            </v-row>
            <v-textarea
              v-model="researcher.address"
              label="Address"
              rows="3"
              outlined
              class="rounded-lg"
              dense
            />

            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="researcher.city"
                  label="City"
                  outlined
                  class="rounded-lg"
                  dense
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  v-model="researcher.country_id"
                  :items="countries"
                  item-value="id"
                  item-text="name"
                  outlined
                  class="rounded-lg"
                  dense
                  :rules="rules.country"
                >
                  <template #label>
                    Country
                    <v-icon color="error" x-small class="mt-n3">
                      mdi-asterisk
                    </v-icon>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>

            <p class="grey--text ml-3 font-weight-bold">
              Education Info
            </p>

            <v-row>
              <v-col cols="12" sm="6">
                <v-combobox
                  v-model="researcher.graduate"
                  outlined
                  class="rounded-lg"
                  :items="degrees"
                  dense
                  required
                >
                  <template #label>
                    Graduate (Top-Level)
                    <v-icon color="error" x-small class="mt-n3">
                      mdi-asterisk
                    </v-icon>
                  </template>
                </v-combobox>
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  v-model="researcher.graduate_country_id"
                  :items="countries"
                  item-value="id"
                  item-text="name"
                  outlined
                  class="rounded-lg"
                  dense
                  :rules="rules.country"
                >
                  <template #label>
                    Graduate Country
                    <v-icon color="error" x-small class="mt-n3">
                      mdi-asterisk
                    </v-icon>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>

            <p class="grey--text ml-3 font-weight-bold">
              Researcher Info
            </p>

            <v-combobox
              v-model="keywords"
              hide-selected
              multiple
              append-icon
              outlined
              class="rounded-lg"
              label="Keywords"
              dense
              hint="Input Keyword and Enter or Tab for added"
              clearable
              chips
              deletable-chips
              small-chips
              persistent-hint
              @change="updateKeywords"
            />

            <v-combobox
              v-model="experts"
              hide-selected
              multiple
              label="Experts"
              append-icon
              outlined
              class="rounded-lg"
              dense
              hint="Input Expert and Enter or Tab for added"
              clearable
              chips
              deletable-chips
              small-chips
              persistent-hint
              @change="updateExperts"
            />
            <label class="ml-3 caption" for="">Case Study / Sample Group</label>
            <v-textarea
              v-model="researcher.case_study"
              outlined
              class="rounded-lg"
              placeholder="Please specify the research examples or case studies you are interested in studying in the future"
              rows="3"
              dense
            />
            <label class="ml-3 caption" for="">Previous research location</label>
            <v-textarea
              v-model="researcher.hot_issue"
              placeholder="Please specify your previous research location"
              rows="3"
              outlined
              class="rounded-lg"
              dense
            />
            <label class="ml-3 caption" for="">New research location</label>
            <v-textarea
              v-model="researcher.research_country"
              placeholder="Please specify your new research location"
              rows="3"
              outlined
              class="rounded-lg"
              dense
            />
            <v-row>
              <v-col cols="12" sm="6">
                <label class="ml-3 caption" for="">&nbsp;</label>
                <v-autocomplete
                  v-model="researcher.length"
                  label="Research Period (Month)"
                  :items="[6, 8, 12, 24, 36]"
                  outlined
                  class="rounded-lg"
                  dense
                />
              </v-col>
              <v-col cols="12" sm="6">
                <label class="ml-3 caption" for="">&nbsp;</label>
                <v-currency-field
                  v-model="researcher.no_of_coauthor"
                  label="Number of Research Team Members"
                  outlined
                  class="rounded-lg"
                  :min="0"
                  :decimal-length="0"
                  dense
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="researcher.link_scopus"
                  label="Scopus URL"
                  outlined
                  class="rounded-lg"
                  hide-details="auto"
                  dense
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="researcher.link_linkedin"
                  label="Linkedin URL"
                  outlined
                  class="rounded-lg"
                  hide-details="auto"
                  dense
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="researcher.research_gate"
                  label="Research Gate URL"
                  outlined
                  class="rounded-lg"
                  hide-details="auto"
                  dense
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-file-input
                  v-model="cv_img"
                  accept="image/jpeg,image/gif,image/png,application/pdf"
                  prepend-inner-icon="mdi-paperclip"
                  prepend-icon=""
                  outlined
                  :rules="rules.cv_img"
                  dense
                  class="rounded-lg"
                  :show-size="1000"
                >
                  <template #label>
                    CV
                    <span class="caption">{{ $t('LESS_SIZE', { text: $t('FILE'), count: '2 MB' }) }}</span>
                  </template>
                </v-file-input>
              </v-col>
            </v-row>
            <v-textarea
              v-model="researcher.patient"
              label="Patient of Researcher"
              rows="3"
              outlined
              class="rounded-lg"
              dense
            />
          </div>
          <div v-else-if="form.member_type === 'organization'" class="mb-5">
            <p class="grey--text ml-3 font-weight-bold">
              Organization Info
            </p>
            <v-autocomplete
              v-model="organization.organization_type_id"
              :items="organizationTypes"
              item-value="id"
              item-text="name"
              outlined
              class="rounded-lg"
              dense
              :rules="rules.organization_type"
            >
              <template #label>
                Organization Type
                <v-icon color="error" x-small class="mt-n3">
                  mdi-asterisk
                </v-icon>
              </template>
            </v-autocomplete>
            <v-text-field
              v-model="organization.name"
              outlined
              class="rounded-lg"
              :rules="rules.name"
              dense
              required
            >
              <template #label>
                Company Name
                <v-icon color="error" x-small class="mt-n3">
                  mdi-asterisk
                </v-icon>
              </template>
            </v-text-field>

            <v-currency-field
              v-model="organization.size"
              label="Amount of Staff"
              outlined
              class="rounded-lg"
              :min="0"
              :decimal-length="0"
              dense
            />

            <v-textarea
              v-model="organization.product"
              label="Product and Service"
              outlined
              class="rounded-lg"
              dense
              rows="3"
            />
            <v-textarea
              v-model="organization.research_area"
              label="Research Area"
              outlined
              class="rounded-lg"
              dense
              rows="3"
            />
            <v-textarea
              v-model="organization.address"
              label="Address"
              rows="3"
              outlined
              class="rounded-lg"
              dense
            />

            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="organization.city"
                  label="City"
                  outlined
                  class="rounded-lg"
                  dense
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  v-model="organization.country_id"
                  :items="countries"
                  item-value="id"
                  item-text="name"
                  outlined
                  class="rounded-lg"
                  dense
                  :rules="rules.country"
                >
                  <template #label>
                    Country
                    <v-icon color="error" x-small class="mt-n3">
                      mdi-asterisk
                    </v-icon>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
            <p class="grey--text ml-3 font-weight-bold">
              Contact Info
            </p>
            <v-row class="mb-3">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="organization.contact_name"
                  outlined
                  class="rounded-lg"
                  label="Contact Name"
                  hide-details="auto"
                  dense
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="organization.department"
                  label="Department"
                  outlined
                  class="rounded-lg"
                  hide-details="auto"
                  dense
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="organization.contact_email"
                  label="Contact E-mail"
                  outlined
                  class="rounded-lg"
                  hide-details="auto"
                  dense
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="organization.link_linkedin"
                  label="Linkedin URL"
                  outlined
                  class="rounded-lg"
                  hide-details="auto"
                  dense
                />
              </v-col>
            </v-row>
            <v-textarea
              v-model="organization.patient"
              label="Patient of the organization"
              rows="3"
              outlined
              class="rounded-lg"
              dense
            />
          </div>
          <v-btn
            color="themePrimary"
            class="white--text rounded-lg"
            x-large
            elevation="0"
            block
            type="submit"
            :disabled="saving || !valid"
            :loading="saving"
          >
            {{ $t("REGISTER") }}
          </v-btn>
        </v-card-text>
      </v-card>
    </v-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      checkMemberApi: `${process.env.apiUrl}${process.env.apiDirectory}members-check`,
      valid: true,
      saving: false,
      errors: [],
      rules: {
        gender: [
          v => !!v || 'Gender is required'
        ],
        title: [
          v => !!v || 'Title is required'
        ],
        name: [
          v => !!v || 'Name is required'
        ],
        department: [
          v => !!v || 'Department is required'
        ],
        organization: [
          v => !!v || 'Organization is required'
        ],
        country: [
          v => !!v || 'Country is required'
        ],
        organization_type: [
          v => !!v || 'Organization Type is required'
        ],
        graduate: [
          v => !!v || 'Graduate is required'
        ],
        expert: [
          v => v.length > 0 || 'Expert is required'
        ],
        case_study: [
          v => !!v || 'Case Study / Sample Group is required'
        ],
        length: [
          v => !!v || 'Research Period (Month) is required'
        ],
        size: [
          v => !!v || 'Amount of Co Staff is required'
        ],
        firstname: [
          v => !!v || this.$t('IS_REQUIRED', { text: this.$t('FIRSTNAME') })
        ],
        lastname: [
          v => !!v || this.$t('IS_REQUIRED', { text: this.$t('LASTNAME') })
        ],
        email: [
          v => !!v || this.$t('IS_REQUIRED', { text: ' E-mail ' }),
          v => this.$email.validate(v) || this.$t('INVALID', { text: ' E-mail ' })
        ],
        password: [
          v => !!v || this.$t('IS_REQUIRED', { text: ' Password ' }),
          v => !v || (!!v && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(v)) || this.$t('INVALID_PASSWORD')
        ],
        confirmPassword: [
          v => !this.form.password || (!!this.form.password && v === this.form.password) || this.$t('PASSWORD_NOT_MATCH')
        ],
        keywords: [
          v => v.length > 0 || 'Keyword is required'
        ],
        cv_img: [
          (v) => {
            const mimetypeImages = ['image/png', 'image/gif', 'image/jpg', 'image/jpeg', 'application/pdf']
            return !v || mimetypeImages.includes(v.type) || 'File must be image or PDF only'
          },
          v => !v || v.size <= 2000000 || this.$t('LESS_SIZE', { text: this.$t('FILE'), count: '2 MB' })
        ]
      },
      keywords: [],
      experts: [],
      organizationTypes: null,
      countries: null,
      form: {
        member_type: 'researcher',
        email: '',
        password: '',
        confirm_password: ''
      },
      researcher: {
        gender: null,
        title: '',
        firstname: '',
        middlename: '',
        lastname: '',
        department: '',
        organization: '',
        keyword: '',
        expert: '',
        case_study: '',
        research_country: '',
        length: null,
        graduate: '',
        hot_issue: '',
        graduate_country_id: null,
        religion: '',
        phone_number: '',
        address: '',
        country_id: null,
        city: '',
        no_of_coauthor: null,
        link_scopus: '',
        link_linkedin: '',
        research_gate: '',
        patient: ''
      },
      organization: {
        name: '',
        organization_type_id: null,
        size: null,
        product: '',
        research_area: '',
        contact_name: '',
        contact_email: '',
        department: '',
        address: '',
        country_id: null,
        city: '',
        link_linkedin: '',
        patient: ''
      },
      cv_img: null,
      debounce: null
    }
  },
  computed: {
    memberTypes () {
      return this.$store.state.enums.memberTypes
    },
    academicTitles () {
      return this.$store.state.references.academicTitles
    },
    religions () {
      return this.$store.state.references.religions
    },
    degrees () {
      return this.$store.state.references.degrees
    }
  },
  async created () {
    this.$overlay.showLoading()
    await this.fetchRefs()
    setTimeout(() => {
      if (this.$refs.form) {
        this.$refs.form.resetValidation()
        this.$overlay.hide()
      }
    })
  },
  methods: {
    async fetchRefs () {
      await Promise.all([
        this.$axios.$get(`${this.apiPath}organization-types`),
        this.$axios.$get(`${this.apiPath}countries`)
      ]).then((values) => {
        this.organizationTypes = values[0].rows
        this.countries = values[1].rows
      })
    },
    changeType (val) {
      this.form.member_type = this.$objToArr(this.memberTypes)[val].text
    },
    updateKeywords (vals) {
      this.keywords = vals.filter(ele => ele.trim() !== '').map(ele => ele.trim())
      this.researcher.keyword = vals.filter(ele => ele.trim() !== '').map(ele => ele.trim()).join('; ')
    },
    updateExperts (vals) {
      this.experts = vals.filter(ele => ele.trim() !== '').map(ele => ele.trim())
      this.researcher.expert = vals.filter(ele => ele.trim() !== '').map(ele => ele.trim()).join('; ')
    },
    checkDuplicate (val) {
      clearTimeout(this.debounce)
      this.debounce = setTimeout(async () => {
        this.errors = []
        if (this.$email.validate(val)) {
          try {
            const res = await this.$axios.$post(this.checkMemberApi, { email: val.toLowerCase() })
            if (res) {
              this.errors = [this.$t('ALREADY', { text: ' E-mail ' })]
            }
          } catch (e) {

          }
        }
      }, 600)
    },
    save () {
      if (this.$refs.form.validate() && this.errors.length === 0) {
        this.form.DataPrivacy = { }
        if (this.form.member_type === 'researcher') {
          this.form.Researcher = { ...this.researcher }
        } else if (this.form.member_type === 'organization') {
          this.form.Organization = { ...this.organization }
        }
        this.saving = true
        this.form.email = this.form.email.toLowerCase()
        this.$emit('save', this.form, this.cv_img)
      }
    }
  }
}
</script>
