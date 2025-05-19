<template>
  <div>
    <div class="hero-image" :style="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'height: 270px;' : 'height: 240px;'">
      <v-container :class="['d-flex align-center h-100',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : 'justify-space-between px-16']">
        <h1 :class="['font-weight-bold themeAccent--text',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'headline my-6' : 'display-1']">
          {{ pageName }}
        </h1>
        <img src="/images/about.png" :height="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 152 : 196">
      </v-container>
    </div>
    <v-container v-if="listDatas" class="py-16" :class="{ 'px-5': ['sm', 'xs'].includes($vuetify.breakpoint.name)}">
      <h2 class="themeAccent--text">
        Discussion Forum Overview
      </h2>
      <p>
        Welcome to our Research Discussion Forum! This platform is dedicated to everyone passionate about research and academic inquiry. Whether you're a seasoned researcher, a student embarking on your thesis, or simply someone with a keen interest in exploring new knowledge, this forum is the perfect place for you.
        Here, you can post your research-related questions, share insights, discuss methodologies, and exchange ideas with a community of like-minded individuals. Our forum aims to foster a collaborative environment where members can learn from each other, offer support, and engage in constructive discussions.
      </p>
      <p>
        We encourage you to dive into ongoing conversations or start new threads on topics that intrigue you. Share your experiences, ask for feedback on your work, or provide guidance to others on their research journey. Together, we can build a thriving community of researchers, united by our shared love for knowledge and discovery.
        Please remember to adhere to our community guidelines, respect diverse perspectives, and maintain a supportive and positive atmosphere. Let's make this forum a valuable resource for everyone involved in the fascinating world of research!
      </p>
      <div v-if="listDatas.totalItems > 0 && !queryParams.q" :class="['d-flex align-center mb-8',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : 'justify-space-between']">
        <div :class="['d-flex align-center',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
          <div class="d-flex justify-space-between align-end">
            <p class="headline mb-0 themeAccent--text font-weight-bold mr-3 my-1">
              Search
            </p>
            <v-btn
              v-if="['xs', 'sm'].includes($vuetify.breakpoint.name) && $auth.loggedIn && !$auth.user.role"
              small
              class="rounded-lg white--text mb-2"
              color="themeAccent"
              :to="localePath({ name: 'forums-form' })"
            >
              <v-icon small left>
                mdi-forum-plus
              </v-icon>
              Create New Forum
            </v-btn>
          </div>
          <div :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'mr-3'" :style="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'width: 100%;' : 'width: 380px;'">
            <v-form @submit.prevent="search">
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
                    <v-icon style="cursor: pointer;" @click="search">
                      mdi-magnify
                    </v-icon>
                  </div>
                </template>
              </v-text-field>
            </v-form>
          </div>
        </div>
        <v-btn
          large
          class="rounded-lg white--text"
          color="themeAccent"
          @click="createForum"
        >
          <v-icon small left>
            mdi-forum-plus
          </v-icon>
          Create New Topic
        </v-btn>
      </div>
      <div v-if="listDatas.totalItems > 0">
        <v-card class="shadow rounded-lg overflow-hidden">
          <v-list two-line class="py-0">
            <template v-for="(item,index) in listDatas.rows">
              <v-list-item :key="`forum-${index}`">
                <v-list-item-content>
                  <v-list-item-title>
                    <nuxt-link :to="localePath({ name: 'forums-slug', params: { slug: item.slug } })">
                      <span class="title themeAccent--text">
                        {{ item.title }}
                      </span>
                    </nuxt-link>
                    <span v-if="item.edited" class="grey--text">
                      [Edit]
                    </span>
                  </v-list-item-title>

                  <v-list-item-subtitle class="mt-1 caption">
                    {{ $dateText(item.createdAt,'medium','short') }}
                    by
                    <span class="font-weight-bold">
                      {{ item.Member.member_type === 'researcher' ? `${item.Member.Researcher.lastname}, ${item.Member.Researcher.firstname}` : item.Member.Organization.name }}
                    </span>
                    <span v-if="item.tags">
                      <v-icon right color="themePrimary" small>
                        fas fa-tags
                      </v-icon>
                      <v-chip
                        v-for="(val, index2) in item.tags.split('; ')"
                        :key="`forum-${item.id}-tags-${index2}`"
                        x-small
                        class="mr-1 py-0"
                        dark
                        color="themePrimary"
                        @click="searchTag(val)"
                      >
                        {{ val }}
                      </v-chip>
                    </span>
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <p class="mb-0 caption">
                    {{ $abbreviateNumber(item.count_comments) }}
                    {{ item.count_comments > 1 ? 'Comments' : 'Comment' }}
                  </p>
                  <p class="mb-0 caption">
                    {{ $abbreviateNumber(item.hit) }}
                    {{ item.hit > 1 ? 'Views' : 'View' }}
                  </p>
                </v-list-item-action>
              </v-list-item>

              <v-divider
                v-if="index < listDatas.rows.length - 1"
                :key="`forum-divider-${index}`"
              />
            </template>
          </v-list>
        </v-card>
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
      <div v-else-if="!queryParams.q" class="mt-16 text-center">
        <v-btn
          x-large
          block
          height="80px"
          class="rounded-lg white--text headline"
          color="themeAccent"
          @click="createForum"
        >
          <v-icon large class="mr-3">
            mdi-forum-plus
          </v-icon>
          Create New Topic
        </v-btn>
      </div>
      <div v-else class="mt-16 text-center">
        <h1 class="display-3 teal--text">
          No Topic
        </h1>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pageName: 'Forums',
      basePath: `${process.env.baseUrl}${this.$route.fullPath}`,
      api: `${process.env.apiUrl}${process.env.apiDirectory}forums`,
      listDatas: null,
      queryParams: {
        size: 20,
        q: '',
        page: 1
      }
    }
  },
  async fetch () {
    this.queryParams = {
      ...this.queryParams,
      ...this.$route.query
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
  beforeMount () {
    if (!this.$store.state.setting.show_menu_resourse_forum) {
      this.$nuxt.error({ statusCode: 404, message: 'Not Found This Page' })
    }
  },
  created () {
    this.$breadcrumbs.clear()
  },
  methods: {
    searchTag (val) {
      this.queryParams.q = val
      this.search()
    },
    search (q) {
      this.queryParams.page = 1
      this.$fetch()
    },
    pageClick () {
      this.$fetch()
    },
    createForum () {
      if (!this.$auth.loggedIn) {
        this.$notifier.showMessage({ title: 'Member only', content: 'Please, sign in for Create New Topic', color: 'info' })
      }
      this.$router.push(this.localePath({ name: 'forums-form' }))
    }
  }
}
</script>
<style lang="scss" scoped>
.hero-image {
  background-image: url("/images/bg-top.png");
  background-color: #cccccc;
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
