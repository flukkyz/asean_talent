<template>
  <v-container class="py-16 px-11">
    <v-form ref="form" v-model="valid" :disabled="saving" @submit.prevent="save">
      <div :class="['d-flex mb-5',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : 'justify-space-between align-start']">
        <div class="mr-3">
          <p class="title mb-0 font-weight-bold">
            {{ headerText }}
          </p>
          <p v-if="mode === 'add'" class="mb-0 grey--text">
            Create your suggestion or question in the forum and add Related tags(optional)
          </p>
        </div>
        <v-btn
          large
          depressed
          type="submit"
          color="themeAccent"
          class="rounded-lg white--text"
          :class="[['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'mt-3' : '']"
          :disabled="saving || !valid"
          :loading="saving"
        >
          {{ mode === 'add' ? 'Publish Forum' : 'Edit Forum' }}
        </v-btn>
      </div>
      <v-divider v-if="mode === 'add'" class="mb-5" />

      <v-row>
        <v-col cols="12" md="12">
          <v-text-field
            v-model="form.title"
            outlined
            :autofocus="mode === 'add'"
            class="rounded-lg"
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
      </v-row>
      <client-only placeholder="Loading...">
        <p class="mb-0">
          Content
        </p>
        <ck-editor
          v-model="form.content"
          :config="$ckBasicConfig(uploadConfig)"
        />
        <v-input v-model="form.content" :rules="rules.content" />
      </client-only>
      <v-combobox
        v-model="tags"
        hide-selected
        label="Tags"
        multiple
        append-icon
        outlined
        dense
        class="mt-5 rounded-lg"
        hint="Input Tags and Enter or Tab for added"
        clearable
        chips
        deletable-chips
        small-chips
        persistent-hint
        @change="updateTags"
      />
    </v-form>
  </v-container>
</template>

<script>

export default {
  data () {
    return {
      modelName: 'Forum',
      uploadConfig: {
        uploadUrl: `${process.env.apiUrl}${process.env.apiDirectory}upload-img-member`,
        headers: {
          Authorization: this.$auth.strategy.token.get()
        }
      },
      mode: '',
      valid: true,
      saving: false,
      imgPreview: null,
      tags: [],
      rules: {
        title: [
          v => !!v || 'Title is required'
        ],
        content: [
          v => !!v || 'Content is required'
        ],
        forum_img: [
          (v) => {
            const mimetypeImages = ['image/png', 'image/gif', 'image/jpg', 'image/jpeg']
            return !v || mimetypeImages.includes(v.type) || this.$t('IMG_ONLY')
          },
          v => !v || v.size <= 1000000 || this.$t('LESS_SIZE', { text: this.$t('FILE'), count: '1 MB' })
        ]
      },
      form: {
        title: '',
        content: '',
        tags: '',
        forum_img: null
      }
    }
  },
  computed: {
    headerText () {
      return this.mode === 'add' ? `Create ${this.modelName}` : `Edit ${this.modelName}`
    }
  },
  created () {
    this.$bus.$on('open-forum-form', (data) => {
      this.saving = false
      this.mode = 'add'
      if (data) {
        this.mode = 'edit'
        this.form = {
          ...this.form,
          ...data
        }
        if (this.form.tags && this.form.tags.trim() !== '') {
          this.tags = this.form.tags.split('; ')
        }
      }
      setTimeout(() => {
        if (this.$refs.form) {
          this.$refs.form.resetValidation()
        }
      })
      this.$overlay.hide()
    })
  },
  beforeDestroy () {
    this.$bus.$off('open-forum-form')
  },
  methods: {
    changeImg (val) {
      if (val) {
        this.imgPreview = URL.createObjectURL(this.form.forum_img)
      }
    },
    updateTags (vals) {
      this.tags = vals.filter(ele => ele.trim() !== '').map(ele => ele.trim())
      this.form.tags = vals.filter(ele => ele.trim() !== '').map(ele => ele.trim()).join('; ')
    },
    save () {
      if (this.$refs.form.validate()) {
        this.saving = true
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
