<template>
  <div>
    <v-container v-if="forum">
      <v-card>
        <div class="px-5 py-3">
          <h2 class="display-1 mb-0 themeAccent--text">
            {{ forum.title }}
            <span v-if="forum.edited" class="grey--text body-1">
              [Edit]
            </span>
          </h2>
          <div v-if="forum.tags" class="d-flex  flex-wrap">
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
            >
              {{ val }}
            </v-chip>
          </div>
        </div>
        <v-divider />
        <v-card-text>
          <div v-if="forum.Img" class="text-center my-5">
            <img
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
            <v-btn
              icon
              x-small
              color="error"
              @click="$bus.$emit('open-delete-dialog-forum', forum.id, forum.title)"
            >
              <v-icon small>
                fas fa-trash
              </v-icon>
            </v-btn>
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
                                      <span class="font-weight-bold pointer" @click="$bus.$emit('open-comment-log',item.CommentLogs)">
                                        [Edit]
                                      </span>
                                      on  {{ $dateText(item.updatedAt,'medium','short') }}
                                    </span>
                                  </p>
                                  <v-btn
                                    icon
                                    x-small
                                    color="error"
                                    @click="$bus.$emit('open-delete-dialog-comment', item.id, `comment #${((queryParams.page-1)*queryParams.size)+(index+1)}`)"
                                  >
                                    <v-icon small>
                                      fas fa-trash
                                    </v-icon>
                                  </v-btn>
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
                                          <span class="font-weight-bold pointer" @click="$bus.$emit('open-comment-log',comment.CommentLogs)">
                                            [Edit]
                                          </span>
                                          on  {{ $dateText(comment.updatedAt,'medium','short') }}
                                        </span>
                                      </p>
                                      <v-btn
                                        icon
                                        x-small
                                        color="error"
                                        @click="$bus.$emit('open-delete-dialog-comment', comment.id, `reply of comment #${((queryParams.page-1)*queryParams.size)+(index+1)}`)"
                                      >
                                        <v-icon small>
                                          fas fa-trash
                                        </v-icon>
                                      </v-btn>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
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
          </div>
        </v-card-text>
      </v-card>
    </v-container>
    <lists-comment-log />
    <dialogs-delete value="forum" @delete="deleteForum" />
    <dialogs-delete value="comment" @delete="deleteComment" />
  </div>
</template>

<script>
export default {
  layout: 'back',
  middleware: ['authen-admin', 'backend', 'admin'],
  data () {
    return {
      modelName: 'Forums',
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
      const data = await this.$axios.$get(`${this.apiPath}forums-admin/${this.$route.params.slug}`)
      this.forum = await data
      this.$breadcrumbs.setItems([
        {
          to: { name: 'backend-manages-forums' },
          text: this.modelName
        },
        {
          text: this.forum.title
        }
      ])
      await this.fetchComments()
      this.$bus.$emit('clear-comment-form')
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
  },
  head () {
    return {
      title: `${this.modelName} ${this.forum ? this.forum.title : ''}`
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
        const datas = await this.$axios.$get(`${this.apiPath}comments-admin/${this.forum.id}${(searchParams ? '?' + searchParams : '')}`)
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
    async deleteForum (id) {
      try {
        await this.$axios.$delete(`${this.apiPath}forums-admin/${id}`)
        this.$router.replace(this.localePath({ name: 'backend-manages-forums' }))
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
      this.$overlay.hide()
    },
    async deleteComment (id) {
      try {
        await this.$axios.$delete(`${this.apiPath}comments-admin/${id}`)
        await this.fetchComments()
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
      this.$overlay.hide()
    }
  }
}
</script>
