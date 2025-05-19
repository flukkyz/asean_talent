<template>
  <v-container v-if="data">
    <v-card
      class="mx-auto mb-5"
    >
      <v-card-title class="align-start py-3">
        <div>
          <p class="headline mb-0">
            <span v-if="data.firstname !== data.lastname">
              {{ data.firstname }}
            </span>
            {{ data.lastname }}
          </p>
        </div>
        <v-spacer />
        <nuxt-link class="mr-4" :to="localePath({ name: 'backend-manages-young-talents-form-id', params: { id: $route.params.id } })">
          <v-icon
            small
            color="warning"
          >
            fas fa-edit
          </v-icon>
          <span class="warning--text caption">
            Edit
          </span>
        </nuxt-link>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-img v-if="data.Img && $imageExist(data.Img.url)" :src="data.Img.url" width="300" class="mb-1" />
        <label-value
          label="Gender"
          :value="data.gender"
        />
        <label-value
          label="Religion"
          :value="data.Religion ? data.Religion.name : ''"
        />

        <label-value
          label="University"
          :value="data.University ? data.University.name : ''"
        />

        <label-value
          label="City"
          :value="data.City ? data.City.name : ''"
        />

        <label-value
          label="Country"
          :value="data.Country ? data.Country.name : ''"
        />

        <label-value
          label="Domicile"
          :value="data.Domicile ? data.Domicile.name : ''"
        />
        <label-value
          label="E-mail"
          :value="data.email"
        />
        <label-value
          label="Phone Number"
          :value="data.phone_number"
        />
        <label-value
          label="Linkedin Url"
        >
          <a v-if="data.link_linkedin" :href="data.link_linkedin" target="_blank">
            {{ data.link_linkedin }}
          </a>
          <p v-else class="caption mb-0 red--text">
            No Data
          </p>
        </label-value>
        <label-value
          label="Research Gate"
        >
          <a v-if="data.research_gate" :href="data.research_gate" target="_blank">
            {{ data.research_gate }}
          </a>
          <p v-else class="caption mb-0 red--text">
            No Data
          </p>
        </label-value>
        <label-value
          label="TNRR"
        >
          <a v-if="data.link_tnrr" :href="data.link_tnrr" target="_blank">
            {{ data.link_tnrr }}
          </a>
          <p v-else class="caption mb-0 red--text">
            No Data
          </p>
        </label-value>
      </v-card-text>
    </v-card>

    <lists-scopus is-young-talent class="mb-5" :talent="data" @refresh="fetchAll" />

    <lists-collaboration class="mb-5" :talent="data" @refresh="fetchAll" />

    <lists-recommendation v-if="recommendations" class="mb-5" :list-datas="recommendations" />

    <div class="d-flex justify-end mb-10">
      <v-btn
        x-small
        outlined
        color="error"
        @click="$bus.$emit('open-delete-dialog-talent', null, `${data.firstname} ${data.lastname}`)"
      >
        <v-icon
          x-small
          class="mr-1"
          color="error"
        >
          fas fa-trash
        </v-icon>
        Delete this {{ modelName }}
      </v-btn>
    </div>
    <dialogs-delete value="talent" @delete="submitDelete" />
  </v-container>
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'country_admin'],
  validate ({ params }) {
    return /^\d+$/.test(params.id)
  },
  data () {
    return {
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      modelName: 'Young Talent',
      api: `${process.env.apiUrl}${process.env.apiDirectory}young-talents`,
      data: null,
      recommendations: null
    }
  },
  async fetch () {
    try {
      const data = await this.$axios.$get(`${this.apiPath}talents/${this.$route.params.id}`)
      this.data = data
      if (this.data.Scopus.length > 0) {
        const recommendations = await this.$axios.$get(`${this.apiPath}matchings/${this.data.Scopus[0].id}/recommendations?size=50&group=young_talent`)
        this.recommendations = recommendations
      }
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
    this.$breadcrumbs.setItems([
      {
        text: this.modelName,
        to: { name: 'backend-manages-young-talents' }
      },
      {
        text: `${this.data.firstname} ${this.data.lastname}`
      }
    ])
  },
  head () {
    return {
      title: this.data ? `${this.data.firstname} ${this.data.lastname}` : `Manage ${this.modelName}`
    }
  },
  methods: {
    async fetchAll (afterLoaded = null) {
      await this.$fetch()
      if (afterLoaded) {
        this.$nextTick(() => {
          afterLoaded()
        })
      }
    },
    async submitDelete () {
      try {
        await this.$axios.delete(`${this.apiPath}talents/${this.data.id}`)
        this.$notifier.showMessage({ title: 'Deleted', content: `Deleted ${this.modelName} Successfully`, color: 'success' })
        this.$router.push(this.localePath({ name: 'backend-manages-young-talents' }))
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
      this.$overlay.hide()
    },

    addCoAuthor () {
      this.$bus.$emit('open-co-data-scopus-list')
    },
    deleteCoAuthor (item) {
      this.$bus.$emit('open-delete-dialog', item.id, item.ScopusName.scopus_id, 'coAuthor')
    }
  }
}
</script>
