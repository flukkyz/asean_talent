<template>
  <v-app dark>
    <client-only>
      <layouts-sidebar />
      <layouts-topbar />
    </client-only>
    <v-main>
      <client-only>
        <breadcrumbs />
      </client-only>
      <nuxt />
    </v-main>
    <client-only>
      <snackbar />
      <overlay />
      <b-t-t v-if="!$vuetify.breakpoint.mobile" />
      <layouts-footer />

      <v-dialog
        v-if="setting && setting.popup_content && !pdpaDialog"
        v-model="dialogPopup"
        persistent
        scrollable
        :retain-focus="false"
        max-width="1000"
      >
        <v-card class="rounded-0">
          <v-toolbar
            elevation="0"
            flat
          >
            <img :src="setting.logo_url" width="40">
            <v-spacer />
            <v-btn
              v-if="setting && setting.popup_close"
              class="bgLight rounded-0"
              small
              text
              @click="dialogPopup = false"
            >
              {{ $t('CLOSE') }}
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <client-only placeholder="Loading...">
              <div class="ck-content" v-html="setting.popup_content" />
            </client-only>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-bottom-sheet
        v-if="firstLoad && setting"
        v-model="pdpaDialog"
        persistent
      >
        <v-sheet>
          <div class="pa-5">
            <v-container class="">
              <div class="ck-content" v-html="setting.pdpa" />
              <div class="text-center">
                <v-btn
                  class="mt-2 rounded-0"
                  outlined
                  color="success"
                  @click="acceptPDPA"
                >
                  {{ $t('ACCEPT') }}
                </v-btn>
              </div>
            </v-container>
          </div>
        </v-sheet>
      </v-bottom-sheet>
    </client-only>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      popup: null,
      dialogPopup: false,
      pdpaDialog: false
    }
  },
  computed: {
    firstLoad () {
      return this.$store.state.firstLoad
    },
    setting () {
      return this.$store.state.setting
    }
  },
  created () {
    const pdpa = this.$cookies.get('pdpa')
    if ((!pdpa || (pdpa && pdpa !== 'accept')) && this.setting && this.setting.pdpa) {
      this.pdpaDialog = true
    }
    if (process.client) {
      this.dialogPopup = this.setting.popup_show
    }
  },
  methods: {
    acceptPDPA () {
      this.$cookies.set('pdpa', 'accept', {
        path: '/',
        maxAge: 60 * 60 * 24 * 365
      })
      this.pdpaDialog = false
    }
  }
}
</script>

<style lang="scss">
  .container {
     /* Set the max-width for md breakpoint */
    @media (min-width: 1900px) {
      max-width: 1280px; /* Adjust the value according to your needs */
    }
  }
  img {
    max-width: 100%;
  }
  .text-field-right{
    .v-text-field__slot{
    input{
      text-align: right !important;
    }
    }
  }
  .pointer {
    cursor: pointer;
  }
  .move{
    cursor: move;
  }
  .on-center{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .bg-blur{
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
    background-color: #FFFFFF44;
  }
  .w-100{
    width: 100%;
  }
  .w-90{
    width: 90%;
  }
  .w-80{
    width: 80%;
  }
  .w-75{
    width: 75%;
  }
  .w-70{
    width: 70%;
  }
  .w-60{
    width: 60%;
  }
  .w-50{
    width: 50%;
  }
  .w-40{
    width: 40%;
  }
  .w-30{
    width: 30%;
  }
  .w-25{
    width: 25%;
  }
  .w-20{
    width: 20%;
  }
  .w-10{
    width: 10%;
  }
  .h-100{
    height: 100%;
  }
  .h-75{
    height: 75%;
  }
  .h-50{
    height: 50%;
  }
  .h-25{
    height: 25%;
  }
  a:hover,
  a:visited,
  a:link,
  a:active {
      text-decoration: none;
  }
  .top-items{
    align-items: flex-start;
  }
  .center-items{
    align-items: center;
  }
  .bottom-items{
    align-items: flex-end;
  }
  .small{
    font-size: 0.7rem !important;
  }
  .very-small{
    font-size: 0.6rem !important;
  }
  .translucent{
    background-color: rgba(255, 255, 255, 0.1);
  }
  .no-bullets {
    list-style-type: none;
  }
  .border-bold {
    border-top: 2px solid #ccc !important;
    border-bottom: 2px solid #ccc !important;
    border-left: 2px solid #ccc !important;
    border-right: 2px solid #ccc !important;
  }
  .border-bold-x {
    border-left: 2px solid #ccc !important;
    border-right: 2px solid #ccc !important;
  }
  .border-bold-y {
    border-top: 2px solid #ccc !important;
    border-bottom: 2px solid #ccc !important;
  }
  .border-bold-right {
    border-right: 2px solid #ccc !important;
  }
  .border-bold-left {
    border-left: 2px solid #ccc !important;
  }
  .border-bold-top {
    border-top: 2px solid #ccc !important;
  }
  .border-bold-bottom {
    border-bottom: 2px solid #ccc !important;
  }
  .border-normal {
    border-top: 1px solid #ccc !important;
    border-bottom: 1px solid #ccc !important;
    border-left: 1px solid #ccc !important;
    border-right: 1px solid #ccc !important;
  }
  .border-normal-x {
    border-left: 1px solid #ccc !important;
    border-right: 1px solid #ccc !important;
  }
  .border-normal-y {
    border-top: 1px solid #ccc !important;
    border-bottom: 1px solid #ccc !important;
  }
  .border-normal-right {
    border-right: 1px solid #ccc !important;
  }
  .border-normal-left {
    border-left: 1px solid #ccc !important;
  }
  .border-normal-top {
    border-top: 1px solid #ccc !important;
  }
  .border-normal-bottom {
    border-bottom: 1px solid #ccc !important;
  }

  :root {
    --ck-image-style-spacing: 1.5em;
  }

  .ck-content {

  overflow: auto;
  & .image {
    margin: 0.2em auto !important;
  }

  & .image-style-side {
    float: right;
    margin-left: var(--ck-image-style-spacing);
  }

  & .image-style-align-left {
    float: left;
    margin-right: var(--ck-image-style-spacing);
  }

  & .image-style-align-center {
    margin-left: auto;
    margin-right: auto;
  }

  & .image-style-align-right {
    float: right;
    margin-left: var(--ck-image-style-spacing);
  }
}

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] {
    -moz-appearance: textfield;
  }

  .border-light{
    border: solid 2px #eee !important;
  }
  .border-dark{
    border: solid 2px #111 !important;
  }

  .font-Bebas{
    font-family: "Bebas";
  }
  .font-Bignord{
    font-family: "Bignord";
  }
  .font-Helvethaica{
    font-family: "Helvethaica";
  }
  .font-JumPar{
    font-family: "JumPar";
  }
  .font-WiSaKa{
    font-family: "WiSaKa";
  }
  .font-Butterfly{
    font-family: "Butterfly";
  }
  .font-Samson{
    font-family: "Samson";
  }

.relative{
  position: relative;
}
.absolute{
  position: absolute;
}
.shadow{
    box-shadow: 2px 3px 10px #e9e9e9 !important;
}
.wrap-word {
  white-space: normal;      /* allows wrapping */
  overflow-wrap: break-word; /* break long words if needed */
  word-wrap: break-word;     /* legacy support for older browsers */
  word-break: normal;        /* ensure words aren't broken arbitrarily */
}
</style>
