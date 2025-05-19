<template>
  <v-container>
    <v-row justify="center" class="mb-10">
      <v-col cols="12">
        <v-form ref="form" v-model="valid" @submit.prevent="save">
          <v-card v-if="universities && cities && countries">
            <v-toolbar flat>
              <v-toolbar-title>
                <v-icon class="mr-2">
                  {{ headerIcon }}
                </v-icon>
                {{ headerText }}
              </v-toolbar-title>
            </v-toolbar>

            <v-card-text>
              <label>
                Gender
                <v-icon color="error" x-small class="mt-n3">
                  mdi-asterisk
                </v-icon>
              </label>
              <v-radio-group
                v-model="form.gender"
                row
                class="mt-0"
                :rules="rules.gender"
                required
              >
                <v-radio
                  v-for="value in ['Male', 'Female']"
                  :key="value"
                  :label="value"
                  :value="value"
                />
              </v-radio-group>
              <div v-if="form.Img" class="mb-5">
                <div class="float-right mt-2">
                  <div class="text-right">
                    <v-btn small class="ma-2" @click="form.Img = null">
                      Change Picture
                    </v-btn>
                  </div>
                  <div class="text-right">
                    <v-btn small color="error" class="ma-2" @click="removeImage">
                      Delete Picture
                    </v-btn>
                  </div>
                </div>
                <p>Picture</p>
                <v-img :src="form.Img.url" contain max-height="100" />
              </div>
              <div v-else>
                <v-file-input
                  v-model="form.talent_img"
                  accept="image/jpeg,image/gif,image/png"
                  prepend-icon="mdi-image-size-select-actual"
                  outlined
                  :rules="rules.talent_img"
                  :show-size="1000"
                  @change="changeImg"
                >
                  <template #label>
                    Picture
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
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.firstname"
                    outlined
                    :rules="rules.firstname"
                    hide-details="auto"
                    required
                  >
                    <template #label>
                      Firstname
                      <v-icon color="error" x-small class="mt-n3">
                        mdi-asterisk
                      </v-icon>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.lastname"
                    outlined
                    :rules="rules.lastname"
                    hide-details="auto"
                    required
                  >
                    <template #label>
                      Lastname
                      <v-icon color="error" x-small class="mt-n3">
                        mdi-asterisk
                      </v-icon>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <v-combobox
                    v-model="combo.university"
                    :items="universities"
                    item-value="id"
                    :filter="comboFilter"
                    outlined
                    dense
                    hide-details="auto"
                    hint="Search to Select or Enter to Add new University"
                    persistent-hint
                    :rules="rules.university"
                    @change="updateUniversity"
                  >
                    <template #label>
                      University
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
                <v-col cols="12" md="6">
                  <v-combobox
                    v-model="combo.religion"
                    label="Religion"
                    :items="religions"
                    item-value="id"
                    :filter="comboFilter"
                    outlined
                    dense
                    hide-details="auto"
                    hint="Search to Select or Enter to Add new Religion"
                    persistent-hint
                    @change="updateReligion"
                  >
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
                <v-col cols="12" md="6">
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
                <v-col cols="12" md="6">
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
                <v-col cols="12" md="6">
                  <v-combobox
                    v-model="combo.domicile"
                    :items="countries"
                    label="Domicile"
                    item-value="id"
                    :filter="comboFilter"
                    outlined
                    dense
                    hide-details="auto"
                    hint="Search to Select or Enter to Add new Country"
                    persistent-hint
                    @change="updateDomicile"
                  >
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
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.link_linkedin"
                    label="Linkedin Url"
                    dense
                    outlined
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.research_gate"
                    label="Research Gate"
                    dense
                    outlined
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.link_tnrr"
                    label="TNRR"
                    dense
                    outlined
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.email"
                    label="E-mail"
                    dense
                    outlined
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.phone_number"
                    label="Phone Number"
                    dense
                    outlined
                  />
                </v-col>
              </v-row>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    modelName: {
      type: String,
      default: 'Talent'
    }
  },
  data () {
    return {
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      mode: '',
      valid: true,
      saving: false,
      religions: null,
      universities: null,
      cities: null,
      countries: null,
      imgPreview: null,
      keywords: [],
      rules: {
        gender: [
          v => !!v || 'Gender is required'
        ],
        firstname: [
          v => !!v || 'Firstname is required'
        ],
        lastname: [
          v => !!v || 'Lastname is required'
        ],
        university: [
          v => !!v || 'University is required'
        ],
        city: [
          v => !!v || 'City is required'
        ],
        country: [
          v => !!v || 'Country is required'
        ],
        talent_img: [
          (v) => {
            const mimetypeImages = ['image/png', 'image/gif', 'image/jpg', 'image/jpeg']
            return !v || mimetypeImages.includes(v.type) || this.$t('IMG_ONLY')
          },
          v => !v || v.size <= 1000000 || this.$t('LESS_SIZE', { text: this.$t('FILE'), count: '1 MB' })
        ],
        email: [
          v => !!v || 'E-mail is required',
          v => this.$email.validate(v) || this.$t('INVALID', { text: ' E-mail ' })
        ]
      },
      combo: {
        religion: null,
        university: null,
        city: null,
        country: null,
        domicile: null
      },
      form: {
        firstname: '',
        lastname: '',
        gender: null,
        email: '',
        phone_number: '',
        link_linkedin: '',
        research_gate: '',
        link_tnrr: '',
        religion_id: null,
        religion: null,
        university_id: null,
        university: null,
        city_id: null,
        city: null,
        country_id: null,
        country: null,
        domicile_id: null,
        domicile: null,
        talent_img: null
      }
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
    this.$bus.$on('open-talent-form', async (data) => {
      await this.fetchRefs()
      this.saving = false
      this.mode = 'add'
      if (data) {
        this.mode = 'edit'
        this.form = {
          ...this.form,
          ...data
        }
      } else if (['country_admin'].includes(this.$auth.user.role)) {
        const findCountry = this.$_.find(this.countries, { name: this.$auth.user.country })
        this.form.country_id = findCountry.id
      }
      this.combo.religion = this.$_.find(this.religions, { id: this.form.religion_id })
      this.combo.university = this.$_.find(this.universities, { id: this.form.university_id })
      this.combo.city = this.$_.find(this.cities, { id: this.form.city_id })
      this.combo.country = this.$_.find(this.countries, { id: this.form.country_id })
      this.combo.domicile = this.$_.find(this.countries, { id: this.form.domicile_id })
      setTimeout(() => {
        if (this.$refs.form) {
          this.$refs.form.resetValidation()
        }
      })
      this.$overlay.hide()
    })
  },
  beforeDestroy () {
    this.$bus.$off('open-talent-form')
  },
  methods: {
    async fetchRefs () {
      await Promise.all([
        this.$axios.$get(`${this.apiPath}religions`),
        this.$axios.$get(`${this.apiPath}universities`),
        this.$axios.$get(`${this.apiPath}cities`),
        this.$axios.$get(`${this.apiPath}countries`)
      ]).then((values) => {
        this.religions = values[0].rows
        this.universities = values[1].rows
        this.cities = values[2].rows
        this.countries = values[3].rows
      })
    },
    comboFilter (item, queryText, itemText) {
      return [
        this.$findSome(queryText, item.name)
      ].some(ele => ele)
    },
    updateUniversity (val) {
      if (val && val.id) {
        this.form.university_id = val.id
        this.form.university = null
      } else if (val && val.trim().length > 0) {
        const findLists = this.universities.find(ele => ele.name.toLowerCase() === val.toLowerCase().trim())
        if (findLists) {
          this.combo.university = findLists
          this.form.university_id = findLists.id
          this.form.university = null
        } else {
          this.form.university_id = null
          this.form.university = val.trim()
        }
      } else {
        this.combo.university = null
        this.form.university_id = null
        this.form.university = null
      }
    },
    updateReligion (val) {
      if (val && val.id) {
        this.form.religion_id = val.id
        this.form.religion = null
      } else if (val && val.trim().length > 0) {
        const findLists = this.religions.find(ele => ele.name.toLowerCase() === val.toLowerCase().trim())
        if (findLists) {
          this.combo.religion = findLists
          this.form.religion_id = findLists.id
          this.form.religion = null
        } else {
          this.form.religion_id = null
          this.form.religion = val.trim()
        }
      } else {
        this.combo.religion = null
        this.form.religion_id = null
        this.form.religion = null
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
    updateDomicile (val) {
      if (val && val.id) {
        this.form.domicile_id = val.id
        this.form.domicile = null
      } else if (val && val.trim().length > 0) {
        const findLists = this.countries.find(ele => ele.name.toLowerCase() === val.toLowerCase().trim())
        if (findLists) {
          this.combo.domicile = findLists
          this.form.domicile_id = findLists.id
          this.form.domicile = null
        } else {
          this.form.domicile_id = null
          this.form.domicile = val.trim()
        }
      } else {
        this.combo.domicile = null
        this.form.domicile_id = null
        this.form.domicile = null
      }
    },
    changeImg (val) {
      if (val) {
        this.imgPreview = URL.createObjectURL(this.form.talent_img)
      }
    },
    save () {
      if (this.$refs.form.validate()) {
        this.saving = true
        if (this.form.email) {
          this.form.email = this.form.email.toLowerCase()
        }
        const formData = new FormData()
        for (const [key, value] of Object.entries(this.form)) {
          if (value) {
            formData.append(key, value)
          }
        }
        this.$emit('save', formData)
      }
    },
    removeImage () {
      this.$emit('removeImage', this.form)
      this.form.Img = null
    }
  }
}
</script>
