<template>
  <v-dialog v-model="dialog" persistent scrollable :retain-focus="false" :max-width="dialogWidth">
    <v-form ref="form" v-model="valid" @submit.prevent="save">
      <v-card v-if="blogCategories" class="">
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
            <v-col cols="12" md="8">
              <v-text-field
                v-model="form.title"
                outlined
                :autofocus="mode === 'add'"
                :rules="rules.title"
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
            <v-col cols="12" md="4">
              <div v-if="form.Img" class="mb-5">
                <div class="float-right mt-2">
                  <div class="text-right">
                    <v-btn small class="ma-2" @click="form.Img = null">
                      Change Image
                    </v-btn>
                  </div>
                  <div class="text-right">
                    <v-btn small color="error" class="ma-2" @click="removeImage">
                      Delete Image
                    </v-btn>
                  </div>
                </div>
                <p>Image</p>
                <v-img :src="form.Img.url" contain max-height="100" />
              </div>
              <div v-else>
                <v-file-input
                  v-model="form.blog_img"
                  accept="image/jpeg,image/gif,image/png"
                  prepend-icon="mdi-image-size-select-actual"
                  outlined
                  :rules="rules.blog_img"
                  :show-size="1000"
                  @change="changeImg"
                >
                  <template #label>
                    Image
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
          <client-only placeholder="Loading...">
            <p class="mb-0">
              Content
            </p>
            <ck-editor
              v-model="form.content"
              :config="$ckConfig(uploadConfig)"
            />
          </client-only>
          <v-autocomplete
            v-model="form.blog_category_id"
            :items="blogCategories"
            item-value="id"
            item-text="name"
            outlined
            dense
            :rules="rules.blog_category_id"
          >
            <template #label>
              Category
              <v-icon color="error" x-small class="mt-n3">
                mdi-asterisk
              </v-icon>
            </template>
          </v-autocomplete>
          <v-combobox
            v-model="tags"
            hide-selected
            label="Tags"
            multiple
            append-icon
            outlined
            dense
            class="mt-5"
            hint="Input Tags and Enter or Tab for added"
            clearable
            chips
            deletable-chips
            small-chips
            persistent-hint
            @change="updateTags"
          />
        </v-card-text>
        <v-card-actions class="px-4 pb-4">
          <v-spacer />
          <v-btn
            color="primary"
            x-large
            block
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
      modelName: 'News & Activity',
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      uploadConfig: {
        uploadUrl: `${process.env.apiUrl}${process.env.apiDirectory}upload-img`,
        headers: {
          Authorization: this.$auth.strategy.token.get()
        }
      },
      dialog: false,
      dialogWidth: 1399,
      mode: '',
      valid: true,
      saving: false,
      blogCategories: null,
      imgPreview: null,
      tags: [],
      rules: {
        title: [
          v => !!v || 'Title is required'
        ],
        blog_category_id: [
          v => !!v || 'Category is required'
        ],
        blog_img: [
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
    this.$bus.$on('open-blog-form', async(data) => {
      this.dialogWidth = 1399
      this.$overlay.showLoading()
      this.saving = false
      await this.fetchRefs()
      this.clearData()
      this.mode = 'add'
      if (data) {
        this.mode = 'edit'
        this.form = {
          ...this.form,
          ...data
        }
        if (this.form.tags.trim() !== '') {
          this.tags = this.form.tags.split('; ')
        }
      }
      this.dialog = true
      setTimeout(() => {
        if (this.$refs.form) {
          this.$refs.form.resetValidation()
        }
      })
      setTimeout(() => {
        this.dialogWidth = 1400
      }, 300)
    })
  },
  beforeDestroy () {
    this.$bus.$off('open-blog-form')
  },
  methods: {
    async fetchRefs () {
      await Promise.all([
        this.$axios.$get(`${this.apiPath}blog-categories`),
      ]).then((values) => {
        this.blogCategories = values[0].rows
      })
    },
    changeImg (val) {
      if (val) {
        this.imgPreview = URL.createObjectURL(this.form.blog_img)
      }
    },
    updateTags (vals) {
      this.tags = vals.filter(ele => ele.trim() !== '').map(ele => ele.trim())
      this.form.tags = vals.filter(ele => ele.trim() !== '').map(ele => ele.trim()).join('; ')
    },
    closeDialog () {
      this.dialog = false
      this.$overlay.hide()
    },
    clearData () {
      this.form = {
        title: '',
        content: '',
        tags: '',
        blog_category_id: null,
        blog_img: null
      }
      this.tags = []
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
