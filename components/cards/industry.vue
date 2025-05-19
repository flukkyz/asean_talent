<template>
  <v-card elevation="0" class="mx-auto rounded-lg" color="white">
    <v-img
      :src="`/images/industries/imgs/${item.name}.jpg`"
      :aspect-ratio="2/1"
    />
    <div class="align-center d-flex ml-3">
      <v-img :src="`/images/industries/icons/${item.name}.png`" max-width="35" height="35" contain class="mr-1" />
      <v-card-title class="align-center black--text font-weight-bold d-flex">
        {{ item.name }}
      </v-card-title>
    </div>
    <div class="d-flex align-baseline ml-4">
      <v-icon color="primary" class="mr-5">
        fas fa-users
      </v-icon>
      <p class="body-1">
        {{ $currencyText(item.count_talent) }}
        Talents
      </p>
    </div>
    <v-card-actions class="overflow-hidden justify-center d-flex" style="height: 300px;">
      <div class="d-flex flex-wrap" style="min-width: 800px;">
        <v-hover
          v-for="keyword in item.keywords"
          :key="`domain-industry-${item.id}-keyword-${keyword.id}`"
          v-slot="{ hover }"
        >
          <v-chip
            :color="keyword.color"
            :style="`font-size: ${90+ (keyword.IndustryKeywords[0].weight/4.5)}%`"
            class="ma-1"
            :class="{'font-weight-medium elevation-5': hover}"
            label
            :to="localePath({ name: 'asean-talent-pool-slug-key', params: { slug: item.name, key: keyword.keyword } })"
          >
            {{ keyword.keyword }}
          </v-chip>
        </v-hover>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: null
    }
  }
}
</script>
