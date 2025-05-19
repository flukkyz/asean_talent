<template>
  <v-dialog v-if="form" v-model="dialog" persistent max-width="600">
    <v-form ref="form" v-model="valid" @submit.prevent="save">
      <v-card>
        <v-toolbar
          flat
        >
          <v-toolbar-title>
            <v-icon class="mr-2">
              fas fa-plus
            </v-icon>
            {{ $t('NEW', {text: modelName}) }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn fab x-small text @click="closeDialog">
            <v-icon>
              fas fa-times
            </v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text
          class="pt-5 px-5 pb-0"
          @drop.prevent="onDrop"
          @dragover.prevent="dragover = true"
          @dragenter.prevent="dragover = true"
          @dragleave.prevent="dragover = false"
        >
          <input
            ref="inputFiles"
            type="file"
            accept="image/*"
            hidden
            @change="onFileChanged($event)"
          >
          <div v-if="!!(!!imgPreview || !!oldImg)" class="text-right">
            <v-btn
              small
              elevation="0"
              outlined
              @click="selectFile()"
            >
              {{ $t('CHANGE',{text: $t('IMAGE')}) }}
            </v-btn>
          </div>

          <v-btn
            v-if="!imgPreview && !oldImg"
            :outlined="!dragover"
            :depressed="dragover"
            block
            color="grey"
            height="150"
            @click="selectFile()"
          >
            <v-icon
              :color="dragover ? 'white' : 'grey darken-2'"
              class="mr-3"
              :class="[dragover ? 'mt-2, mb-4' : 'mt-2']"
              size="60"
            >
              mdi-cloud-upload
            </v-icon>

            <span :class="{'white--text': dragover}">
              {{ $t('DRAG_IMAGES_HERE') }}
              <br>
              {{ $t('OR') }}
              {{ $t('CLICK_BROWSE_IMAGES') }}
            </span>
          </v-btn>
          <v-img v-if="oldImg" class="mt-5" :src="oldImg" contain aspect-ratio="1.618" />
          <v-img v-else-if="imgPreview" class="mt-5" :src="imgPreview" contain aspect-ratio="1.618" />
          <v-input v-model="form.image" class="ml-5" :rules="rules.image" />
        </v-card-text>
        <v-card-text v-if="!hideUrl" class="">
          <v-text-field
            v-model="form.link"
            label="URL"
            hide-details
            dense
            outlined
          />
        </v-card-text>
        <v-card-actions class="px-4 pb-4">
          <v-spacer />
          <v-btn
            color="info"
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
  props: {
    value: {
      type: String,
      default: null
    },
    hideUrl: {
      type: Boolean,
      default: false
    },
    header: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      modelName: 'Image',
      dialog: false,
      valid: true,
      saving: false,
      mode: '',
      fieldName: '',
      dragover: false,
      imgPreview: null,
      oldImg: null,
      rules: {
        image: [
          v => (!!v || !!this.oldImg) || this.$t('IS_REQUIRED', { text: ' Image' }),
          (v) => {
            const mimetypeImages = ['image/png', 'image/gif', 'image/jpg', 'image/jpeg']
            return !v || mimetypeImages.includes(v.type) || this.$t('IMG_ONLY')
          },
          v => !v || v.size <= 5000000 || this.$t('LESS_SIZE', { text: this.$t('FILE'), count: '5 MB' })
        ]
      },
      form: null
    }
  },
  created () {
    this.$bus.$on('open-image-form', (fieldName, oldData) => {
      this.$overlay.showLoading()
      this.saving = false
      this.clearData()
      this.fieldName = fieldName
      this.mode = 'add'
      if (oldData) {
        this.mode = 'edit'
        this.form = { ...this.form, ...oldData }
        this.oldImg = oldData.image_url
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
    this.$bus.$off('open-image-form')
  },
  methods: {
    closeDialog () {
      this.dialog = false
      this.$overlay.hide()
    },
    selectFile () {
      const fileInputElement = this.$refs.inputFiles
      fileInputElement.value = null
      fileInputElement.click()
    },
    onFileChanged (e) {
      if (e.target.files && e.target.files.length > 0) {
        this.keepData(e.target.files[0])
      }
    },
    onDrop (e) {
      this.dragover = false
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        this.keepData(e.dataTransfer.files[0])
      }
    },
    keepData (file) {
      this.form.image = file
      if (['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type)) {
        this.imgPreview = URL.createObjectURL(file)
        this.oldImg = null
      } else {
        this.imgPreview = null
      }
    },
    clearData () {
      this.imgPreview = null
      this.oldImg = null
      this.form = {
        image: null,
        link: ''
      }
    },
    save () {
      if (this.$refs.form.validate()) {
        this.saving = true
        const formData = new FormData()
        formData.append(this.fieldName, this.form.image)
        formData.append('link', this.form.link)
        this.$emit(this.mode, formData)
        this.dialog = false
      }
    }
  }
}
</script>
