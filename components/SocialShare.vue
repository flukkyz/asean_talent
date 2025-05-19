<template>
  <v-speed-dial
    :direction="direction"
    transition="slide-x-reverse-transition"
  >
    <template #activator>
      <v-btn
        color="themeAccent"
        icon
      >
        <v-icon>
          fas fa-share-alt
        </v-icon>
      </v-btn>
    </template>
    <template v-for="socialSharing in socialSharings">
      <ShareNetwork
        v-if="socialSharing.network !== 'copy'"
        :key="`social-sharing-${socialSharing.network}`"
        :network="socialSharing.network"
        :url="`${baseUrl}${path}`"
        :title="title"
        :description="$removeHtml(content).substring(0, 150)"
        :hashtags="tag"
      >
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              :color="socialSharing.color"
              class="ml-2"
              v-on="on"
            >
              {{ socialSharing.icon }}
            </v-icon>
          </template>
          <span>{{ socialSharing.text }}</span>
        </v-tooltip>
      </ShareNetwork>
      <v-tooltip v-else :key="`social-sharing-${socialSharing.network}`" top>
        <template #activator="{ on, attrs }">
          <v-icon
            v-bind="attrs"
            :color="socialSharing.color"
            class="ml-2"
            v-on="on"
            @click="copyToClipboard"
          >
            {{ socialSharing.icon }}
          </v-icon>
        </template>
        <span>{{ socialSharing.text }}</span>
      </v-tooltip>
    </template>
  </v-speed-dial>
</template>

<script>
export default {
  props: {
    path: {
      type: String || Object,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      default: ''
    },
    tag: {
      type: String,
      default: ''
    },
    direction: {
      type: String,
      default: 'left'
    }
  },
  data () {
    return {
      baseUrl: process.env.baseUrl,
      socialSharings: [
        {
          network: 'twitter',
          text: 'X / Twitter',
          icon: 'fa-brands fa-x-twitter',
          color: 'black'
        },
        {
          network: 'linkedIn',
          text: 'LinkedIn',
          icon: 'fab fa-linkedin',
          color: 'themeAccent'
        },
        {
          network: 'line',
          text: 'Line',
          icon: 'fab fa-line',
          color: 'succes'
        },
        {
          network: 'facebook',
          text: 'facebook',
          icon: 'fab fa-facebook',
          color: 'info'
        },
        {
          network: 'email',
          text: 'E-mail',
          icon: 'fas fa-envelope',
          color: 'grey'
        },
        {
          network: 'copy',
          text: 'Copy Link',
          icon: 'fas fa-copy',
          color: 'grey darken-3'
        }
      ]
    }
  },
  methods: {
    copyToClipboard () {
      this.$copyText(`${this.baseUrl}${this.path}`)
      this.$notifier.showMessage({ title: 'Copy to Clipboard', content: `Copied ${this.baseUrl}${this.path}`, color: 'info' })
    }
  }
}
</script>
