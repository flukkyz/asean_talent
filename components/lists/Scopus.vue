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
              Create
            </v-btn>
            <v-btn :disabled="listDatas.length === 0" icon @click="toggleExpansion">
              <v-icon v-text="showExpansion ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
            </v-btn>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="mx-n6">
          <v-list color="transparent" class="pb-0">
            <template v-for="(item,i) in listDatas">
              <v-list-item :key="`scopus-item-${i}`" class="">
                <v-list-item-content class="align-self-start">
                  <p class="caption grey--text mb-0">
                    Scopus ID
                  </p>
                  <p class="headline mt-n1 mb-3">
                    {{ item.scopus_id }}
                  </p>

                  <p class="caption grey--text mb-0">
                    Industry
                  </p>
                  <div class="d-flex flex-wrap mb-3">
                    <v-chip
                      v-for="(val, index) in item.domain_industry.split('; ')"
                      :key="`industry-${index}`"
                      small
                      class="ma-1"
                      dark
                      color="themeAccent"
                    >
                      {{ val }}
                    </v-chip>
                  </div>

                  <label-value
                    label="FWCI"
                    :value="item.fwci"
                  />
                  <label-value
                    label="Scholarly Output"
                    :value="item.scholarly_output"
                  />
                  <label-value
                    label="Most Recent Publication"
                    :value="item.most_recent_pub"
                  />
                  <label-value
                    label="Citation"
                    :value="item.citation"
                  />
                  <label-value
                    label="Citation per Publication"
                    :value="item.citation_per_pub"
                  />
                  <label-value
                    label="Citation Count"
                    :value="item.citation_count"
                  />
                  <label-value
                    label="Cited by Count"
                    :value="item.cited_by_count"
                  />
                  <label-value
                    label="Document Count"
                    :value="item.document_count"
                  />
                  <label-value
                    label="Number of Co Author"
                    :value="item.no_of_coauthor"
                  />
                  <lists-keyword :scopus="item" @refresh="emitRefresh" />
                </v-list-item-content>
                <v-list-item-action class="align-self-start">
                  <div class="d-flex">
                    <div class="grey lighten-4 pa-2 rounded-lg text-center">
                      <p class="caption grey--text mb-0">
                        H-Index
                      </p>
                      <p class="display-1 mt-n1 mb-0">
                        {{ item.h_index }}
                      </p>
                    </div>
                  </div>
                  <div class="d-flex mt-3">
                    <v-icon color="warning" small class="mr-3" @click="$bus.$emit('open-scopus-form',talent,item)">
                      fas fa-edit
                    </v-icon>
                    <v-icon color="error" small @click="$bus.$emit('open-delete-dialog-scopus', item.id, item.scopus_id)">
                      fas fa-trash
                    </v-icon>
                  </div>
                </v-list-item-action>
              </v-list-item>
              <v-divider
                v-if="i < listDatas.length - 1"
                :key="`scopus-divider-${i}`"
                class="my-3"
              />
            </template>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <forms-scopus :is-young-talent="isYoungTalent" @add="submitCreate" @edit="submitUpdate" />
    <dialogs-delete value="scopus" @delete="submitDelete" />
  </div>
</template>

<script>
export default {
  props: {
    talent: {
      type: Object,
      default: null
    },
    isYoungTalent: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modelName: 'Scopus',
      api: `${process.env.apiUrl}${process.env.apiDirectory}scopuses`,
      expansion: null
    }
  },
  computed: {
    listDatas () {
      return this.talent.Scopus
    },
    showExpansion () {
      return this.expansion === 0
    }
  },

  methods: {
    add () {
      this.setExpansion()
      this.$bus.$emit('open-scopus-form', this.talent)
    },
    toggleExpansion () {
      this.expansion = this.showExpansion ? null : 0
    },
    setExpansion () {
      this.expansion = this.listDatas.length > 0 ? 0 : null
    },
    emitRefresh () {
      this.$emit('refresh', () => this.setExpansion())
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
