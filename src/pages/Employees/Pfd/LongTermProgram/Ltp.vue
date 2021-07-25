<template>
  <v-main>
    <Notifications></Notifications>

    <v-container fluid>

      <v-row
          dense
      >
        <v-spacer></v-spacer>
        <v-btn color="primary">Сохранить ДП</v-btn>
      </v-row>

      <v-simple-table>
        <template v-slot:default>
          <thead>
          <tr>
            <th v-for="(header, i) in headers" :key="i" class="text-left">
              {{ header.text }}
            </th>
          </tr>
          </thead>
          <thead v-if="loading">
          <tr class="v-data-table__progress">
            <th :colspan="headers.length" class="column">
              <v-progress-linear
                  v-model="progress"
                  absolute
                  left
              ></v-progress-linear>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="loading" class="v-data-table__empty-wrapper">
            <td :colspan="headers.length">Загрузка... Пожалуйста, подождите</td>
          </tr>
          <tr v-else-if="getVersions.length===0" class="v-data-table__empty-wrapper">
            <td :colspan="headers.length">Нет данных</td>
          </tr>
          <tr v-else v-for="(ltpv, i) in getVersions" :key="i">
            <td>{{ ltpv.ltpv_id }}</td>
            <td>
              <router-link :to="'/pfd/ltp/v' + ltpv.ltpv_id">{{ ltpv.ltpv_name }}</router-link>
            </td>
            <td>{{ ltpv.count_mkd }}
              <router-link class="success--text" :to="{name: 'counterMkd', params: {id: ltpv.ltpv_id, flag: 'ADD'}}">(+{{ ltpv.count_mkd_add }})</router-link>
              <router-link class="error--text" :to="{name: 'counterMkd', params: {id: ltpv.ltpv_id, flag: 'EXC'}}">(-{{ ltpv.count_mkd_del }})</router-link>
            </td>
            <td>{{ ltpv.ltpv_period }}</td>
            <td width="750px">
              <v-btn v-for="file in ltpv.file_arr"
                     :key="file.name"
                     color="primary"
                     text
                     small
                     class="text-none"
                     @click="requestDownloadFile(file)"
              >
                <v-icon left>{{ $root.getIconNameByExtension(file.file_extension) }}</v-icon>
                {{ file.file_name }}.{{ file.file_extension }}
              </v-btn>
            </td>
            <td>
              <v-btn class="ml-md-3"
                     color="warning"
                     text fab light x-small
                     :to="{name: 'updateMeta', params: {id: ltpv.ltpv_id}}">
                <v-icon dark>mdi-pencil</v-icon>
              </v-btn>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>

      <router-view></router-view>

    </v-container>
  </v-main>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
  mounted() {
    this.requestGetVersions();
  },


  data() {
    return {
      drawer: true,
      filter: true,

      headers: [
        {
          text: '№ ДП',
          value: 'ltpv_id',
        },
        {text: 'Наименование редакции', value: 'ltpv_name'},
        {text: 'Количество домов', value: 'count_mkd'},
        {text: 'Плановый период', value: 'plan_period'},
        {text: 'Документы', value: 'files', files: true},
        {text: 'Действия', value: 'actions'},
      ],
    }
  },


  computed: {
    ...mapGetters(['loading', 'progress']),
    ...mapGetters('Ltp', ['getVersions']),
  },


  methods: {
    ...mapActions(['getIconNameByExtension']),
    ...mapActions('Ltp', ['requestGetVersions', 'requestDownloadFile'])
  },
}
</script>

<style scoped>

</style>