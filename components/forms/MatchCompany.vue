<template>
  <v-dialog v-model="dialog" persistent scrollable max-width="800">
    <v-form ref="form" v-model="valid" @submit.prevent="save">
      <v-card v-if="organizationTypes && cities && countries">
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon class="mr-2">
              {{ headerIcon }}
            </v-icon>
            {{ headerText }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn fab x-small text @click="closeDialog">
            <v-icon>
              fas fa-times
            </v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-row>
            <v-col cols="12" md="7">
              <v-text-field
                v-model="form.name"
                outlined
                :autofocus="mode === 'add'"
                :rules="rules.name"
                required
              >
                <template #label>
                  Company Name
                  <v-icon color="error" x-small class="mt-n3">
                    mdi-asterisk
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="5">
              <div v-if="form.Img" class="mb-5">
                <div class="float-right mt-2">
                  <div class="text-right">
                    <v-btn small class="ma-2" @click="form.Img = null">
                      Change Logo
                    </v-btn>
                  </div>
                  <div class="text-right">
                    <v-btn small color="error" class="ma-2" @click="removeImage">
                      Delete Logo
                    </v-btn>
                  </div>
                </div>
                <p>Logo</p>
                <v-img :src="form.Img.url" contain max-height="100" />
              </div>
              <div v-else>
                <v-file-input
                  v-model="form.company_img"
                  accept="image/jpeg,image/gif,image/png"
                  prepend-icon="mdi-image-size-select-actual"
                  outlined
                  :rules="rules.company_img"
                  :show-size="1000"
                  @change="changeImg"
                >
                  <template #label>
                    Logo
                    <span class="caption">{{ $t('LESS_SIZE', { text: $t('FILE'), count: '1 MB' }) }}</span>
                  </template>
                  <template #selection="{ text }">
                    <v-img
                      v-if="imgPreview"
                      class="mx-auto my-2"
                      contain
                      :aspect-ratio="1/1"
                      max-width="300"
                      max-height="300"
                      :src="imgPreview"
                    />
                    <span class="ml-3">
                      {{ text }}
                    </span>
                  </template>
                </v-file-input>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4">
              <v-combobox
                v-model="combo.organizationType"
                :items="organizationTypes"
                item-value="id"
                :filter="comboFilter"
                outlined
                dense
                hide-details="auto"
                hint="Search to Select or Enter to Add new Organization Type"
                persistent-hint
                :rules="rules.organizationType"
                @change="updateOrganizationType"
              >
                <template #label>
                  Organization Type
                  <v-icon color="error" x-small class="mt-n3">
                    mdi-asterisk
                  </v-icon>
                </template>
                <template #item="{ item }">
                  {{ item.name }}
                </template>
                <template #selection="data">
                  <span
                    v-if="data.item.id"
                    class="info--text font-weight-bold"
                    v-text="data.item.name"
                  />
                  <span v-else>
                    {{ data.item }}
                  </span>
                </template>
              </v-combobox>
            </v-col>
            <v-col cols="12" md="4">
              <v-combobox
                v-model="combo.city"
                :items="cities"
                item-value="id"
                :filter="comboFilter"
                outlined
                clearable
                dense
                hide-details="auto"
                hint="Search to Select or Enter to Add new City"
                persistent-hint
                @change="updateCity"
              >
                <template #label>
                  State/Province/City
                  <!-- <v-icon color="error" x-small class="mt-n3">
                    mdi-asterisk
                  </v-icon> -->
                </template>
                <template #item="{ item }">
                  {{ item.name }}
                </template>
                <template #selection="data">
                  <span
                    v-if="data.item.id"
                    class="info--text font-weight-bold"
                    v-text="data.item.name"
                  />
                  <span v-else>
                    {{ data.item }}
                  </span>
                </template>
              </v-combobox>
            </v-col>
            <v-col cols="12" md="4">
              <v-combobox
                v-model="combo.country"
                :items="countries"
                item-value="id"
                :filter="comboFilter"
                outlined
                :disabled="!!form.country_id && ['country_admin'].includes($auth.user.role)"
                dense
                hide-details="auto"
                hint="Search to Select or Enter to Add new Country"
                persistent-hint
                :rules="rules.country"
                @change="updateCountry"
              >
                <template #label>
                  Country
                  <v-icon color="error" x-small class="mt-n3">
                    mdi-asterisk
                  </v-icon>
                </template>
                <template #item="{ item }">
                  {{ item.name }}
                </template>
                <template #selection="data">
                  <span
                    v-if="data.item.id"
                    class="info--text font-weight-bold"
                    v-text="data.item.name"
                  />
                  <span v-else>
                    {{ data.item }}
                  </span>
                </template>
              </v-combobox>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.email"
                :rules="rules.email"
                hide-details="auto"
                dense
                outlined
              >
                <template #label>
                  E-mail
                  <v-icon color="error" x-small class="mt-n3">
                    mdi-asterisk
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.website"
                label="Website"
                hide-details="auto"
                dense
                outlined
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.product"
                label="Products of Company"
                dense
                outlined
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-currency-field
                v-model="form.size"
                label="Size of Company (Amount of employees)"
                outlined
                :min="1"
                :max="999999999"
                :decimal-length="0"
                dense
                required
              />
            </v-col>
          </v-row>
          <v-textarea
            v-model="form.address"
            label="Address"
            rows="2"
            dense
            outlined
          />
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.lat"
                label="Lat"
                dense
                outlined
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.lng"
                label="Lng"
                dense
                outlined
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.contact_person"
                label="Contact Name"
                dense
                outlined
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.contact_phone"
                label="Contact Phone Number"
                dense
                outlined
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.social_media_url"
                label="Social Media URL"
                dense
                outlined
              />
            </v-col>
          </v-row>
          <v-combobox
            v-model="keywords"
            hide-selected
            multiple
            append-icon
            outlined
            dense
            :rules="rules.keywords"
            hint="Input Keyword and Enter or Tab for added"
            clearable
            chips
            deletable-chips
            small-chips
            persistent-hint
            @change="updateKeywords"
          >
            <template #label>
              Keywords
              <v-icon color="error" x-small class="mt-n3">
                mdi-asterisk
              </v-icon>
            </template>
          </v-combobox>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            type="submit"
            x-large
            block
            color="primary"
            :disabled="saving || !valid"
            :loading="saving"
          >
            Save
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
      modelName: 'Match Company',
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      dialog: false,
      mode: '',
      valid: true,
      saving: false,
      organizationTypes: null,
      cities: null,
      countries: null,
      imgPreview: null,
      keywords: [],
      rules: {
        name: [
          v => !!v || 'Company Name is required'
        ],
        organizationType: [
          v => !!v || 'Organization Type is required'
        ],
        city: [
          v => !!v || 'City is required'
        ],
        country: [
          v => !!v || 'Country is required'
        ],
        email: [
          v => !!v || 'E-mail is required',
          v => this.$email.validate(v) || this.$t('INVALID', { text: ' E-mail ' })
        ],
        company_img: [
          (v) => {
            const mimetypeImages = ['image/png', 'image/gif', 'image/jpg', 'image/jpeg']
            return !v || mimetypeImages.includes(v.type) || this.$t('IMG_ONLY')
          },
          v => !v || v.size <= 1000000 || this.$t('LESS_SIZE', { text: this.$t('FILE'), count: '1 MB' })
        ],
        keywords: [
          v => v.length > 0 || 'Keyword is required'
        ]
      },
      combo: {
        organizationType: null,
        city: null,
        country: null
      },
      form: {}
    }
  },
  computed: {
    headerText () {
      return this.mode === 'add' ? `Create ${this.modelName}` : `Update ${this.modelName}`
    },
    headerIcon () {
      return this.mode === 'add' ? 'fas fa-plus' : 'fas fa-edit'
    }
  },
  created () {
    this.$bus.$on('open-match-company-form', async (data) => {
      this.$overlay.showLoading()
      await this.fetchRefs()
      this.saving = false
      this.clearData()
      this.mode = 'add'
      if (data) {
        this.mode = 'edit'
        this.form = {
          ...this.form,
          ...data
        }
        if (this.form.keyword && this.form.keyword.trim() !== '') {
          this.keywords = this.form.keyword.split('; ')
        }
      } else if (['country_admin'].includes(this.$auth.user.role)) {
        const findCountry = this.$_.find(this.countries, { name: this.$auth.user.country })
        this.form.country_id = findCountry.id
      }
      this.combo.organizationType = this.$_.find(this.organizationTypes, { id: this.form.organization_type_id })
      this.combo.city = this.$_.find(this.cities, { id: this.form.city_id })
      this.combo.country = this.$_.find(this.countries, { id: this.form.country_id })
      this.dialog = true
      setTimeout(() => {
        if (this.$refs.form) {
          this.$refs.form.resetValidation()
        }
      })
    })
  },
  beforeDestroy () {
    this.$bus.$off('open-match-company-form')
  },
  methods: {
    async fetchRefs () {
      await Promise.all([
        this.$axios.$get(`${this.apiPath}organization-types`),
        this.$axios.$get(`${this.apiPath}cities`),
        this.$axios.$get(`${this.apiPath}countries`)
      ]).then((values) => {
        this.organizationTypes = values[0].rows
        this.cities = values[1].rows
        this.countries = values[2].rows
      })
    },
    comboFilter (item, queryText, itemText) {
      return [
        this.$findSome(queryText, item.name)
      ].some(ele => ele)
    },
    updateOrganizationType (val) {
      if (val && val.id) {
        this.form.organization_type_id = val.id
        this.form.organizationType = null
      } else if (val && val.trim().length > 0) {
        const findLists = this.organizationTypes.find(ele => ele.name.toLowerCase() === val.toLowerCase().trim())
        if (findLists) {
          this.combo.organizationType = findLists
          this.form.organization_type_id = findLists.id
          this.form.organizationType = null
        } else {
          this.form.organization_type_id = null
          this.form.organizationType = val.trim()
        }
      } else {
        this.combo.organizationType = null
        this.form.organization_type_id = null
        this.form.organizationType = null
      }
    },
    updateCity (val) {
      if (val && val.id) {
        this.form.city_id = val.id
        this.form.city = null
      } else if (val && val.trim().length > 0) {
        const findLists = this.cities.find(ele => ele.name.toLowerCase() === val.toLowerCase().trim())
        if (findLists) {
          this.combo.city = findLists
          this.form.city_id = findLists.id
          this.form.city = null
        } else {
          this.form.city_id = null
          this.form.city = val.trim()
        }
      } else {
        this.combo.city = null
        this.form.city_id = null
        this.form.city = null
      }
    },
    updateCountry (val) {
      if (val && val.id) {
        this.form.country_id = val.id
        this.form.country = null
      } else if (val && val.trim().length > 0) {
        const findLists = this.countries.find(ele => ele.name.toLowerCase() === val.toLowerCase().trim())
        if (findLists) {
          this.combo.country = findLists
          this.form.country_id = findLists.id
          this.form.country = null
        } else {
          this.form.country_id = null
          this.form.country = val.trim()
        }
      } else {
        this.combo.country = null
        this.form.country_id = null
        this.form.country = null
      }
    },
    updateKeywords (vals) {
      this.keywords = vals.filter(ele => ele.trim() !== '').map(ele => ele.trim())
      this.form.keyword = vals.filter(ele => ele.trim() !== '').map(ele => ele.trim()).join('; ')
    },
    changeImg (val) {
      if (val) {
        this.imgPreview = URL.createObjectURL(this.form.company_img)
      }
    },
    closeDialog () {
      this.dialog = false
      this.$overlay.hide()
    },
    clearData () {
      this.form = {
        name: '',
        website: '',
        email: '',
        product: '',
        size: null,
        address: '',
        lat: null,
        lng: null,
        contact_person: '',
        contact_phone: '',
        social_media_url: '',
        keyword: '',
        organization_type_id: null,
        organizationType: null,
        city_id: null,
        city: null,
        country_id: null,
        country: null,
        company_img: null
      }
      this.keywords = []
    },
    save () {
      if (this.$refs.form.validate()) {
        this.saving = true
        this.form.email = this.form.email.toLowerCase()
        const formData = new FormData()
        for (const [key, value] of Object.entries(this.form)) {
          if (value !== null) {
            formData.append(key, value)
          }
        }
        this.$emit(this.mode, formData)
        this.dialog = false
      }
    },
    removeImage () {
      this.$emit('removeImage', this.form)
      this.form.Img = null
    }
  }
}
</script>
