<template>
  <v-dialog
      v-model="getCounterMkdArr.dialog"
      max-width="600px"
      scrollable
      @click:outside="close"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Кол-во {{ flag === 'ADD' ? 'включенных' : 'исключенных' }} МКД</span>
        <v-spacer></v-spacer>
        <span class="subtitle-2 text--secondary">{{ currentLtpv ? currentLtpv.ltpv_name : '' }}</span>
      </v-card-title>

      <v-progress-linear
          v-if="getCounterMkdArr.loading"
          v-model="getCounterMkdArr.progress"
          absolute
          top
          color="primary"
      ></v-progress-linear>

      <v-divider></v-divider>

      <v-card-text :style="{height: '600px'}">
        <v-card tile flat>
          <v-card-title>
            <v-text-field
                v-model="searchCounterMkdTable"
                append-icon="mdi-magnify"
                label="Поиск"
                single-line
                hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
              :headers="headersCounterMkdTable"
              :items="getCounterMkdArr.data"
              :search="searchCounterMkdTable"
              :footer-props="{
                itemsPerPageOptions: [10, 50, 100, 500, 1000, -1],
                itemsPerPageText: 'Кол-во элементов на странице',
                itemsPerPageAllText: 'Все',
                pageText: '{0}-{1} из {2}'
              }"
              :items-per-page="100"
              class="elevation-1"
              :loading="getCounterMkdArr.loading"
              loading-text="Загрузка... Пожалуйста, подождите"
              no-data-text="Нет данных"
              dense
          >
          </v-data-table>
        </v-card>

      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="close">Закрыть</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex'

export default {
  mounted() {
    this.setCounterMkdArr({dialog: true});

    this.requestGetCounterMkdByFlag({ltpv_id: this.ltpv_id, flag: this.flag});
  },


  data: () => ({
    searchCounterMkdTable: '',
    headersCounterMkdTable: [
      {
        text: 'Адрес дома',
        sortable: true,
        value: 'mkd_address',
      },
    ]
  }),


  computed: {
    ...mapGetters('Ltp', ['getCounterMkdArr', 'getVersions']),

    ltpv_id() {
      return parseInt(this.$route.params.id);
    },
    flag() {
      return this.$route.params.flag;
    },
    currentLtpv() {
      return this.getVersions.find(ltpv => ltpv.ltpv_id === this.ltpv_id);
    }
  },


  methods: {
    ...mapActions('Ltp', ['requestGetCounterMkdByFlag']),
    ...mapMutations('Ltp', ['setCounterMkdArr']),

    close() {
      this.setCounterMkdArr({dialog: false});
    },
  }
}
</script>

<style scoped>

</style>