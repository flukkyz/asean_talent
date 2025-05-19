<template>
  <v-dialog v-model="dialog" persistent scrollable max-width="800">
    <v-form ref="form" v-model="valid" @submit.prevent="save">
      <v-card>
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
          <v-text-field
            v-model="form.scopus_id"
            v-mask="'###########'"
            type="number"
            maxlength="11"
            pattern="[0-9]*"
            inputmode="numeric"
            outlined
            :autofocus="mode === 'add'"
            :rules="rules.scopus_id"
            required
          >
            <template #label>
              Scopus ID
              <v-icon color="error" x-small class="mt-n3">
                mdi-asterisk
              </v-icon>
            </template>
          </v-text-field>
          <v-row class="mb-3">
            <v-col cols="12" sm="6">
              <v-currency-field
                v-model="form.h_index"
                outlined
                :min="0"
                :decimal-length="0"
                hide-details="auto"
                :rules="rules.h_index"
                dense
                required
              >
                <template #label>
                  H-Index
                  <v-icon color="error" x-small class="mt-n3">
                    mdi-asterisk
                  </v-icon>
                </template>
              </v-currency-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-currency-field
                v-model="form.fwci"
                label="FWCI"
                outlined
                :min="0"
                :decimal-length="2"
                hide-details="auto"
                dense
                required
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-currency-field
                v-model="form.scholarly_output"
                label="Scholarly Output"
                outlined
                :min="0"
                :decimal-length="0"
                hide-details="auto"
                dense
                required
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.most_recent_pub"
                v-mask="'####'"
                label="Most Recent Publication"
                pattern="[0-9]*"
                inputmode="numeric"
                hide-details="auto"
                type="number"
                maxlength="4"
                outlined
                dense
                required
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-currency-field
                v-model="form.citation"
                label="Citation"
                outlined
                :min="0"
                :decimal-length="0"
                hide-details="auto"
                dense
                required
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-currency-field
                v-model="form.citation_per_pub"
                label="Citation per Publication"
                outlined
                :min="0"
                :decimal-length="2"
                hide-details="auto"
                dense
                required
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-currency-field
                v-model="form.citation_count"
                label="Citation Count"
                outlined
                :min="0"
                :decimal-length="0"
                hide-details="auto"
                dense
                required
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-currency-field
                v-model="form.cited_by_count"
                label="Cited by Count"
                outlined
                :min="0"
                :decimal-length="0"
                hide-details="auto"
                dense
                required
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-currency-field
                v-model="form.document_count"
                label="Document Count"
                outlined
                :min="0"
                :decimal-length="0"
                hide-details="auto"
                dense
                required
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-currency-field
                v-model="form.no_of_coauthor"
                label="Number of Co Author"
                outlined
                :min="0"
                :decimal-length="0"
                hide-details="auto"
                dense
                required
              />
            </v-col>
          </v-row>
          <v-autocomplete
            v-if="!isYoungTalent && domainIndustries"
            v-model="domainIndustry"
            :items="domainIndustries.filter(ele => ele.name !== 'Young Talent')"
            item-value="name"
            item-text="name"
            multiple
            outlined
            clearable
            chips
            deletable-chips
            small-chips
            dense
            :rules="rules.domainIndustry"
            @change="updateDomainIndustry"
          >
            <template #label>
              Industry
              <v-icon color="error" x-small class="mt-n3">
                mdi-asterisk
              </v-icon>
            </template>
          </v-autocomplete>
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
  props: {
    isYoungTalent: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modelName: 'Scopus',
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      dialog: false,
      mode: '',
      valid: true,
      saving: false,
      domainIndustries: null,
      keywords: [],
      domainIndustry: this.isYoungTalent ? ['Young Talent'] : [],
      rules: {
        scopus_id: [
          v => !!v || 'Scopus ID is required'
        ],
        h_index: [
          v => !!v || 'H-Index is required'
        ],
        keywords: [
          v => v.length > 0 || 'Keyword is required'
        ],
        domainIndustry: [
          v => v.length > 0 || 'Industry is required'
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
    this.$bus.$on('open-scopus-form', async (talent, data) => {
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
        if (this.form.domain_industry && this.form.domain_industry.trim() !== '') {
          this.domainIndustry = this.form.domain_industry.split('; ')
        }
      } else {
        this.form.talent_id = talent.id
      }
      this.dialog = true
      setTimeout(() => {
        if (this.$refs.form) {
          this.$refs.form.resetValidation()
        }
      })
    })
  },
  beforeDestroy () {
    this.$bus.$off('open-scopus-form')
  },
  methods: {
    async fetchRefs () {
      await Promise.all([
        this.$axios.$get(`${this.apiPath}domain-industries`)
      ]).then((values) => {
        this.domainIndustries = values[0].rows
      })
    },
    updateKeywords (vals) {
      this.keywords = vals.filter(ele => ele.trim() !== '').map(ele => ele.trim())
      this.form.keyword = vals.filter(ele => ele.trim() !== '').map(ele => ele.trim()).join('; ')
    },
    updateDomainIndustry (vals) {
      this.domainIndustry = vals.filter(ele => ele.trim() !== '').map(ele => ele.trim())
      this.form.domain_industry = vals.filter(ele => ele.trim() !== '').map(ele => ele.trim()).join('; ')
    },
    closeDialog () {
      this.dialog = false
      this.$overlay.hide()
    },
    clearData () {
      this.form = {
        scopus_id: '',
        keyword: '',
        domain_industry: '',
        scholarly_output: null,
        most_recent_pub: '',
        citation: null,
        citation_per_pub: null,
        fwci: null,
        h_index: null,
        citation_count: null,
        cited_by_count: null,
        document_count: null,
        no_of_coauthor: null,
        talent_id: null
      }
      this.keywords = []
      this.domainIndustry = this.isYoungTalent ? ['Young Talent'] : []
    },
    save () {
      if (this.$refs.form.validate()) {
        this.saving = true
        this.$emit(this.mode, this.form)
        this.dialog = false
      }
    }
  }
}
</script>
