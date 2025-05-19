<template>
  <div class="">
    <v-hover
      v-if="!!value"
      v-slot="{ hover }"
    >
      <v-img
        :src="value"
        aspect-ratio="1"
        :lazy-src="value"
        eager
        :max-height="height"
        :max-width="width"
      >
        <div class="w-100 h-100 relative">
          <v-tooltip v-if="hover && !!value" left>
            <template #activator="{ on, attrs }">
              <v-icon
                small
                color="white"
                class="browse-btn"
                style="text-shadow: 1px 1px 1px #999;"
                v-bind="attrs"
                @click="$bus.$emit(`open-img-select-${_uid}`,value)"
                v-on="on"
              >
                fas fa-folder-open
              </v-icon>
            </template>
            <span>{{ changeImageText }}</span>
          </v-tooltip>
          <v-tooltip v-if="hover && !!value" top>
            <template #activator="{ on, attrs }">
              <v-icon
                small
                class="view-btn"
                color="white"
                style="text-shadow: 1px 1px 1px #999;"
                v-bind="attrs"
                @click="dialogImage = true"
                v-on="on"
              >
                fas fa-eye
              </v-icon>
            </template>
            <span>View</span>
          </v-tooltip>
          <v-tooltip v-if="hover && !!value" right>
            <template #activator="{ on, attrs }">
              <v-icon

                small
                color="white"
                class="remove-btn"
                style="text-shadow: 1px 1px 1px #999;"
                v-bind="attrs"
                @click="onRemoveImage"
                v-on="on"
              >
                fas fa-trash-alt
              </v-icon>
            </template>
            <span>{{ removeImageText }}</span>
          </v-tooltip>
        </div>
      </v-img>
    </v-hover>
    <v-img
      v-else
      :src="defaultImage"
      aspect-ratio="1"
      :lazy-src="value"
      class="pointer"
      :max-height="height"
      :max-width="width"
      @click="$bus.$emit(`open-img-select-${_uid}`,value)"
    />
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
    height: {
      type: Number,
      default: 100
    },
    width: {
      type: Number,
      default: 100
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

<style lang="scss" scoped>
.relative{
  position: relative;
}
.view-btn{
  position: absolute;
  top: 5px;
  right: 5px;
}
.browse-btn{
  position: absolute;
  bottom: 5px;
  left: 5px;
}
.remove-btn{
  position: absolute;
  bottom: 5px;
  right: 5px;
}
</style>
