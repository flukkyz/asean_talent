<template>
  <div class="">
    <v-card class="" color="bgLight" elevation="0">
      <v-card-title>
        <span class="caption grey--text ml-1">
          <v-icon x-small v-text="prependIcon" />
          {{ label }}
          <span v-if="value.length > 0" class="font-weight-bold">
            (
            {{ value.length }}
            <span v-if="!!maxChoose">
              /
              {{ maxChoose }}
            </span>
            )
          </span>
          <span v-else-if="!!maxChoose" class="red--text font-weight-bold">
            ( max {{ maxChoose }} )
          </span>
        </span>
        <v-spacer />
        <v-btn
          v-if="value.length > 0"
          x-small
          elevation="0"
          class=" mr-2"
          depressed
          color="primary"
          @click="$bus.$emit(`open-img-select-${_uid}`,value)"
        >
          {{ changeImageText }}
        </v-btn>
        <v-btn
          v-if="value.length > 0 && removeImage"
          x-small
          elevation="0"
          class="ml-auto "
          outlined
          color="error"
          @click="onRemoveAllImage"
          v-text="removeImageText"
        />
      </v-card-title>
      <v-card-text v-if="value.length > 0" class="pb-5">
        <v-row>
          <v-col
            v-for="(val,i) in value"
            :key="`choose-images-${val.product_gallery_url}`"
            cols="6"
            sm="4"
            xl="2"
          >
            <v-img :src="val.product_gallery_url" contain max-height="100" @click="openDialogImage(i)" />
          </v-col>
        </v-row>
        <v-input v-if="rules.length > 0" :value="value" :rules="rules" class="ml-1 mt-1" />
      </v-card-text>
      <v-card-text v-else class="pointer" @click="$bus.$emit(`open-img-select-${_uid}`,value)">
        <h1 class="display-2 text-center grey--text pt-8 mt-16 font-weight-light">
          No Image
        </h1>
        <p class="headline mb-16 pb-8 text-center primary--text">
          Click here to Choose Images
        </p>
        <v-input v-if="rules.length > 0" :value="value" :rules="rules" class="ml-1 mt-1" />
      </v-card-text>
    </v-card>
    <img-select :uid="_uid" multiple :max-choose="maxChoose" @choose="onChooseImage" />

    <v-dialog v-model="dialogImage" :retain-focus="false" content-class="elevation-0 overflow-hidden" persistent>
      <div class="d-flex mb-1">
        <div class="ml-auto">
          <v-icon color="white" @click="dialogImage = false">
            mdi-close
          </v-icon>
        </div>
      </div>
      <v-carousel
        v-model="photoIndex"
        hide-delimiter-background
        show-arrows-on-hover
        hide-delimiters
        height="100%"
        width="100%"
      >
        <v-carousel-item v-for="img in value" :key="`img-box-lists-carousel-${img.product_gallery_id}`">
          <v-img
            max-height="1000"
            max-width="1000"
            :src="img.product_gallery_url"
            :lazy-src="img.product_gallery_url"
            contain
            aspect-ratio="1.1618"
            eager
            class="mx-auto"
          />
        </v-carousel-item>
      </v-carousel>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => { return [] }
    },
    label: {
      type: String,
      default: 'Choose an images'
    },
    prependIcon: {
      type: String,
      default: 'fas fa-images'
    },
    changeImageText: {
      type: String,
      default: 'Change'
    },
    minChoose: {
      type: Number,
      default: 1
    },
    maxChoose: {
      type: Number,
      default: null
    },
    defaultImage: {
      type: String,
      default: '/images/logo-s.webp'
    },
    removeImage: {
      type: Boolean,
      default: true
    },
    removeImageText: {
      type: String,
      default: 'Remove all'
    },
    rules: {
      type: Array,
      default: Array
    }
  },
  data () {
    return {
      model: null,
      newImgPreview: null,
      photoIndex: null,
      dialogImage: false
    }
  },
  methods: {
    onChooseImage (data) {
      this.$emit('input', data)
    },
    onRemoveAllImage () {
      this.$emit('input', [])
    },
    openDialogImage (index) {
      this.photoIndex = index
      this.dialogImage = true
    }
  }
}
</script>
