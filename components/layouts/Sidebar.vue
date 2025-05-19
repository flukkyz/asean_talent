<template>
  <div v-if="['xs', 'sm'].includes($vuetify.breakpoint.name)">
    <v-navigation-drawer
      v-model="drawer"
      width="350"
      class="elevation-1"
      color="#0077FF"
      bottom
      overlay-opacity="0"
      dark
      app
    >
      <nuxt-link :to="localePath({name: 'index'})">
        <div class="mt-8 mb-5 mx-10">
          <v-img src="/images/logo.png" contain width="162" height="100" class="mx-auto" />
        </div>
      </nuxt-link>

      <v-list class="mx-10">
        <template v-for="(item, index) in menus">
          <v-subheader
            v-if="item.header"
            :key="`${item.header}-${index}`"
            class=" font-weight-bold"
          >
            {{ item.header }}
          </v-subheader>

          <v-divider
            v-else-if="item.divider"
            :key="index"
            :inset="item.inset"
          />

          <v-list-group
            v-else-if="item.group"
            :key="`${item.group}-${index}`"
            active-class="white--text"
            :value="$route.name && filterMenu(item.items).map(ele => ele.url).includes($route.name.replaceAll(/-id|-form/gi,'').slice(0, -5))"
            :prepend-icon="item.icon"
          >
            <template #activator>
              <v-list-item-content>
                <v-list-item-title class="body-2">
                  {{ item.group }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <template #prependIcon>
              <v-icon>{{ item.icon }}</v-icon>
            </template>

            <template v-for="(subItem, i) in filterMenu(item.items)">
              <v-list-item
                :key="`${item.group}-${i}`"
                class="py-0 pl-16 ml-3"
                active-class="white--text"
                router
                exact
                :to="localePath(subItem.url)"
              >
                <v-list-item-title class="py-0 caption">
                  {{ subItem.text }}
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-list-group>

          <v-list-item
            v-else
            :key="`${item.text}-${index}`"
            router
            exact
            :to="localePath(item.url)"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="body-2">
              {{ item.text }}
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
      <template #append>
        <v-list v-if="$auth.loggedIn && !$auth.user.role" class="mx-10">
          <v-list-item :to="localePath({ name: 'my-profile'})">
            <v-list-item-icon>
              <v-avatar
                v-if="$auth.user.avatar"
                size="50"
                class="ml-0 elevation-1"
              >
                <v-img :src="$auth.user.avatar" />
              </v-avatar>
              <v-icon v-else large>
                fas fa-user-circle
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="title">
                <span v-if="$auth.user.member_type === 'researcher'">
                  {{ `${$auth.user.Researcher.firstname} ${$auth.user.Researcher.lastname}` }}
                </span>
                <span v-if="$auth.user.member_type === 'organization'">
                  {{ $auth.user.Organization.name }}
                </span>
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ $_.capitalize($auth.user.member_type) }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list v-else-if="$auth.loggedIn && $auth.user.role" class="mx-10">
          <v-list-item
            router
            exact
            :to="localePath({ name: 'backend'})"
          >
            <v-list-item-icon>
              <v-icon>fas fa-tasks</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Go to  Backend</v-list-item-title>
          </v-list-item>
        </v-list>
        <v-list v-else class="mx-10">
          <v-list-item
            router
            exact
            :to="localePath({ name: 'login'})"
          >
            <v-list-item-icon>
              <v-icon>fas fa-sign-in</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ $t('LOGIN') }}</v-list-item-title>
          </v-list-item>
          <v-list-item
            router
            exact
            :to="localePath({ name: 'register'})"
          >
            <v-list-item-icon>
              <v-icon>fas fa-user-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ $t('REGISTER') }}</v-list-item-title>
          </v-list-item>
        </v-list>
        <v-btn
          v-if="$auth.loggedIn"
          class="rounded-0"
          color="themeAccent"
          large
          block
          :to="localePath({ name: 'logout'})"
        >
          {{ $t('LOGOUT') }}
        </v-btn>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  computed: {
    drawer: {
      get () {
        return this.$store.state.drawer
      },
      set (val) {
        this.$store.commit('setDrawer', val)
      }
    },
    setting () {
      return this.$store.state.setting
    },
    menus () {
      return this.filterMenu(this.$store.state.frontend)
    }
  },
  methods: {
    filterMenu (item) {
      return item.filter(ele => !ele.active || (ele.active && this.setting[ele.active]))
    }
  }
}
</script>
