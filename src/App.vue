<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>
import Vue from "vue";
import {mapActions} from "vuex"

export default {
  created() {
    // Добавляем интерсептор ответа, чтобы предпринять действия в случае разлогинивания
    Vue.axios.interceptors.response.use(res => res, err => {
      console.log('Сработал интерсептор response', err);

      if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.requestRefreshToken();
      }

      return Promise.reject(err);
    })
  },


  methods: {
    ...mapActions('login', ['requestRefreshToken'])
  }
}
</script>
