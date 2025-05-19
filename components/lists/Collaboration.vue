<template>
  <div class="">
    <v-expansion-panels v-if="talent && listDatas" v-model="expansion" focusable>
      <v-expansion-panel readonly>
        <v-expansion-panel-header hide-actions style="cursor: default;">
          <div class="d-flex align-center">
            <div class="">
              <h3 class="font-weight-light">
                {{ modelName }}
              </h3>
              <p v-if="listDatas.length > 0" class="mb-0 caption info--text">
                {{ listDatas.length }}
                {{ listDatas.length > 1 ? 'Items' : 'item' }}
              </p>
              <p v-else class="mb-0 caption grey--text">
                No Data
              </p>
            </div>
            <v-spacer />
            <v-btn
              small
              class="mr-3"
              outlined
              color="info"
              @click="add"
            >
              <v-icon class="mr-1" x-small>
                fas fa-plus
              </v-icon>
              Add
            </v-btn>
            <v-btn :disabled="listDatas.length === 0" icon @click="toggleExpansion">
              <v-icon v-text="showExpansion ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
            </v-btn>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="mx-n6">
          <v-list color="transparent" class="py-0">
            <template v-for="(item,i) in listDatas">
              <v-list-item :key="`collaboration-item-${i}`" class="">
                <v-list-item-content class="align-self-start py-1">
                  <a
                    v-if="item.CoAuthor.talent_id"
                    target="_blank"
                    :href="localePath({ name: 'backend-manages-talents-id', params: { id: item.CoAuthor.talent_id } })"
                  >
                    <p class="info--text title mb-0">
                      <v-icon color="accent" small class="mr-1">
                        fas fa-user-tie
                      </v-icon>
                      {{ item.CoAuthor.firstname }}
                      {{ item.CoAuthor.lastname }}
                    </p>
                  </a>
                  <p v-else class="title mb-0">
                    <v-icon color="grey" small class="mr-1">
                      far fa-user
                    </v-icon>
                    {{ item.CoAuthor.firstname }}
                    {{ item.CoAuthor.lastname }}
                  </p>
                </v-list-item-content>
                <v-list-item-action class="align-self-start">
                  <v-icon color="error" small @click="$bus.$emit('open-delete-dialog-collaboration', item.id, `${item.CoAuthor.firstname} ${item.CoAuthor.lastname}`)">
                    fas fa-trash
                  </v-icon>
                </v-list-item-action>
              </v-list-item>
              <v-divider
                v-if="i < listDatas.length - 1"
                :key="`collaboration-divider-${i}`"
                class="my-0"
              />
            </template>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <selects-collaboration :talent="talent" @refresh="$emit('refresh', () => setExpansion())" />
    <dialogs-delete value="collaboration" @delete="saveDelete" />
  </div>
</template>

<script>
export default {
  props: {
    talent: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      modelName: 'Collaboration',
      api: `${process.env.apiUrl}${process.env.apiDirectory}collaborations`,
      expansion: null
    }
  },
  computed: {
    listDatas () {
      return this.talent.Collaborations
    },
    showExpansion () {
      return this.expansion === 0
    }
  },

  methods: {
    add () {
      this.setExpansion()
      this.$bus.$emit('open-collaboration-select', this.talent)
    },
    toggleExpansion () {
      this.expansion = this.showExpansion ? null : 0
    },
    setExpansion () {
      this.expansion = this.listDatas.length > 0 ? 0 : null
    },
    async saveDelete (id) {
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
