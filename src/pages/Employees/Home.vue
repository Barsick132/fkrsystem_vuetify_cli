<template>
  <v-main>
    <v-container>
      <h1 class="display-1">Страница Home</h1>

      <v-btn rounded>
        <v-icon @click="logout">mdi-logout</v-icon>
      </v-btn>
      <v-btn rounded>
        <v-icon @click="requestRefreshToken">mdi-refresh</v-icon>
      </v-btn>
      <v-btn to="/home">/home</v-btn>
      <v-btn to="/home2">/home2</v-btn>
    </v-container>
  </v-main>
</template>

<script>
import {mapMutations, mapActions} from "vuex";

export default {
  methods: {
    ...mapMutations('login', ['logout']),
    ...mapActions('login', ['requestRefreshToken'])
  }
}
</script>