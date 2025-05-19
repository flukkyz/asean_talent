<template>
  <div v-if="profile" class="">
    <div class="hero-image" style="height: 96px;">
      <v-container fluid :class="['d-flex align-center h-100',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column justify-center' : 'justify-space-between px-5']">
        <h1 :class="['font-weight-bold',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'headline' : 'display-1']">
          {{ pageName }}
        </h1>
      </v-container>
    </div>
    <div class="py-16">
      <v-container :class="{ 'px-8': ['sm', 'xs'].includes($vuetify.breakpoint.name)}">
        <!-- <v-row justify="center">
          <v-col cols="12" md="8">
            <p class="title nb-0 font-weight-bold themeAccent--text">
              Basic info
            </p>
            <v-card class="shadow rounded-xl">
              <v-card-text class="pa-8 d-flex align-center" :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : ''">
                <v-avatar size="200" class="shadow">
                  <v-img v-if="$auth.user.avatar" :src="$auth.user.avatar" />
                  <v-img v-else src="/images/logo.png" />
                </v-avatar>
                <div :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'ml-12'">
                  <p class="font-weight-bold themeAccent--text display-1 mt-5 mb-0">
                    {{ profile.name }}
                  </p>
                  <p class="grey--text">
                    {{ $_.capitalize($auth.user.member_type) }}
                  </p>
                  <div class="d-flex align-center mb-2">
                    <v-icon left color="themePrimary">
                      mdi-map-marker
                    </v-icon>
                    <p class="mb-0 body-1">
                      {{ profile.Country ? profile.Country.name : '' }}
                    </p>
                  </div>
                  <div class="d-flex align-center mb-2">
                    <v-icon left color="themePrimary">
                      mdi-email
                    </v-icon>
                    <p class="mb-0 body-1">
                      {{ $auth.user.email }}
                    </p>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row> -->
        <div class="pb-8">
          <client-only v-if="setting && setting.member_notice" placeholder="Loading...">
            <div class="ck-content" v-html="setting.member_notice" />
          </client-only>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'member',
  middleware: ['authen', 'frontend'],
  data () {
    return {
      pageName: 'ASEAN Talent Community',
      basePath: `${process.env.baseUrl}${this.$route.fullPath}`,
      profile: {}
    }
  },
  async fetch () {
    try {
      await this.$auth.fetchUser()
      if (this.$auth.user.member_type === 'researcher') {
        this.profile = {
          ...this.$auth.user.Researcher,
          name: `${this.$auth.user.Researcher.firstname} ${this.$auth.user.Researcher.lastname}`
        }
      } else if (this.$auth.user.member_type === 'organization') {
        this.profile = {
          ...this.$auth.user.Organization
        }
      }
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
    this.$overlay.hide()
  },
  head () {
    return this.$headUtil({
      lang: this.$lang.getISO,
      title: this.pageName,
      urlPath: this.basePath
    })
  },
  computed: {
    setting () {
      return this.$store.state.setting
    }
  },
  created () {
    this.$breadcrumbs.clear()
  }
}
</script>

<style lang="scss" scoped>
.hero-image {
  background: linear-gradient(to left, #d6d6e6 0%, #f0f0f5 100%);
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
</style>
