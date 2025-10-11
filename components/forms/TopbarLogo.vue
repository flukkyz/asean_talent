<template>
  <v-dialog v-model="dialog" persistent scrollable :max-width="dialogWidth">
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
                  v-model="form.topbar_logo_img"
                  accept="image/jpeg,image/gif,image/png"
                  prepend-icon="mdi-image-size-select-actual"
                  outlined
                  :rules="rules.topbar_logo_img"
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
          <v-text-field
            v-model="form.url"
            outlined
            :rules="rules.url"
            required
          >
            <template #label>
              URL
              <v-icon color="error" x-small class="mt-n3">
                mdi-asterisk
              </v-icon>
            </template>
          </v-text-field>
          <v-textarea
            v-model="form.description"
            outlined
            label="Note"
            dense
          />
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
      modelName: 'Topbar Logo',
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      dialog: false,
      dialogWidth: 999,
      mode: '',
      valid: true,
      saving: false,
      imgPreview: null,
      rules: {
        name: [
          v => !!v || 'Title is required'
        ],
        url: [
          v => !!v || 'URL is required'
        ],
        topbar_logo_img: [
          v => !!v || 'Image is required',
          (v) => {
            const mimetypeImages = ['image/png', 'image/gif', 'image/jpg', 'image/jpeg']
            return !v || mimetypeImages.includes(v.type) || this.$t('IMG_ONLY')
          },
          v => !v || v.size <= 1000000 || this.$t('LESS_SIZE', { text: this.$t('FILE'), count: '1 MB' })
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
    this.$bus.$on('open-topbar-logo-form', (data) => {
      this.dialogWidth = 999
      this.$overlay.showLoading()
      this.saving = false
      this.clearData()
      this.mode = 'add'
      if (data) {
        this.mode = 'edit'
        this.form = {
          ...this.form,
          ...data
        }
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
    this.$bus.$off('open-topbar-logo-form')
  },
  methods: {
    changeImg (val) {
      if (val) {
        console.log(this.form.topbar_logo_img)
        this.imgPreview = URL.createObjectURL(this.form.topbar_logo_img)
      }
    },
    closeDialog () {
      this.dialog = false
      this.$overlay.hide()
    },
    clearData () {
      this.form = {
        name: '',
        url: '',
        topbar_logo_img: null
      }
    },
    save () {
      if (this.$refs.form.validate()) {
        this.saving = true
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
