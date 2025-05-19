<template>
  <v-dialog v-model="dialog" persistent scrollable max-width="800">
    <v-form ref="form" v-model="valid" @submit.prevent="save">
      <v-card>
        <v-toolbar
          color="bgLight"
          elevation="0"
          flat
        >
          <v-toolbar-title>
            <h3 class="primary--text">
              {{ edit ? $t('EDIT', { text: $t('PROFILE')}) : $t('PROFILE') }}
            </h3>
          </v-toolbar-title>
          <v-spacer />
          <v-btn v-if="edit" fab x-small text @click="closeDialog">
            <v-icon>
              fas fa-times
            </v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
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
            v-model="form.gender"
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
                v-model="form.title"
                label="Academic Title"
                outlined
                :items="academicTitles"
                clearable
                dense
              />
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                v-model="form.firstname"
                outlined
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
                v-model="form.middlename"
                outlined
                label="Middlename"
                dense
              />
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                v-model="form.lastname"
                outlined
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
                v-model="form.department"
                outlined
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
                v-model="form.organization"
                outlined
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
                v-model="form.religion"
                outlined
                label="Religion"
                :items="religions"
                clearable
                dense
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.phone_number"
                label="Phone Number"
                outlined
                dense
              />
            </v-col>
          </v-row>
          <v-textarea
            v-model="form.address"
            label="Address"
            rows="3"
            outlined
            dense
          />

          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.city"
                label="City"
                outlined
                dense
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-autocomplete
                v-model="form.country_id"
                :items="countries"
                item-value="id"
                item-text="name"
                outlined
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
                v-model="form.graduate"
                outlined
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
                v-model="form.graduate_country_id"
                :items="countries"
                item-value="id"
                item-text="name"
                outlined
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
            append-icon
            outlined
            label="Experts"
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
            v-model="form.case_study"
            outlined
            placeholder="Please specify the research examples or case studies you are interested in studying in the future"
            rows="3"
            dense
          />
          <label class="ml-3 caption" for="">Previous research location</label>
          <v-textarea
            v-model="form.hot_issue"
            placeholder="Please specify your previous research location"
            rows="3"
            outlined
            dense
          />
          <label class="ml-3 caption" for="">New research location</label>
          <v-textarea
            v-model="form.research_country"
            placeholder="Please specify your new research location"
            rows="3"
            outlined
            dense
          />
          <v-row>
            <v-col cols="12" sm="6">
              <label class="ml-3 caption" for="">&nbsp;</label>
              <v-autocomplete
                v-model="form.length"
                label="Research Period (Month)"
                :items="[6, 8, 12, 24, 36]"
                outlined
                dense
              />
            </v-col>
            <v-col cols="12" sm="6">
              <label class="ml-3 caption" for="">&nbsp;</label>
              <v-currency-field
                v-model="form.no_of_coauthor"
                label="Number of Research Team Members"
                outlined
                :min="0"
                :decimal-length="0"
                dense
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-4 pb-4">
          <v-btn
            color="primary"
            large
            block
            elevation="0"
            type="submit"
            :disabled="saving || !valid"
            :loading="saving"
          >
            {{ $t('SAVE') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
export default {
  data () {
    return {
      countryApi: `${process.env.apiUrl}${process.env.apiDirectory}countries`,
      dialog: false,
      valid: true,
      saving: false,
      edit: true,
      countries: null,
      keywords: [],
      experts: [],
      rules: {
        gender: [
          v => !!v || 'Gender is required'
        ],
        title: [
          v => !!v || 'Title is required'
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
        firstname: [
          v => !!v || this.$t('IS_REQUIRED', { text: this.$t('FIRSTNAME') })
        ],
        lastname: [
          v => !!v || this.$t('IS_REQUIRED', { text: this.$t('LASTNAME') })
        ],
        keywords: [
          v => v.length > 0 || 'Keyword is required'
        ]
      },
      form: {}
    }
  },
  computed: {
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
  created () {
    this.$bus.$on('open-researcher-form', (oldData, edit = true) => {
      this.$overlay.showLoading()
      this.saving = false
      this.edit = edit
      this.clearData()
      this.form = { ...this.form, ...oldData.Researcher }
      if (this.form.keyword && this.form.keyword.trim() !== '') {
        this.keywords = this.form.keyword.split('; ')
      }
      if (this.form.expert.trim() !== '') {
        this.experts = this.form.expert.split('; ')
      }
      this.dialog = true
      setTimeout(() => {
        if (this.$refs.form) {
          this.$refs.form.resetValidation()
        }
      })
    })
  },
  async mounted () {
    try {
      const countries = await this.$axios.$get(this.countryApi)
      this.countries = countries.rows
    } catch (e) {
      console.log(e)
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
  },
  beforeDestroy () {
    this.$bus.$off('open-researcher-form')
  },
  methods: {
    updateKeywords (vals) {
      this.keywords = vals.filter(ele => ele.trim() !== '').map(ele => ele.trim())
      this.form.keyword = vals.filter(ele => ele.trim() !== '').map(ele => ele.trim()).join('; ')
    },
    updateExperts (vals) {
      this.experts = vals.filter(ele => ele.trim() !== '').map(ele => ele.trim())
      this.form.expert = vals.filter(ele => ele.trim() !== '').map(ele => ele.trim()).join('; ')
    },
    closeDialog () {
      this.dialog = false
      this.$overlay.hide()
    },
    clearData () {
      this.form = {
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
        no_of_coauthor: null
      }
      this.keywords = []
      this.experts = []
    },
    save () {
      if (this.$refs.form.validate()) {
        this.saving = true
        this.$emit('save', this.form)
        this.dialog = false
      }
    }
  }
}
</script>
