<template>
  <v-dialog v-model="dialog" persistent scrollable max-width="800">
    <v-card v-if="listDatas">
      <v-toolbar
        color="bgLight"
        elevation="0"
        flat
      >
        <v-toolbar-title>
          <h3 class="themeAccent--text">
            Comment histories
          </h3>
        </v-toolbar-title>
        <v-spacer />
        <v-btn fab x-small text @click="closeDialog">
          <v-icon>
            fas fa-times
          </v-icon>
        </v-btn>
      </v-toolbar>
      <v-list color="transparent" class="pb-0">
        <template v-for="(item,i) in listDatas">
          <v-list-item :key="`comment-log-item-${i}`" class="">
            <v-list-item-content>
              <div class="">
                <div class="ck-content" v-html="item.comment" />
              </div>
              <p v-if="i > 0" :key="`comment-date-item-${i}`" class="mb-0 caption">
                Edited at
                {{ $dateText(listDatas[i-1].createdAt,'medium','short') }}
              </p>
            </v-list-item-content>
          </v-list-item>
          <v-divider
            v-if="i < listDatas.length - 1"
            :key="`comment-log-divider-${i}`"
            class="my-3"
          />
        </template>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      listDatas: null
    }
  },
  created () {
    this.$bus.$on('open-comment-log', (datas) => {
      this.$overlay.showLoading()
      this.listDatas = null
      this.listDatas = datas
      this.dialog = true
    })
  },
  beforeDestroy () {
    this.$bus.$off('open-comment-log')
  },
  methods: {
    closeDialog () {
      this.dialog = false
      this.$overlay.hide()
    }
  }
}
</script>
