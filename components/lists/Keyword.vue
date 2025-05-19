<template>
  <div class="">
    <div v-if="scopus && listDatas">
      <div class="d-flex align-center">
        <div class="mr-3">
          <p class="subtitle-1 font-weight-bold mb-0">
            {{ modelName }}
          </p>
          <p v-if="listDatas.length > 0" class="mb-0 caption info--text">
            {{ listDatas.length }}
            {{ listDatas.length > 1 ? 'Items' : 'item' }}
          </p>
          <p v-else class="mb-0 caption grey--text">
            No Data
          </p>
        </div>
        <v-btn
          small
          outlined
          color="info"
          @click="add"
        >
          <v-icon class="mr-1" x-small>
            fas fa-plus
          </v-icon>
          Create
        </v-btn>
      </div>
      <v-list color="transparent" class="pb-0">
        <template v-for="(item,i) in listDatas">
          <v-list-item :key="`keyword-item-${i}`" class="">
            <v-list-item-content class="align-self-start">
              <div class="d-flex flex-wrap">
                <v-chip
                  v-for="(val, index) in item.keyword.split('; ')"
                  :key="`keyword-${index}`"
                  small
                  class="ma-1"
                  color="info"
                >
                  {{ val }}
                </v-chip>
              </div>
            </v-list-item-content>
            <v-list-item-action class="align-self-start">
              <div class="d-flex align-center mt-1">
                <v-icon color="warning" small class="mr-3" @click="$bus.$emit(`open-keyword-form-${scopus.id}`,scopus,item)">
                  fas fa-edit
                </v-icon>
                <v-icon color="error" small @click="$bus.$emit(`open-delete-dialog-keyword-${scopus.id}`, item.id, item.keyword)">
                  fas fa-trash
                </v-icon>
              </div>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list>
    </div>
    <forms-keyword :value="scopus.id.toString()" @add="submitCreate" @edit="submitUpdate" />
    <dialogs-delete :value="`keyword-${scopus.id}`" @delete="submitDelete" />
  </div>
</template>

<script>
export default {
  props: {
    scopus: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      modelName: 'Keyword',
      api: `${process.env.apiUrl}${process.env.apiDirectory}keywords`,
      expansion: null
    }
  },
  computed: {
    listDatas () {
      return this.scopus.Keywords
    },
    showExpansion () {
      return this.expansion === 0
    }
  },

  methods: {
    add () {
      this.setExpansion()
      this.$bus.$emit(`open-keyword-form-${this.scopus.id}`, this.scopus)
    },
    toggleExpansion () {
      this.expansion = this.showExpansion ? null : 0
    },
    setExpansion () {
      this.expansion = this.listDatas.length > 0 ? 0 : null
    },
    async submitCreate (data) {
      try {
        const result = await this.$axios.$post(this.api, data)
        if (result) {
          this.$notifier.showMessage({ title: 'Created', content: `Create ${this.modelName} Successfully`, color: 'success' })
        }
        this.$emit('refresh', () => this.setExpansion())
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
      this.$overlay.hide()
    },
    async submitUpdate (data) {
      try {
        const result = await this.$axios.$put(`${this.api}/${data.id}`, data)
        if (result) {
          this.$notifier.showMessage({ title: 'Updated', content: `Updated ${this.modelName} Successfully`, color: 'success' })
        }
        this.$emit('refresh', () => this.setExpansion())
      } catch (e) {
        console.log(e)
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
      this.$overlay.hide()
    },
    async submitDelete (id) {
      try {
        await this.$axios.delete(`${this.api}/${id}`)
        this.$notifier.showMessage({ title: 'Deleted', content: `Deleted ${this.modelName} Successfully`, color: 'success' })
        this.$emit('refresh', () => this.setExpansion())
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
      this.$overlay.hide()
    }
  }
}
</script>
