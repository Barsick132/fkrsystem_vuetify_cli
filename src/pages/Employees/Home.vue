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
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="text-capitalize"
                   text
                   v-bind="attrs"
                   v-on="on"
            >
              <v-avatar color="red" class="mr-2" size="40">
                <span class="white--text headline">К</span>
              </v-avatar>
              <span>{{ getUser ? getUser.employee.emp_short_name : '...' }}</span>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item-group
                color="primary"
            >
              <v-list-item
                  v-for="(item, index) in account_menu"
                  :key="'account_menu' + index"
                  :to="item.to"
                  @click="item.click"
              >
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-app-bar>

    <v-navigation-drawer
        v-model="drawer"
        temporary
        app
    >
      <template v-slot:prepend>
        <v-list-item two-line :to="menuItemAccount.to">
          <!--          <v-list-item-avatar>-->
          <!--            <img src="https://cdn.vuetifyjs.com/images/john.jpg">-->
          <!--          </v-list-item-avatar>-->
          <v-avatar color="red" class="mr-2" size="40">
            <span class="white--text headline">{{ getUser ? getUser.employee.emp_short_name.substr(0, 1) : '...' }}</span>
          </v-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ getUser ? getUser.employee.emp_short_name : '...' }}</v-list-item-title>
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
        <v-list-item :to="menuItemAccount.to">
          <v-list-item-icon>
            <v-icon>{{ menuItemAccount.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ menuItemAccount.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="menuItemLogout.click">
          <v-list-item-icon>
            <v-icon>{{ menuItemLogout.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ menuItemLogout.title }}</v-list-item-title>
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
import {mapActions, mapGetters, mapMutations} from "vuex"

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
          to: { name: 'ltp' }
        },
      ],
      account_menu: [
        {
          id: 1,
          name: 'account',
          icon: 'mdi-account',
          title: 'Личный кабинет',
          to: '#account',
          click: () => {}
        },
        {
          id: 2,
          name: 'logout',
          icon: 'mdi-logout',
          title: 'Выход',
          to: null,
          click: this.logout
        }
      ]
    }
  },


  computed: {
    ...mapGetters('user', ['getUserLoading', 'getUserProgress', 'getUser']),
    menuItemAccount() {
      return this.account_menu.find(item => item.name === 'account');
    },
    menuItemLogout() {
      return this.account_menu.find(item => item.name === 'logout');
    }
  },


  methods: {
    ...mapActions('user', ['requestGetUser']),
    ...mapMutations('login', ['logout'])
  }
}
</script>