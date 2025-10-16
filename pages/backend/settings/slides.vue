<template>
  <div v-if="listDatas" class="pb-16">
    <div class="d-flex mb-3">
      <div class="">
        <p class="headline font-weight-bold mb-0">
          {{ modelName }}
        </p>
        <p class="caption red--text text--darken-3 wrap-word">
          <v-icon color="red darken-3" x-small>
            mdi-asterisk
          </v-icon>
          The display slider automatically adjusts to the screen size. All images should be the same size, with a recommended of
          <span class="font-weight-bold">
            1600 x 500 pixels.
          </span>
        </p>
      </div>
      <v-spacer />
      <v-btn v-if="listDatas.length > 0" small color="primary" @click="$bus.$emit('open-image-form','slide_img')">
        <v-icon small left>
          mdi-plus
        </v-icon>
        {{ modelName }}
      </v-btn>
    </div>
    <v-row v-if="listDatas.length > 0">
      <v-col
        v-for="item in listDatas"
        :key="`item-${item.id}`"
        cols="12"
      >
        <v-hover v-slot="{ hover }">
          <v-img :src="item.Img.url" class="mx-auto d-flex align-end rounded">
            <div class="d-flex mt-1 pa-2" style="background-color: #99999999;">
              <p v-if="item.link" class="mb-0 text-center text-truncate">
                <span class="caption font-weight-bold">
                  Link
                </span>
                <a :href="item.link" target="_blank">
                  {{ item.link }}
                </a>
              </p>
              <v-spacer />
              <div v-if="hover" class="text-center white rounded" style="min-width: 25px;">
                <v-icon small class="mt-n1" color="error" @click="$bus.$emit('open-delete-dialog', item.id, modelName)">
                  fas fa-trash-alt
                </v-icon>
              </div>
            </div>
          </v-img>
        </v-hover>
      </v-col>
    </v-row>
    <div v-else>
      <v-card
        elevation="0"
        @click="$bus.$emit('open-image-form','slide_img')"
      >
        <v-card-text>
          <h1 class="display-1 text-center py-5">
            <i class="fas fa-plus mr-3" />
            {{ modelName }}
          </h1>
        </v-card-text>
      </v-card>
    </div>
    <forms-image @add="submitCreate" />
    <dialogs-delete @delete="submitDelete" />
  </div>
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'admin'],
  data () {
    return {
      modelName: 'Slider',
      api: `${process.env.apiUrl}${process.env.apiDirectory}slides`,
      listDatas: null
    }
  },
  async fetch () {
    try {
      const datas = await this.$axios.$get(this.api)
      this.listDatas = datas
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
    this.$breadcrumbs.clear()
  },
  head () {
    return {
      title: `Manage ${this.modelName}`
    }
  },
  methods: {
    async submitCreate (data) {
      try {
        const result = await this.$axios.$post(`${this.api}`, data)
        await this.$fetch()
        if (result) {
          this.$notifier.showMessage({ title: 'Created', content: `Create ${this.modelName} Successfully`, color: 'success' })
        }
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
      this.$overlay.hide()
    },
    async submitDelete (id) {
      try {
        await this.$axios.delete(`${this.api}/${id}`)
        this.$notifier.showMessage({ title: 'Deleted', content: `Deleted ${this.modelName} Successfully`, color: 'success' })
        this.$fetch()
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
      this.$overlay.hide()
    }
  }
}
</script>
