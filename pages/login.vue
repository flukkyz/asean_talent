<template>
  <div class="">
    <div class="hero-image" />
    <div class="text-center hero-title">
      <h1 :class="['font-weight-bold  themeAccent--text',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'display-1' : 'display-2']">
        SIGN IN
      </h1>
    </div>
    <div class="w-100 d-flex align-center justify-center py-16 hero-content">
      <div class="d-flex align-center">
        <v-card
          :elevation="['xs', 'sm'].includes($vuetify.breakpoint.name) ? '0' : ''"
          :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'rounded-0' : 'shadow rounded-lg'"
          width="400"
        >
          <v-card-text class="px-12 py-8">
            <forms-login @login="login" />
            <nuxt-link :to="localePath({name: 'forgot-password'})">
              <p class="text-right grey--text mt-2 mb-0">
                {{ $t('FORGOT_PASSWORD') }}
              </p>
            </nuxt-link>
            <div class="d-flex align-center my-5">
              <v-divider class="mr-3" />
              <p class="mb-0">
                {{ $t('OR') }}
              </p>
              <v-divider class="ml-3" />
            </div>
            <v-btn
              color="themeAccent"
              class="white--text rounded-lg"
              x-large
              depressed
              block
              :to="localePath({ name: 'register' })"
            >
              {{ $t("REGISTER") }}
            </v-btn>
          <!-- <div class="">
            <a href="/api/auth/oauth/facebook">
              <v-btn
                x-large
                block
                depressed
                class="mb-3"
                color="#4A589A"
              >
              &nbsp;
              &nbsp;
                <v-icon color="white" class="mr-5">
                  fab fa-facebook-f
                </v-icon>
              &nbsp;
                <span class="white--text">
                  Login with facebook
                </span>
              </v-btn>
            </a>
            <a href="/api/auth/oauth/google">
              <v-btn
                x-large
                block
                depressed
                class="mb-3"
                color="#E94231"
              >
                <v-icon color="white" class="mr-8">
                  fab fa-google
                </v-icon>
                <span class="white--text">
                  Login with Google
                </span>
              </v-btn>
            </a>
          </div> -->
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'guest',
  data () {
    return {
      pageName: this.$t('LOGIN'),
      basePath: `${process.env.baseUrl}${this.$route.fullPath}`
    }
  },
  head () {
    return this.$headUtil({
      lang: this.$lang.getISO,
      title: this.pageName,
      urlPath: this.basePath
    })
  },
  created () {
    this.$breadcrumbs.clear()
  },
  methods: {
    async login (data) {
      try {
        await this.$auth.loginWith('member', { data })
        // this.$router.back()
        this.$router.push(this.localePath({ name: 'index' }, this.$auth.user.lang))
        // window.open(this.localePath({ name: 'index' }, this.$auth.user.lang), '_self')
      } catch (err) {
        if (err.response.status === 403) {
          this.$bus.$emit('not-verify')
        } else {
          this.$bus.$emit('incorrect-login')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hero-image {
  background-image: url("/images/bg-top-xl.png");
  background-color: #cccccc;
  height: 356px;
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
}
.hero-title {
  margin-top: -198px;
}
.hero-content {
  margin-bottom: 198px;
}
</style>
