<template>
  <div class="">
    <v-expansion-panels v-if="listDatas" focusable>
      <v-expansion-panel>
        <v-expansion-panel-header>
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
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="mx-n6">
          <v-data-table
            dense
            disable-pagination
            hide-default-footer
            :headers="tableHeaders"
            :items="listDatas"
          >
            <template #[`item.name`]="{ item }">
              <a
                v-if="item.talent_id"
                target="_blank"
                :href="localePath({ name: 'backend-manages-talents-id', params: { id: item.talent_id } })"
              >
                {{ item.firstname }}
                {{ item.lastname }}
              </a>
            </template>
          </v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
export default {
  props: {
    listDatas: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      modelName: 'Recommendations',
      tableHeaders: [
        {
          text: 'Talent Name',
          value: 'name',
          sortable: false
        },
        {
          text: 'Country',
          value: 'country',
          sortable: false
        },
        {
          text: 'H-index',
          value: 'h_index',
          align: 'right',
          sortable: false
        },
        {
          text: 'Cosine Value',
          value: 'cos',
          sortable: false
        }
      ]
    }
  }
}
</script>
