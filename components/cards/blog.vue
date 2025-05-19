<template>
  <v-hover v-slot="{ hover }">
    <v-card
      class="rounded-lg mx-auto overflow-hidden"
      :elevation="hover ? 5 : 2"
    >
      <v-card-text class=" d-flex align-stretch">
        <v-img
          :src="item.Img ? item.Img.url : '/images/icon.png'"
          max-height="250px"
          max-width="250px"
          :alt="item.title"
          class="flex-shrink-0 mr-5"
          contain
        />
        <div class="d-flex flex-column justify-space-between flex-grow-1">
          <div class="">
            <nuxt-link :to="localePath({ name: 'blogs-slug', params: { slug: item.slug }})">
              <p :class="['title font-weight-bold themeAccent--text mb-1']">
                {{ item.title }}
              </p>
            </nuxt-link>
            <div v-if="item.tags" class="d-flex flex-wrap mt-1">
              <v-icon color="themeAccent" left>
                fas fa-tags
              </v-icon>
              <v-chip
                v-for="(val, index) in item.tags.split('; ')"
                :key="`tags-${index}`"
                small
                class="ma-1"
                dark
                color="themeAccent"
                :to="localePath({ name: 'blogs', query: { q: val }})"
              >
                {{ val }}
              </v-chip>
            </div>
            <div class="d-flex align-center">
              <v-icon x-small left>
                fas fa-calendar-plus
              </v-icon>
              <p class="teal--text caption px-5 px-md-0 mb-0">
                {{ $dateText(item.createdAt,'medium','short') }}
              </p>
            </div>
            <nuxt-link :to="localePath({ name: 'blogs-slug', params: { slug: item.slug }})">
              <div class="caption overflow-hidden" style="height: 72px;">
                <p class="grey--text mb-0">
                  {{ $removeHtml(item.content) }}
                </p>
              </div>
            </nuxt-link>
          </div>
          <div class="d-flex justify-end mt-3">
            <social-share
              :path="localePath({ name: 'blogs-slug', params: { slug: item.slug }})"
              :title="item.title"
              :content="item.content"
              :tag="item.tags ? item.tags.split('; ').join(',') : ''"
            />
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script>
import SocialShare from '../SocialShare.vue'
export default {
  components: { SocialShare },
  props: {
    item: {
      type: Object,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
.bg-blog-title{
  background-color: #ffffff81;
}
</style>
