<template>
  <div class="mb-10">
    <v-card
      class="shadow mb-5"
      color="primary"
    >
      <v-card-text>
        <p class="headline font-weight-bold mb-0 white--text">
          Thai National Research Repository (TNRR)
        </p>
      </v-card-text>
    </v-card>
    <v-card
      class="shadow"
    >
      <v-card-text>
        <p class="headline font-weight-bold themeAccent--text text-center">
          ASEAN Talent Pool in NRIIS
        </p>
        <div class="d-flex flex-wrap justify-center">
          <v-card
            v-for="(industry,index) in industries"
            :key="`card-industry-${industry.domain_industry_id}`"
            outlined
            min-width="200"
            class="rounded-lg industry-card-border mb-2"
            :class="index < industries.length-1 ? 'mr-2' : ''"
            :style="`border-color: ${industryColors[industry.name].color};`"
            :to="localePath({name: 'backend-reports-tnrr-slug', params: {slug: industry.name} })"
          >
            <v-card-text class="d-flex align-center flex-column" :class="`${industryColors[industry.name].class}--text`">
              <v-img :src="`/images/industries/icons/${industry.name}.png`" height="80" contain />
              <p class="body-1 mt-3 mb-0 font-weight-bold">
                {{ industry.name }}
              </p>
              <!-- <p class="display-1 mt-3 mb-0 font-weight-bold">
                {{ $currencyText(industry.countKeywords) }}
              </p>
              <p class="mb-0 font-weight-bold">
                Keywords
              </p> -->
              <div class="d-flex mt-3 align-center">
                <v-icon left :color="industryColors[industry.name].class">
                  fas fa-user
                </v-icon>
                <p class="display-1 mb-0 font-weight-bold">
                  {{ $currencyText(industry.countTalents) }}
                </p>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'admin'],
  data () {
    return {
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      industries: null
    }
  },
  computed: {
    industryColors () {
      return this.$store.state.enums.industries
    }
  },
  async mounted () {
    try {
      const datas = await this.$axios.$get(`${this.apiPath}dashboards/count-talents-group-industry?country=Thailand&group=talent`)
      this.industries = datas
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
  },
  created () {
    this.$breadcrumbs.clear()
  }
}
</script>

<style lang="scss" scoped>
.industry-card-border{
  border-width: 2px;
  border-top-width: 10px;
}
</style>
