<template>
  <div class="">
    <v-card class="" color="bgLight" elevation="0">
      <v-card-title>
        <span class="caption grey--text ml-1">
          <v-icon x-small v-text="prependIcon" />
          {{ label }}
        </span>
        <v-spacer />
        <v-btn
          x-small
          elevation="0"
          class=" mr-2"
          depressed
          color="primary"
          @click="$bus.$emit(`open-img-select-${_uid}`,value)"
        >
          {{ value ? changeImageText : 'Choose' }}
        </v-btn>
        <v-btn
          v-if="value && removeImage"
          x-small
          elevation="0"
          class="ml-auto "
          outlined
          color="error"
          @click="onRemoveImage"
          v-text="removeImageText"
        />
      </v-card-title>
      <v-card-text class="pb-5">
        <v-img v-if="value" :src="value" contain :max-height="height" @click="dialogImage = true" />
        <v-img v-else :src="defaultImage" contain :max-height="height" />
        <v-input v-if="rules.length > 0" :value="value" :rules="rules" class="ml-1 mt-1" />
      </v-card-text>
    </v-card>
    <img-select :uid="_uid" @choose="onChooseImage" />

    <v-dialog v-model="dialogImage" :retain-focus="false" content-class="elevation-0 overflow-hidden" persistent>
      <div class="d-flex mb-1">
        <div class="ml-auto">
          <v-icon color="white" @click="dialogImage = false">
            mdi-close
          </v-icon>
        </div>
      </div>
      <v-carousel
        hide-delimiter-background
        :show-arrows="false"
        hide-delimiters
        height="100%"
        width="100%"
      >
        <v-carousel-item>
          <v-img
            max-height="1000"
            max-width="1000"
            :src="value"
            :lazy-src="value"
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
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'Choose an image'
    },
    height: {
      type: Number,
      default: 300
    },
    prependIcon: {
      type: String,
      default: 'fas fa-image'
    },
    changeImageText: {
      type: String,
      default: 'Change'
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
      default: 'Remove'
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
      dialogImage: false
    }
  },
  methods: {
    onChooseImage (data) {
      this.$emit('input', data.product_gallery_url)
    },
    onRemoveImage () {
      this.$emit('input', '')
    }
  }
}
</script>
