import colors from 'vuetify/es5/util/colors'
import i18n from './config/i18n'
import auth from './config/auth'

export default {
  ssr: true,
  loading: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    htmlAttrs: {
      class: 'notranslate',
      translate: 'no'
    },
    titleTemplate: `%s - ${process.env.APP_NAME}`,
    title: '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'msapplication-TileColor', content: '#082141' },
      { name: 'msapplication-TileImage', content: '/icons/ms-icon-144x144.png' },
      // { name: 'theme-color', content: '#eb9421' },
      { name: 'google', content: 'notranslate' },
      { name: 'google-site-verification', content: process.env.GOOGLE_SITE_VERIFICATION }
    ],
    link: [
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css' },
      { rel: 'icon', type: 'image/x-icon', href: '/icons/favicon.ico' },
      { rel: 'apple-touch-icon', sizes: '57x57', href: '/icons/apple-icon-57x57.png' },
      { rel: 'apple-touch-icon', sizes: '60x60', href: '/icons/apple-icon-60x60.png' },
      { rel: 'apple-touch-icon', sizes: '72x72', href: '/icons/apple-icon-72x72.png' },
      { rel: 'apple-touch-icon', sizes: '76x76', href: '/icons/apple-icon-76x76.png' },
      { rel: 'apple-touch-icon', sizes: '114x114', href: '/icons/apple-icon-114x114.png' },
      { rel: 'apple-touch-icon', sizes: '120x120', href: '/icons/apple-icon-120x120.png' },
      { rel: 'apple-touch-icon', sizes: '144x144', href: '/icons/apple-icon-144x144.png' },
      { rel: 'apple-touch-icon', sizes: '152x152', href: '/icons/apple-icon-152x152.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/icons/apple-icon-180x180.png' },
      { rel: 'icon', type: 'image/png', sizes: '36x36', href: '/icons/android-icon-36x36.png' },
      { rel: 'icon', type: 'image/png', sizes: '48x48', href: '/icons/android-icon-48x48.png' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/icons/android-icon-192x192.png' },
      { rel: 'icon', type: 'image/png', sizes: '70x70', href: '/icons/ms-icon-70x70.png' },
      { rel: 'icon', type: 'image/png', sizes: '150x150', href: '/icons/ms-icon-150x150.png' },
      { rel: 'icon', type: 'image/png', sizes: '310x310', href: '/icons/ms-icon-310x310.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/icons/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/icons/favicon-96x96.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/icons/favicon-16x16.png' }
    ]
  },

  serverMiddleware: [
    '~/api/server'
  ],

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@fortawesome/fontawesome-free/css/all.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/draggable.js', mode: 'client' },
    { src: '~/plugins/vue-countdown.js', mode: 'client' },
    { src: '~/plugins/vue-gtag.js', mode: 'client' },
    { src: '~/plugins/v-ckeditor.js', mode: 'client' },
    { src: '~/plugins/youtube.js', mode: 'client' },
    { src: '~/plugins/highcharts.js', mode: 'client' },
    { src: '~/plugins/vue-fb-customer-chat.js', mode: 'client' },
    { src: '~/plugins/vue-resize-text.js', mode: 'client' },
    { src: '~/plugins/vue-clipboard.js', mode: 'client' },
    '~/plugins/lodash.js',
    '~/plugins/is-email.js',
    '~/plugins/xlsx.js',
    '~/plugins/head-util.js',
    '~/plugins/helpers.js',
    '~/plugins/breadcrumbs.js',
    '~/plugins/notifier.js',
    '~/plugins/overlay.js',
    '~/plugins/lang.js',
    '~/plugins/event-bus.js',
    '~/plugins/v-mask.js',
    '~/plugins/thai-bath-text.js',
    '~/plugins/v-uppercase.js',
    '~/plugins/base64-to-blob.js',
    '~/plugins/datetime-picker.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    ['@nuxtjs/vuetify', { treeShake: true }]
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    // '@nuxtjs/pwa',
    '@nuxtjs/auth-next',
    '@nuxtjs/i18n',
    '@nuxtjs/dayjs',
    '@nuxtjs/robots',
    // '@nuxtjs/sitemap',
    'nuxt-client-init-module',
    'cookie-universal-nuxt',
    'vue-social-sharing/nuxt',
    ['v-currency-field/nuxt-treeshaking', {
      locale: 'th-TH',
      // decimalLength: 2,
      autoDecimalMode: true,
      min: null,
      max: null,
      defaultValue: null,
      valueAsInteger: false,
      allowNegative: true
    }]
  ],
  robots: [
    {
      UserAgent: 'Googlebot',
      Disallow: '/backend'
    },
    {
      UserAgent: '*',
      Disallow: '/backend'
    }
  ],
  // sitemap: {
  //   hostname: process.env.BASE_URL,
  //   gzip: true,
  //   i18n: false,
  //   exclude: [
  //     '/backend',
  //     '/backend/*'
  //   ]
  // },
  auth,
  i18n,

  dayjs: {
    locales: ['en'],
    // locales: ['en', 'th'],
    // defaultLocale: 'th',
    defaultLocale: 'en',
    defaultTimeZone: 'Asia/Bangkok',
    plugins: [
      'utc',
      'timezone',
      'buddhistEra',
      'localeData'
    ]
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    // baseURL: '/'
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  // pwa: {
  //   meta: {
  //     title: process.env.APP_NAME,
  //     author: ''
  //   },
  //   manifest: {
  //     name: process.env.APP_NAME,
  //     short_name: '',
  //     lang: 'th',
  //     display: 'standalone',
  //     background_color: '#eb9421',
  //     theme_color: '#082141',
  //     description: ''
  //   },
  //   workbox: {
  //     enabled: false // process.env.NODE_ENV === 'production'
  //   }
  // },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          themeAccent: '#000063',
          themePrimary: '#0077FF',
          themeInfo: '#01C3FF',
          themeWarning: '#FFA834',
          themeDanger: '#FF0000',
          themeGrey: '#DADADA',
          bgLight: '#F7F7F7',
          white: '#FFFFFF',
          black: '#222222',
          primary: '#9983FD',
          info: '#4A9FF9',
          success: '#2ACA93',
          warning: '#FF9B44',
          error: '#F95387',
          young: '#2aca93'
        },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  env: {
    appName: process.env.APP_NAME || 'ASEAN TALENT',

    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    apiUrl: process.env.API_URL || 'http://localhost:3000',
    apiDirectory: process.env.API_DIR || '/api/',

    metaDefaultLang: process.env.META_DEFAULT_LANG || '',
    metaDefaultTitle: process.env.META_DEFAULT_TITLE || '',
    metaDefaultDescription: process.env.META_DEFAULT_DESCRIPTION || '',
    metaDefaultKeywords: process.env.META_DEFAULT_KEYWORDS || '',
    metaDefaultUrl: process.env.META_DEFAULT_URL || '',
    metaDefaultSiteName: process.env.META_DEFAULT_SITE_NAME || '',
    metaDefaultImage: process.env.META_DEFAULT_IMAGE || '',

    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || '',

    facebookPageId: process.env.FACEBOOK_PAGE_ID || ''
  }
}
