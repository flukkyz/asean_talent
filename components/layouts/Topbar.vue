<template>
  <div>
    <div :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'themeAccent' : 'white'">
      <v-container class="">
        <v-app-bar
          color="transparent"
          :dark="['xs', 'sm'].includes($vuetify.breakpoint.name)"
          elevation="0"
          :height="['xs', 'sm'].includes($vuetify.breakpoint.name) ? '50px' : '90px'"
          flat
        >
          <v-app-bar-nav-icon v-if="['xs', 'sm'].includes($vuetify.breakpoint.name)" class="mr-2" @click.stop="toggleDrawer" />
          <NuxtLink :to="localePath({name: 'index'})">
            <v-toolbar-title>
              <div class="d-flex align-center ml-3">
                <img src="/images/logo.png" :height="['xl', 'lg'].includes($vuetify.breakpoint.name) ? '52' : '40'" contain alt="Logo">
                <p class="mb-0 ml-5" :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'white--text' : 'display-1 themeAccent--text'">
                  {{ appName }}
                </p>
              </div>
            </v-toolbar-title>
          </NuxtLink>
          <v-spacer />
          <div v-if="!['xs', 'sm'].includes($vuetify.breakpoint.name) && topbarLogos && topbarLogos.length > 0" class="d-flex align-center">
            <a v-for="item in topbarLogos" :key="`topbar-logo-${item.id}`" :href="item.url" target="_blank">
              <img
                :src="item.Img ? item.Img.url : '/images/icon.png'"
                height="60"
                class="mr-8"
              >
            </a>
          </div>

          <!-- <div v-else-if="$route.name && !['home','asean-talent-pool','young-talent-pool','paring-search'].includes($route.name.slice(0, -5))" style="width: 210px;">
            <v-form @submit.prevent="onSearch">
              <div>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  :placeholder="`Search your Keyword`"
                  hide-details
                  outlined
                  class="rounded-lg"
                  dense
                  @focus="focusSearch = true"
                  @blur="focusSearch = false"
                >
                  <template #append>
                    <div class="h-100">
                      <v-icon style="cursor: pointer;" @click="onSearch">
                        mdi-magnify
                      </v-icon>
                    </div>
                  </template>
                </v-text-field>
              </div>
            </v-form>
          </div> -->
        </v-app-bar>
      </v-container>
    </div>
    <div v-if="['xl', 'lg','md'].includes($vuetify.breakpoint.name)" class="themeAccent">
      <v-container class="">
        <v-app-bar
          color="themeAccent"
          dark
          elevation="0"
          height="40px"
          flat
        >
          <template v-for="(menu,index) in menus">
            <v-menu
              v-if="menu.group"
              :key="`topbar-menu-${index}`"
              dark
              offset-y
              rounded="t-0"
              transition="slide-y-transition"
              :nudge-bottom="['xl', 'lg'].includes($vuetify.breakpoint.name) ? 14 : 18"
              bottom
            >
              <template #activator="{ on, attrs }">
                <v-btn
                  v-if="['xl', 'lg','md'].includes($vuetify.breakpoint.name)"
                  active-class="font-weight-bold"
                  plain
                  v-bind="attrs"
                  :class="{'subtitle-1': ['xl', 'lg'].includes($vuetify.breakpoint.name), 'px-3 mr-1': ['xl'].includes($vuetify.breakpoint.name),
                           'px-2': ['lg'].includes($vuetify.breakpoint.name),
                           'px-1 ': ['md'].includes($vuetify.breakpoint.name)}"
                  :small="['md'].includes($vuetify.breakpoint.name)"
                  v-on="on"
                >
                  {{ menu.group }}
                </v-btn>
              </template>

              <v-list class="py-0" color="themeAccent">
                <v-list-item v-for="(subItem, i) in filterMenu(menu.items)" :key="`${menu.group}-${i}`" :to="localePath({ name: subItem.url })">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ subItem.text }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-btn
              v-else-if="['xl', 'lg','md'].includes($vuetify.breakpoint.name)"
              :key="`topbar-menu-${index}`"
              active-class="font-weight-bold"
              plain
              :class="{'subtitle-1': ['xl', 'lg'].includes($vuetify.breakpoint.name), 'px-3 mr-1': ['xl'].includes($vuetify.breakpoint.name),
                       'px-2': ['lg'].includes($vuetify.breakpoint.name),
                       'px-1 ': ['md'].includes($vuetify.breakpoint.name)}"
              :small="['md'].includes($vuetify.breakpoint.name)"
              :to="localePath({ name: menu.url })"
            >
              {{ menu.text }}
            </v-btn>
          </template>
          <v-spacer />

          <!-- <div v-if="$route.name && !['home','asean-talent-pool','young-talent-pool','paring-search'].includes($route.name.slice(0, -5))" class="mr-3">
            <v-form @submit.prevent="onSearch">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                :placeholder="`Search your Keyword`"
                hide-details
                outlined
                dense
                class="rounded-lg"
                @focus="focusSearch = true"
                @blur="focusSearch = false"
              >
                <template #append>
                  <div class="h-100">
                    <v-icon style="cursor: pointer;" @click="onSearch">
                      mdi-magnify
                    </v-icon>
                  </div>
                </template>
              </v-text-field>
            </v-form>
          </div> -->

          <v-menu
            v-if="$auth.loggedIn && !$auth.user.role"
            offset-y
            bottom
            left
          >
            <template #activator="{ on, attrs }">
              <v-avatar
                v-if="$auth.user.avatar"
                size="25"
                class="ml-3 elevation-1"
                v-bind="attrs"
                v-on="on"
              >
                <v-img :src="$auth.user.avatar" />
              </v-avatar>
              <v-btn
                v-else
                icon
                small
                class="ml-1 elevation-0"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>
                  mdi-account-circle
                </v-icon>
              </v-btn>
            </template>

            <v-list class="py-0">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="title themeAccent--text">
                    <span v-if="$auth.user.member_type === 'researcher'">
                      {{ `${$auth.user.Researcher.firstname} ${$auth.user.Researcher.lastname}` }}
                    </span>
                    <span v-if="$auth.user.member_type === 'organization'">
                      {{ $auth.user.Organization.name }}
                    </span>
                  </v-list-item-title>
                  <v-list-item-subtitle class="grey--text">
                    {{ $_.capitalize($auth.user.member_type) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <template v-for="(item, index) in memberMenus">
                <v-subheader v-if="item.header" :key="`member-menu-header-${index}`">
                  {{ item.header }}
                </v-subheader>
                <v-list-item v-else :key="`member-menu-${index}`" :to="localePath({ name: item.url })">
                  <v-list-item-icon class="mr-2">
                    <v-icon>
                      {{ item.icon }}
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.text }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <v-divider />
              <v-list-item :to="localePath({ name: 'logout' })">
                <v-list-item-icon class="mr-2">
                  <v-icon>
                    mdi-logout
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $t('LOGOUT') }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn
            v-else-if="$auth.loggedIn && $auth.user.role"
            icon
            class="ml-1"
            :to="localePath({ name: 'backend' })"
          >
            <v-icon small>
              fas fa-tasks
            </v-icon>
          </v-btn>
          <div v-else>
            <v-btn
              active-class="font-weight-bold"
              plain
              :class="{ 'px-3 mr-1 subtitle-1': ['xl'].includes($vuetify.breakpoint.name),
                        'px-2 subtitle-1': ['lg'].includes($vuetify.breakpoint.name),
                        'px-1 caption': ['md'].includes($vuetify.breakpoint.name)}"
              :small="['md'].includes($vuetify.breakpoint.name)"
              :to="localePath({ name: 'login' })"
            >
              {{ $t('LOGIN') }}
            </v-btn>
            <v-btn
              active-class="font-weight-bold"
              plain
              :class="{'subtitle-1': ['xl', 'lg'].includes($vuetify.breakpoint.name), 'px-3 mr-1': ['xl'].includes($vuetify.breakpoint.name),
                       'px-2': ['lg'].includes($vuetify.breakpoint.name),
                       'px-1 ': ['md'].includes($vuetify.breakpoint.name)}"
              :small="['md'].includes($vuetify.breakpoint.name)"
              :to="localePath({ name: 'register' })"
            >
              {{ $t('REGISTER') }}
            </v-btn>
          </div>
        </v-app-bar>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      appName: process.env.appName,
      search: '',
      focusSearch: false
    }
  },
  computed: {
    menus () {
      return this.filterMenu(this.$store.state.frontend)
    },
    setting () {
      return this.$store.state.setting
    },
    topbarLogos () {
      return this.$store.state.topbarLogos
    },
    memberMenus () {
      return this.filterMenu(this.$store.state.member)
    }
  },
  methods: {
    toggleDrawer () {
      this.$store.commit('setDrawer', !this.$store.state.drawer)
    },
    onSearch () {
      this.$router.push(this.localePath({ name: 'asean-talent-pool', query: { q: this.search } }))
    },
    filterMenu (item) {
      return item.filter(ele => !ele.active || (ele.active && this.setting[ele.active]))
    }
  }
}
</script>
