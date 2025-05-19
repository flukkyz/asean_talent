<template>
  <v-dialog v-model="dialog" persistent scrollable :max-width="dialogWidth">
    <v-form ref="form" v-model="valid" @submit.prevent="save">
      <v-card v-if="journals">
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
                  Title
                  <v-icon color="error" x-small class="mt-n3">
                    mdi-asterisk
                  </v-icon>
                </template>
              </v-text-field>
              <v-autocomplete
                v-model="form.journal_id"
                :items="journals"
                item-value="id"
                item-text="name"
                outlined
                dense
                :rules="rules.journal_id"
              >
                <template #label>
                  Journal
                  <v-icon color="error" x-small class="mt-n3">
                    mdi-asterisk
                  </v-icon>
                </template>
              </v-autocomplete>
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
                  v-model="form.publication_img"
                  accept="image/jpeg,image/gif,image/png"
                  prepend-icon="mdi-image-size-select-actual"
                  outlined
                  :rules="rules.publication_img"
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
          <div class="mb-5">
            <p class="mb-0">
              Important Date
            </p>
            <client-only placeholder="Loading...">
              <ck-editor
                v-model="form.important"
                :config="$ckBasicConfig()"
              />
            </client-only>
          </div>
          <div class="mb-5">
            <p class="mb-0">
              Publication Detail
            </p>
            <client-only placeholder="Loading...">
              <ck-editor
                v-model="form.description"
                :config="$ckBasicConfig()"
              />
            </client-only>
          </div>
          <div class="mb-5">
            <p class="mb-0">
              Publication Topic
            </p>
            <client-only placeholder="Loading...">
              <ck-editor
                v-model="form.topic"
                :config="$ckBasicConfig()"
              />
            </client-only>
          </div>
          <v-row>
            <v-col cols="12" md="6">
              <v-currency-field
                v-model.number="form.frequency_publish"
                outlined
                :decimal-length="0"
                dense
                :rules="rules.frequency_publish"
                hide-details="auto"
                required
              >
                <template #label>
                  Frequency Publish
                  <v-icon color="error" x-small class="mt-n3">
                    mdi-asterisk
                  </v-icon>
                </template>
              </v-currency-field>
            </v-col>
            <v-col cols="12" md="6">
              <datetime-picker
                v-model="form.deadline_date"
                label="Deadline paper submission Date"
                outlined
                date-only
                lang="en-us"
                dense
                :rules="rules.deadline_date"
                required
              />
            </v-col>
          </v-row>

          <label for="">Registration Rate</label>
          <div class="d-flex align-center mb-5">
            <v-currency-field
              v-model.number="form.budget"
              outlined
              :decimal-length="{min:0 ,max:2}"
              dense
              :rules="rules.budget"
              class="flex-grow-1"
              hide-details="auto"
            />
            <div class="flex-shrink-0 ml-4" style="width: 130px;">
              <v-select
                v-model="form.currency_id"
                :items="currencies"
                item-value="id"
                item-text="code"
                outlined
                clearable
                hide-details
                dense
              >
                <template #label>
                  Currency
                <!-- <v-icon color="error" x-small class="mt-n3">
                  mdi-asterisk
                </v-icon> -->
                </template>
              </v-select>
            </div>
          </div>
          <div class="mb-5">
            <p class="mb-0">
              Registration Rate Detail
            </p>
            <client-only placeholder="Loading...">
              <ck-editor
                v-model="form.budget_detail"
                :config="$ckBasicConfig()"
              />
            </client-only>
          </div>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.contact_person"
                label="Contact Name"
                dense
                hide-details="auto"
                outlined
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.contact_phone"
                label="Contact Phone Number"
                dense
                hide-details="auto"
                outlined
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.email"
                :rules="rules.email"
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
                dense
                hide-details="auto"
                outlined
              />
            </v-col>
          </v-row>
          <!-- <v-combobox
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
          </v-combobox> -->
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
      modelName: 'Publication',
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      dialog: false,
      dialogWidth: 999,
      mode: '',
      valid: true,
      saving: false,
      currencies: null,
      journals: null,
      imgPreview: null,
      keywords: [],
      rules: {
        name: [
          v => !!v || 'Title is required'
        ],
        journal_id: [
          v => !!v || 'Journal is required'
        ],
        budget: [
          v => !!v || 'Registration Rate is required'
        ],
        frequency_publish: [
          v => !!v || 'Frequency Publish is required'
        ],
        deadline_date: [
          v => !!v || 'Deadline for apply Date is required'
        ],
        email: [
          v => !!v || 'E-mail is required',
          v => this.$email.validate(v) || this.$t('INVALID', { text: ' E-mail ' })
        ],
        publication_img: [
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
    this.$bus.$on('open-publication-form', async (data) => {
      this.dialogWidth = 999
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
      }
      if (this.form.description === null) {
        this.form.description = ''
      }
      if (this.form.important === null) {
        this.form.important = ''
      }
      if (this.form.topic === null) {
        this.form.topic = ''
      }
      if (this.form.budget_detail === null) {
        this.form.budget_detail = ''
      }
      this.dialog = true
      setTimeout(() => {
        if (this.$refs.form) {
          this.$refs.form.resetValidation()
        }
      })
      setTimeout(() => {
        this.dialogWidth = 1000
      }, 300)
    })
  },
  beforeDestroy () {
    this.$bus.$off('open-publication-form')
  },
  methods: {
    async fetchRefs () {
      await Promise.all([
        this.$axios.$get(`${this.apiPath}journals`),
        this.$axios.$get(`${this.apiPath}currencies/asean`)
      ]).then((values) => {
        this.journals = values[0].rows
        this.currencies = values[1]
      })
    },
    comboFilter (item, queryText, itemText) {
      return [
        this.$findSome(queryText, item.name)
      ].some(ele => ele)
    },
    updateKeywords (vals) {
      this.keywords = vals.filter(ele => ele.trim() !== '').map(ele => ele.trim())
      this.form.keyword = vals.filter(ele => ele.trim() !== '').map(ele => ele.trim()).join('; ')
    },
    changeImg (val) {
      if (val) {
        this.imgPreview = URL.createObjectURL(this.form.publication_img)
      }
    },
    closeDialog () {
      this.dialog = false
      this.$overlay.hide()
    },
    clearData () {
      this.form = {
        name: '',
        important: '',
        topic: '',
        website: '',
        contact_person: '',
        contact_phone: '',
        email: '',
        keyword: '',
        description: '',
        budget: null,
        budget_detail: '',
        journal_id: null,
        currency_id: null,
        publication_img: null,
        deadline_date: null,
        frequency_publish: null
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
