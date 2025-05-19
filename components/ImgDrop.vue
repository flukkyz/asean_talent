<template>
  <v-dialog v-model="dialog" persistent max-width="800">
    <v-card elevation="0">
      <v-card-title class="pt-2 pb-0 pl-4 pr-0">
        <h3>Upload Images</h3>
        <v-spacer />
        <v-btn
          v-if="!uploading"
          fab
          x-small
          text
          class="float-right ma-2"
          @click="closeDialog"
        >
          <v-icon>
            fas fa-times
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text
        class="pa-3"
        @drop.prevent="onDrop"
        @dragover.prevent="dragover = true"
        @dragenter.prevent="dragover = true"
        @dragleave.prevent="dragover = false"
      >
        <input
          ref="inputFiles"
          type="file"
          accept="image/*"
          multiple
          hidden
          @change="onFileChanged($event)"
        >

        <v-btn
          :outlined="!dragover"
          :depressed="dragover"
          block
          color="grey"
          class="mb-3"
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
            Drag images and drop here
            <br>
            or Click for browse images
          </span>
        </v-btn>
        <v-virtual-scroll
          v-if="files.length > 0"
          :items="files"
          height="200"
          item-height="45"
        >
          <template #default="{ item }">
            <v-list-item :key="item.file.name" class="pl-0">
              <v-img
                :src="item.preview"
                max-width="30"
                max-height="30"
                class="mr-3"
                contain
                aspect-ratio="1"
              />

              <v-list-item-content>
                <v-list-item-title>
                  {{ item.file.name }}
                  <span class="ml-3 grey--text caption">
                    {{ $formatBytes(item.file.size) }}
                  </span>
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-icon v-if="item.status === 'success'" color="success">
                  mdi-check
                </v-icon>
                <v-icon v-else-if="item.status === 'error'" color="error">
                  mdi-close
                </v-icon>
                <v-progress-circular
                  v-else-if="uploading"
                  size="25"
                  width="2"
                  indeterminate
                  color="primary"
                />

                <v-btn v-if="item.status === 'wait' && !uploading" icon @click.stop="removeFile(item.file.name)">
                  <v-icon> mdi-trash-can </v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </v-card-text>

      <v-card-actions>
        <v-btn
          v-if="percentCal === 100"
          outlined
          color="primary"
          @click.stop="clearUploaded"
        >
          <v-icon left>
            fas fa-sync-alt
          </v-icon>
          UPLOAD AGAIN
        </v-btn>
        <v-btn
          v-else
          depressed
          color="primary"
          :disabled="!hasFile || uploading"
          :loading="uploading"
          @click.stop="saveImage"
        >
          <v-icon left>
            mdi-cloud-upload
          </v-icon>
          UPLOAD
        </v-btn>

        <div class="flex-grow-1 ml-3">
          <v-progress-linear
            v-if="uploading || percentCal > 0"
            :value="percentCal"
            :color="percentCal > 0 ? 'primary' : 'grey'"
            class=""
            height="10"
          >
            <template #default="{ value }">
              <span v-if="percentCal > 0" class="very-small" :class="value > 50 ? 'white--text' : ''">
                {{ Math.ceil(value) }}%
              </span>
            </template>
          </v-progress-linear>
          <p v-if="uploading || percentCal > 0" class="caption teal--text mb-0">
            {{ successUploaded }}
            /
            {{ files.length }}
            {{ files.length > 1 ? 'Images' :'Image' }}
            Upload Completed
          </p>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    maxFileSize: {
      type: Number,
      default: 5000000
    },
    uid: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      dialog: false,
      uploading: false,
      dragover: false,
      files: [],
      progress: {
        all: 0,
        count: 0
      }
    }
  },
  computed: {
    hasFile () {
      return this.files.length > 0
    },
    successUploaded () {
      return this.files.filter(ele => ele.status === 'success').length
    },
    percentCal () {
      return this.progress.count / this.progress.all * 100
    }
  },
  created () {
    this.$bus.$on(`open-img-drop${(this.uid ? `-${this.uid}` : '')}`, () => {
      this.$overlay.showLoading()
      this.dialog = true
    })
  },
  beforeDestroy () {
    this.$bus.$off(`open-img-drop${(this.uid ? `-${this.uid}` : '')}`)
  },
  methods: {
    closeDialog () {
      this.dialog = false
      this.$overlay.hide()
    },
    selectFile () {
      const fileInputElement = this.$refs.inputFiles
      fileInputElement.click()
    },
    removeFile (fileName) {
      const index = this.files.findIndex(
        file => file.file.name === fileName
      )
      if (index > -1) { this.files.splice(index, 1) }
    },
    onFileChanged (e) {
      this.keepData(e.target.files)
    },
    onDrop (e) {
      this.dragover = false
      this.keepData(e.dataTransfer.files)
    },
    keepData (fileLists) {
      for (const file of fileLists) {
        if (file.size > this.maxFileSize) {
          this.$notifier.showMessage({
            title: 'File is too large',
            content: this.$t('LESS_SIZE', { text: ` File "${file.name}" `, count: '5 MB' }),
            color: 'error'
          })
        } else if (['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type)) {
          this.files.push({
            file,
            preview: URL.createObjectURL(file),
            status: 'wait'
          })
        }
      }
    },
    clearUploaded () {
      this.files = []
      this.progress = {
        all: 0,
        count: 0
      }
    },
    async saveImage () {
      this.progress.all = this.files.length
      this.uploading = true
      for (const file of this.files) {
        const formData = new FormData()
        formData.append('image', file.file)
        try {
          await this.$axios.$post(`${process.env.apiUrl}${process.env.apiDirectory}product_gallery`, formData)
          this.progress.count++
          file.status = 'success'
        } catch (e) {
          this.$notifier.showMessage({ title: 'Upload failed', content: `Image file "${file.file.name}" cannot upload`, color: 'error' })
        }
      }
      this.uploading = false
      this.$notifier.showMessage({ title: 'Upload successfully', content: `${this.successUploaded} ${this.successUploaded > 1 ? 'images' : 'image'} was uploaded successfully`, color: 'success' })
      this.$emit('refresh')
    }
  }
}
</script>
