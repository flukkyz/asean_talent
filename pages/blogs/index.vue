<template>
  <div>
    <div class="hero-image" :style="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'height: 270px;' : 'height: 240px;'">
      <v-container :class="['d-flex align-center h-100',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : 'justify-space-between px-16']">
        <h1 :class="['font-weight-bold themeAccent--text',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'headline my-6' : 'display-1']">
          {{ pageName }}
        </h1>
        <img src="/images/graphics/2.png" :height="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 152 : 196">
      </v-container>
    </div>
    <v-container v-if="listDatas" class="py-16" :class="{ 'px-5': ['sm', 'xs'].includes($vuetify.breakpoint.name)}">
      <div :class="['d-flex align-center mb-8',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
        <p class="headline mb-0 themeAccent--text font-weight-bold mr-3 my-1">
          Search
        </p>
        <div :class="['flex-grow-1','xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'mr-3'" style="width: 100%;">
          <v-form @submit.prevent="$fetch()">
            <v-text-field
              v-model="queryParams.q"
              append-icon="mdi-magnify"
              :label="`${$t('SEARCH')} ${pageName}`"
              class="my-1 rounded-lg"
              outlined
              dense
              hide-details
            >
              <template #append>
                <div class="h-100">
                  <v-icon style="cursor: pointer;" @click="$fetch()">
                    mdi-magnify
                  </v-icon>
                </div>
              </template>
            </v-text-field>
          </v-form>
        </div>
        <v-autocomplete
          v-if="blogCategories"
          v-model="queryParams.category"
          :items="blogCategories"
          item-value="id"
          item-text="name"
          outlined
          clearable
          class="my-1 rounded-lg flex-shrink-0"
          :style="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'width: 100%;' : ''"
          hide-details
          label="Category"
          dense
          @change="$fetch()"
        />
      </div>
      <!-- <div class="d-flex align-center mb-5">
        <h1 class="display-1 font-weight-bold black--text">
          {{ pageName }}
        </h1>
        <v-spacer />
        <div class="w-50 ml-5">
          <v-text-field
            v-model="queryParams.q"
            append-icon="mdi-magnify"
            :label="`${$t('SEARCH')} ${pageName}`"
            outlined

            dense
            hide-details
            @input="search"
          />
        </div>
      </div> -->
      <div v-if="listDatas.totalItems > 0">
        <v-row>
          <v-col
            v-for="item in listDatas.rows"
            :key="item.id"
            cols="12"
          >
            <cards-blog
              :item="item"
            />
          </v-col>
        </v-row>
        <div class="my-16">
          <div class="float-right">
            <v-pagination
              v-if="listDatas.totalPages > 1"
              v-model="queryParams.page"
              :length="listDatas.totalPages"
              :total-visible="5"
              @input="pageClick"
            />
          </div>
        </div>
      </div>
      <div v-else class="mt-16 text-center">
        <h1 class="display-3 teal--text">
          No Content
        </h1>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pageName: this.$t('NEWS_AND_ACTIVITIES'),
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      basePath: `${process.env.baseUrl}${this.$route.fullPath}`,
      api: `${process.env.apiUrl}${process.env.apiDirectory}blogs`,
      listDatas: null,
      blogCategories: null,
      queryParams: {
        size: 20,
        q: '',
        page: 1,
        category: null
      }
    }
  },
  async fetch () {
    this.queryParams = {
      ...this.queryParams,
      ...this.$route.query
    }
    if (!this.queryParams.category) {
      this.queryParams.category = ''
    }
    const searchParams = new URLSearchParams(this.queryParams).toString()
    try {
      const datas = await this.$axios.$get(`${this.api}${(searchParams ? '?' + searchParams : '')}`)
      this.listDatas = datas
      if (this.queryParams.page > this.listDatas.totalPages && this.listDatas.totalPages > 0) {
        this.queryParams.page = this.listDatas.totalPages
        this.$fetch()
      }
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
  },
  head () {
    return this.$headUtil({
      lang: this.$lang.getISO,
      title: this.pageName,
      urlPath: this.basePath
    })
  },
  async created () {
    this.$breadcrumbs.clear()
    const blogCategories = await this.$axios.$get(`${this.apiPath}blog-categories`)
    this.blogCategories = blogCategories.rows
  },
  methods: {
    search (q) {
      this.queryParams.page = 1
      this.$fetch()
    },
    pageClick () {
      this.$fetch()
    }
  }
}
</script>
<style lang="scss" scoped>
.hero-image {
  background-image: url("/images/ui/bg-top.png");
  background-color: #cccccc;
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
