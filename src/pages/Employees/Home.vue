<template>
  <div>
    <v-app-bar color="primary" dark app>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="hidden-md-and-up"></v-app-bar-nav-icon>
      <AppBarNavLogo></AppBarNavLogo>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn text to="#3">Панель администратора</v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn class="text-capitalize" text to="#2">
          <v-avatar color="red" class="mr-2" size="40">
            <span class="white--text headline">К</span>
          </v-avatar>
          <span>{{ getUser.employee.emp_short_name }}</span>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-navigation-drawer
        v-model="drawer"
        temporary
        app
    >
      <template v-slot:prepend>
        <v-list-item two-line to="#2">
          <!--          <v-list-item-avatar>-->
          <!--            <img src="https://cdn.vuetifyjs.com/images/john.jpg">-->
          <!--          </v-list-item-avatar>-->
          <v-avatar color="red" class="mr-2" size="40">
            <span class="white--text headline">{{ getUser.employee.emp_short_name.substr(0, 1) }}</span>
          </v-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ getUser.employee.emp_short_name }}</v-list-item-title>
            <v-list-item-subtitle>Онлайн</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item to="#3">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Панель администратора</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>

    <v-main>
      <Notifications></Notifications>

      <v-container grid-list-lg>
        <v-layout row>
          <v-flex v-for="item in items"
                  :key="item.id"
                  xs12 sm6 md4 lg3 wrap>
            <v-card
                class="mx-auto"
                max-width="344"
                min-height="350"
                :to="item.to"
            >
              <v-img
                  :src="item.imgSrc"
                  height="200px"
              ></v-img>

              <v-card-title>
                {{ item.totle }}
              </v-card-title>

              <v-card-subtitle>
                {{ item.description }}
              </v-card-subtitle>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex"

export default {
  created() {
    this.requestGetUser();
  },


  data() {
    return {
      drawer: false,
      items: [
        {
          id: 1,
          imgSrc: this.$root.images.PfdDprt,
          totle: 'Отдел формирования программ',
          description: 'Программы капремонта и информация по МКД',
          to: '/pfd/ltp'
        },
      ]
    }
  },


  computed: {
    ...mapGetters('user', ['getUserLoading', 'getUserProgress', 'getUser'])
  },


  methods: {
    ...mapActions('user', ['requestGetUser']),
  }
}
</script>