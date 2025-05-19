<template>
  <div v-if="breadcrumbsItems.length > 0" class="mb-n8">
    <client-only>
      <v-container class="py-1" :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'px-12'">
        <v-breadcrumbs class="pa-0" :items="breadcrumbsItems">
          <template #divider>
            <v-icon color="grey">
              mdi-menu-right
            </v-icon>
          </template>
          <template #item="{ item }">
            <v-breadcrumbs-item :disabled="!item.to">
              <nuxt-link v-if="item.to" class="grey--text" :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'caption' : ''" :to="localePath(item.to)">
                {{ item.text.substring(0, 30) }}
              </nuxt-link>
              <span v-else class="grey--text font-weight-bold" :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'caption' : ''" v-text="item.text.substring(0, 30)" />
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </v-container>
    </client-only>
  </div>
</template>

<script>
export default {
  computed: {
    breadcrumbsItems () {
      return this.$store.state.breadcrumbs && this.$store.state.breadcrumbs.breadcrumbsItems ? this.$store.state.breadcrumbs.breadcrumbsItems : []
    }
  }
}
</script>
