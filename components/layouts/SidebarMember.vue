<template>
  <div v-if="$auth.loggedIn && !$auth.user.role">
    <v-navigation-drawer
      width="350"
      color="#000043"
      dark
      class="elevation-3"
      app
      permanent
      :mini-variant="mini && mobileScale"
    >
      <div class="d-flex align-center justify-space-between py-3">
        <nuxt-link v-if="!mini || !mobileScale" :to="localePath({ name: 'index'})">
          <div class="d-flex align-center py-5">
            <img
              src="/images/icon.png"
              height="50"
              class="ml-5"
            >
            <p class="ml-4 title mb-0 white--text">
              {{ appName }}
            </p>
          </div>
        </nuxt-link>
        <v-btn
          v-if="mobileScale"
          fab
          small
          elevation="0"
          text
          color="white"
          :class="mini ? 'mx-auto' : 'mr-5'"
        >
          <v-icon small @click="mini = !mini">
            {{ mini ? 'mdi-menu' : 'mdi-arrow-left' }}
          </v-icon>
        </v-btn>
      </div>
      <v-divider :class="fullSidebar ? 'mx-5' : 'py-0'" />

      <v-list :class="fullSidebar ? 'mx-5' : 'py-0'">
        <template v-for="(item, index) in menus">
          <v-subheader
            v-if="item.header"
            :key="`${item.header}-${index}`"
            class=" font-weight-bold"
            :class="fullSidebar ? 'px-0' : 'px-1 caption text-truncate'"
          >
            {{ item.header }}
          </v-subheader>

          <v-list-group
            v-else-if="item.group"
            :key="`${item.group}-${index}`"
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
                v-if="!subItem.roles || (subItem.roles && subItem.roles.includes($auth.user.role))"
                :key="`${item.group}-${i}`"
                class="py-0"
                :class="!mini || !mobileScale ? 'rounded-lg' : ''"
                link
                exact
                :to="localePath(subItem.url)"
              >
                <v-list-item-title class="py-0 caption" :class="fullSidebar ? '' : 'very-small'">
                  {{ subItem.text }}
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-list-group>

          <v-list-item
            v-else-if="!item.roles || (item.roles && item.roles.includes($auth.user.role))"
            :key="`${item.text}-${index}`"
            router
            :class="!mini || !mobileScale ? 'rounded-lg overflow-hidden' : ''"
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
        <v-list :class="fullSidebar ? 'mx-5 pb-3' : 'py-0'">
          <v-list-item v-if="fullSidebar" class="info-card rounded-lg">
            <v-list-item-avatar>
              <v-avatar
                v-if="$auth.user.avatar"
                size="40"
              >
                <v-img :src="$auth.user.avatar" />
              </v-avatar>
              <v-icon v-else size="40">
                fas fa-user-circle
              </v-icon>
            </v-list-item-avatar>

            <v-list-item-content v-if="!mini || !mobileScale">
              <v-list-item-title class="title white--text mb-1">
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

          <v-divider v-if="fullSidebar" class="my-5" />

          <v-list-item
            router
            :class="!mini || !mobileScale ? 'rounded-lg overflow-hidden' : ''"
            exact
            :to="localePath({ name: 'logout'})"
          >
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="body-2">
              {{ $t('LOGOUT') }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      appName: process.env.appName,
      mini: false
    }
  },
  computed: {
    mobileScale () {
      return ['md', 'sm', 'xs'].includes(this.$vuetify.breakpoint.name)
    },
    fullSidebar () {
      return !this.mini || !this.mobileScale
    },
    menus () {
      return this.filterMenu(this.$store.state.member)
    },
    setting () {
      return this.$store.state.setting
    }
  },
  created () {
    this.mini = this.mobileScale
  },
  methods: {
    filterMenu (item) {
      return item.filter(ele => !ele.active || (ele.active && this.setting[ele.active]))
    }
  }
}
</script>

<style lang="scss" scoped>
.v-list > .v-subheader{
  color: #8080B1;
}
.v-list.mx-5 > .v-list-item{
  margin-top: 5px;
}
.v-list.mx-5 > .v-list-group{
  margin-top: 5px;
}
.v-list .v-list-group__items > .v-list-item{
  min-height: 40px;
}
.v-list.mx-5 .v-list-group__items > .v-list-item{
  padding-left: 40px !important;
  margin-left: 30px;
  margin-right: -10px;
}

.v-list .v-list-group.v-list-group--active{
  background-color: #DADADA;
}
.v-list.mx-5 .v-list-group.v-list-group--active{
  padding-bottom: 15px;
}

.v-list-item, .v-list-item .v-icon, .v-list-group .v-list-item__content, .v-list-group__header .v-icon{
  color: #8080B1 !important;
}
.v-list-group--active .v-list-item__content, .v-list-group--active .v-list-item__icon .v-icon{
  color: #8080B1 !important;
}
.v-list-item--active{
  background-color: #000063 !important;
  color: #fff !important;
}
.v-list-item--active .v-icon{
  color: #fff !important;
}
.info-card{
  background-color: #000064;
}
</style>
