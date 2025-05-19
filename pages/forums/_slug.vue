<template>
  <div>
    <v-container v-if="forum" class="py-16">
      <v-row justify="center">
        <v-col cols="12" lg="10">
          <h2 class="display-1 mb-0 mt-2 text-center themeAccent--text">
            {{ forum.title }}
            <span v-if="forum.edited" class="grey--text body-1">
              [Edit]
            </span>
          </h2>
          <div v-if="forum.tags" class="d-flex justify-center flex-wrap mt-1">
            <v-icon color="themeAccent" left>
              fas fa-tags
            </v-icon>
            <v-chip
              v-for="(val, index) in forum.tags.split('; ')"
              :key="`tags-${index}`"
              small
              class="ma-1"
              dark
              color="themeAccent"
              :to="localePath({ name: 'forums', query: { q: val }})"
            >
              {{ val }}
            </v-chip>
          </div>
          <div class="text-center my-5">
            <img
              v-if="forum.Img"
              :src="forum.Img.url"
              :alt="forum.title"
              class="text-center"
            >
          </div>
          <div class="px-5 px-md-0">
            <div class="ck-content" v-html="forum.content" />
          </div>
          <div class="d-flex align-center justify-space-between">
            <p class="teal--text caption px-5 px-md-0 mb-0">
              {{ $dateText(forum.createdAt,'medium','short') }}
              by
              <span class="font-weight-bold">
                {{ forum.Member.member_type === 'researcher' ? `${forum.Member.Researcher.lastname}, ${forum.Member.Researcher.firstname}` : forum.Member.Organization.name }}
              </span>
            </p>

            <v-menu v-if="$auth.loggedIn && ((!$auth.user.role && $auth.user.id === forum.member_id) || ($auth.user.role && ['admin'].includes($auth.user.role)))" top left offset-x nudge-left="5">
              <template #activator="{ on, attrs }">
                <v-btn
                  icon
                  x-small
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon small>
                    mdi-dots-vertical
                  </v-icon>
                </v-btn>
              </template>

              <v-list nav dense>
                <v-list-item-group
                  dense
                  color="primary"
                >
                  <v-list-item v-if="$auth.user.id === forum.member_id" color="warning" dense :to="localePath({ name: 'forums-form-slug', params: { slug: forum.slug }})">
                    <v-list-item-icon class="mr-1">
                      <v-icon small color="warning">
                        fas fa-edit
                      </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Edit Forum</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item v-if="$auth.user.id === forum.member_id || ($auth.user.role && ['admin'].includes($auth.user.role))" dense @click="$bus.$emit('open-delete-dialog-forum', forum.id, forum.title)">
                    <v-list-item-icon class="mr-1">
                      <v-icon small color="error">
                        fas fa-trash
                      </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Delete Forum</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </div>
          <div v-if="comments">
            <v-divider class="my-5" />
            <h3 class="themeAccent--text mb-3">
              {{ $currencyText(comments.totalItems) }}
              {{ comments.totalItems > 1 ? 'Comments' : 'Comment' }}
            </h3>
            <div v-if="comments.totalItems > 0">
              <v-card class="shadow rounded-lg overflow-hidden">
                <v-list two-line class="py-0">
                  <template v-for="(item,index) in comments.rows">
                    <v-list-item :id="`comment-${item.id}`" :key="item.id">
                      <v-list-item-content>
                        <div class="d-flex align-start">
                          <p class="font-weight-bold themePrimary--text mt-2 mr-2 mb-0">
                            #{{ ((queryParams.page-1)*queryParams.size)+(index+1) }}
                          </p>
                          <div class="flex-grow-1">
                            <div class="grey lighten-4 pl-3 pr-2 py-2 rounded-lg">
                              <forms-comment
                                :forum="forum"
                                :value="item.id.toString()"
                                :hide-form="!item.onEdit"
                                small-submit
                                @edit="editComment"
                              >
                                <v-btn
                                  small
                                  outlined
                                  class="rounded-lg mr-3"
                                  color="grey"
                                  @click="item.onEdit = false"
                                >
                                  Close
                                </v-btn>
                              </forms-comment>
                              <div v-if="item.deleted" class="error--text font-weight-bold px-3 py-3">
                                This comment has been deleted
                              </div>
                              <div v-else-if="!item.onEdit">
                                <div class="ck-content" v-html="item.comment" />
                                <div class="d-flex align-center justify-space-between">
                                  <p class="mb-0 caption">
                                    {{ $dateText(item.createdAt,'medium','short') }}
                                    by
                                    <span class="font-weight-bold">
                                      {{ item.Member.member_type === 'researcher' ? `${item.Member.Researcher.lastname}, ${item.Member.Researcher.firstname}` : item.Member.Organization.name }}
                                    </span>
                                    <span v-if="item.edited" class="grey--text">
                                      [Edit]
                                    </span>
                                  </p>
                                  <div class="">
                                    <v-btn
                                      v-if="$auth.loggedIn && !$auth.user.role"
                                      x-small
                                      text
                                      class="rounded-lg ml-2"
                                      color="accent"
                                      @click="onReplyComment(item)"
                                    >
                                      <v-icon small class="mr-1">
                                        mdi-reply
                                      </v-icon>
                                      Reply
                                    </v-btn>

                                    <v-menu v-if="$auth.loggedIn && (!$auth.user.role && [item.member_id,forum.member_id].includes($auth.user.id) || ($auth.user.role && ['admin'].includes($auth.user.role)))" top left offset-x nudge-left="5">
                                      <template #activator="{ on, attrs }">
                                        <v-btn
                                          icon
                                          x-small
                                          v-bind="attrs"
                                          v-on="on"
                                        >
                                          <v-icon small>
                                            mdi-dots-vertical
                                          </v-icon>
                                        </v-btn>
                                      </template>

                                      <v-list nav dense>
                                        <v-list-item-group
                                          dense
                                          color="primary"
                                        >
                                          <v-list-item v-if="$auth.user.id === item.member_id" color="warning" dense @click="onEditComment(item)">
                                            <v-list-item-icon class="mr-1">
                                              <v-icon small color="warning">
                                                fas fa-edit
                                              </v-icon>
                                            </v-list-item-icon>
                                            <v-list-item-content>
                                              <v-list-item-title>Edit Comment</v-list-item-title>
                                            </v-list-item-content>
                                          </v-list-item>
                                          <v-list-item v-if="[item.member_id,forum.member_id].includes($auth.user.id) || ($auth.user.role && ['admin'].includes($auth.user.role))" dense @click="$bus.$emit('open-delete-dialog-comment', item.id, `comment #${((queryParams.page-1)*queryParams.size)+(index+1)}`)">
                                            <v-list-item-icon class="mr-1">
                                              <v-icon small color="error">
                                                fas fa-trash
                                              </v-icon>
                                            </v-list-item-icon>
                                            <v-list-item-content>
                                              <v-list-item-title>Delete Comment</v-list-item-title>
                                            </v-list-item-content>
                                          </v-list-item>
                                        </v-list-item-group>
                                      </v-list>
                                    </v-menu>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div v-if="item.Comments.length > 0 && !item.deleted" class="d-flex align-start">
                              <div class="d-flex flex-column align-center">
                                <v-icon color="grey" large left right>
                                  mdi-arrow-up-left-bold
                                </v-icon>
                                <span class="caption grey--text mt-n1">
                                  Reply
                                </span>
                              </div>
                              <div class="flex-grow-1">
                                <div v-for="comment in item.Comments" :id="`comment-${comment.id}`" :key="comment.id" class="grey lighten-4 pl-3 pr-2 py-2 rounded-lg mt-2">
                                  <forms-comment
                                    :forum="forum"
                                    :value="comment.id.toString()"
                                    :hide-form="!comment.onEdit"
                                    small-submit
                                    @edit="editComment"
                                  >
                                    <v-btn
                                      small
                                      outlined
                                      class="rounded-lg mr-3"
                                      color="grey"
                                      @click="comment.onEdit = false"
                                    >
                                      Close
                                    </v-btn>
                                  </forms-comment>
                                  <div v-if="comment.deleted" class="error--text font-weight-bold px-3 py-2">
                                    This comment has been deleted
                                  </div>
                                  <div v-else-if="!comment.onEdit">
                                    <div class="ck-content" v-html="comment.comment" />
                                    <div class="d-flex align-center justify-space-between">
                                      <p class="mb-0 caption">
                                        {{ $dateText(comment.createdAt,'medium','short') }}
                                        by
                                        <span class="font-weight-bold">
                                          {{ comment.Member.member_type === 'researcher' ? `${comment.Member.Researcher.lastname}, ${comment.Member.Researcher.firstname}` : comment.Member.Organization.name }}
                                        </span>
                                        <span v-if="comment.edited" class="grey--text">
                                          [Edit]
                                        </span>
                                      </p>
                                      <v-menu v-if="$auth.loggedIn && (!$auth.user.role && [comment.member_id,item.member_id,forum.member_id].includes($auth.user.id) || ($auth.user.role && ['admin'].includes($auth.user.role)))" top left offset-x nudge-left="5">
                                        <template #activator="{ on, attrs }">
                                          <v-btn
                                            icon
                                            x-small
                                            v-bind="attrs"
                                            v-on="on"
                                          >
                                            <v-icon small>
                                              mdi-dots-vertical
                                            </v-icon>
                                          </v-btn>
                                        </template>

                                        <v-list nav dense>
                                          <v-list-item-group
                                            dense
                                            color="primary"
                                          >
                                            <v-list-item v-if="$auth.user.id === comment.member_id" color="warning" dense @click="onEditComment(comment)">
                                              <v-list-item-icon class="mr-1">
                                                <v-icon small color="warning">
                                                  fas fa-edit
                                                </v-icon>
                                              </v-list-item-icon>
                                              <v-list-item-content>
                                                <v-list-item-title>Edit Reply</v-list-item-title>
                                              </v-list-item-content>
                                            </v-list-item>
                                            <v-list-item v-if="[comment.member_id,item.member_id,forum.member_id].includes($auth.user.id) || ($auth.user.role && ['admin'].includes($auth.user.role))" dense @click="$bus.$emit('open-delete-dialog-comment', comment.id, `reply of comment #${((queryParams.page-1)*queryParams.size)+(index+1)}`)">
                                              <v-list-item-icon class="mr-1">
                                                <v-icon small color="error">
                                                  fas fa-trash
                                                </v-icon>
                                              </v-list-item-icon>
                                              <v-list-item-content>
                                                <v-list-item-title>Delete Reply</v-list-item-title>
                                              </v-list-item-content>
                                            </v-list-item>
                                          </v-list-item-group>
                                        </v-list>
                                      </v-menu>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <forms-comment
                              :id="`reply-comment-${item.id}`"
                              :forum="forum"
                              :value="`reply-${item.id}`"
                              class="mt-3"
                              :hide-form="!item.onReply"
                              :reply-id="item.id"
                              small-submit
                              @add="addComment"
                            >
                              <v-btn
                                small
                                outlined
                                class="rounded-lg mr-3"
                                color="grey"
                                @click="item.onReply = false"
                              >
                                Close
                              </v-btn>
                            </forms-comment>
                          </div>
                        </div>
                      </v-list-item-content>
                    </v-list-item>

                    <v-divider
                      v-if="index < comments.rows.length - 1"
                      :key="`comment-divider-${index}`"
                    />
                  </template>
                </v-list>
              </v-card>
              <div class="my-3 d-flex justify-end">
                <v-pagination
                  v-if="comments.totalPages > 1"
                  v-model="queryParams.page"
                  :length="comments.totalPages"
                  :total-visible="5"
                  @input="fetchComments"
                />
              </div>
            </div>
            <forms-comment v-if="$auth.loggedIn && !$auth.user.role" :forum="forum" @add="addComment" />
          </div>
        </v-col>
      </v-row>
    </v-container>
    <dialogs-delete value="forum" @delete="deleteForum" />
    <dialogs-delete value="comment" @delete="deleteComment" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      modelName: 'Forums',
      baseUrl: process.env.baseUrl,
      basePath: `${process.env.baseUrl}${this.$route.fullPath}`,
      apiPath: `${process.env.apiUrl}${process.env.apiDirectory}`,
      forum: null,
      comments: null,
      queryParams: {
        size: 10,
        q: '',
        page: 1
      }
    }
  },
  async fetch () {
    try {
      const data = await this.$axios.$get(`${this.apiPath}forums/${this.$route.params.slug}`)
      this.forum = await data
      this.$breadcrumbs.setItems([
        {
          to: { name: 'forums' },
          text: this.modelName
        },
        {
          text: this.forum.slug
        }
      ])
      await this.fetchComments()
      this.$bus.$emit('clear-comment-form')
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
  },
  head () {
    return this.$headUtil({
      lang: this.$lang.getISO,
      title: this.forum ? this.forum.title : '',
      description: this.forum ? this.forum.content : '',
      image: this.forum && this.forum.Img ? `${this.baseUrl}${this.forum.Img.url}` : null,
      urlPath: this.basePath
    })
  },
  beforeMount () {
    if (!this.$store.state.setting.show_menu_resourse_forum) {
      this.$nuxt.error({ statusCode: 404, message: 'Not Found This Page' })
    }
  },
  methods: {
    async fetchComments () {
      this.queryParams = {
        ...this.queryParams,
        ...this.$route.query
      }
      const searchParams = new URLSearchParams(this.queryParams).toString()
      try {
        const datas = await this.$axios.$get(`${this.apiPath}comments/${this.forum.id}${(searchParams ? '?' + searchParams : '')}`)
        const newRows = datas.rows.map((ele) => {
          return {
            ...ele,
            Comments: ele.Comments.map((ele) => {
              return {
                ...ele,
                onEdit: false
              }
            }),
            onEdit: false,
            onReply: false
          }
        })
        datas.rows = newRows
        this.comments = datas
        if (this.queryParams.page > this.comments.totalPages && this.comments.totalPages > 0) {
          this.queryParams.page = this.comments.totalPages
          await this.fetchComments()
        }
      } catch (e) {
        this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
      }
    },
    async addComment (data, type) {
      try {
        const result = await this.$axios.$post(`${this.apiPath}comments`, data)
        if (result) {
          this.$bus.$emit('clear-comment-form')
          if (type === 'add') {
            this.queryParams.page = 999999
          }
          await this.fetchComments()
          this.$vuetify.goTo(`#comment-${result.id}`, { offset: 300 })
        }
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
    },
    async editComment (data) {
      try {
        const result = await this.$axios.$put(`${this.apiPath}comments/${data.id}`, data)
        if (result) {
          this.$bus.$emit(`clear-comment-form-${data.id}`)
          await this.fetchComments()
        }
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
    },
    async deleteForum (id) {
      try {
        await this.$axios.$delete(`${this.apiPath}forums${this.$auth.user.role && ['admin'].includes(this.$auth.user.role) ? '-admin' : ''}/${id}`)
        this.$router.replace(this.localePath({ name: 'forums' }))
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
      this.$overlay.hide()
    },
    async deleteComment (id) {
      try {
        await this.$axios.$delete(`${this.apiPath}comments${this.$auth.user.role && ['admin'].includes(this.$auth.user.role) ? '-admin' : ''}/${id}`)
        await this.fetchComments()
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
      this.$overlay.hide()
    },
    onEditComment (data) {
      data.onEdit = true
      this.$bus.$emit(`open-comment-form-${data.id}`, data)
    },
    onReplyComment (data) {
      data.onReply = true
      this.$bus.$emit(`open-comment-form-reply-${data.id}`)
      this.$nextTick(() => {
        this.$vuetify.goTo(`#reply-comment-${data.id}`, { offset: 300 })
      })
    }
  }
}
</script>
