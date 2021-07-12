<template>
  <div>
    <v-app-bar color="primary" dark app clipped-right>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="hidden-md-and-up"></v-app-bar-nav-icon>
      <AppBarNavLogo></AppBarNavLogo>
      <v-toolbar-items class="hidden-sm-and-down">
        <!--        <v-btn to="/" text>-->
        <!--          <v-img :src="$store.state.images.Logo" contain-->
        <!--                 style="background-color: white"></v-img>-->
        <!--        </v-btn>-->
        <v-btn v-for="item in menuItems" :key="item.id" text :to="item.to">{{ item.label }}</v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-navigation-drawer
        v-model="drawer"
        temporary
        app
    >
      <v-list dense>
        <v-list-item v-for="item in menuItems" :key="item.id" :to="item.to">
          <!--          <v-list-item-icon>-->
          <!--            <v-icon>mdi-home</v-icon>-->
          <!--          </v-list-item-icon>-->

          <v-list-item-content>
            <v-list-item-title>{{ item.label }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      menuItems: [
        {
          id: 1,
          label: 'Долгосрочная программа',
          to: '/pfd/ltp'
        },
        {
          id: 2,
          label: 'Краткосрочная программа',
          to: '/pfd/stp'
        },
        {
          id: 3,
          label: 'Настройки',
          to: '/pfd/settings'
        },
        {
          id: 4,
          label: 'Отчеты',
          to: '/pfd/reports'
        }
      ]
    }
  },
}
</script>

<style scoped>

</style>