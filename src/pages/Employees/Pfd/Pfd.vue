<template>
  <div>
    <v-app-bar color="primary" dark app clipped-right>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="hidden-md-and-up"></v-app-bar-nav-icon>
      <AppBarNavLogo></AppBarNavLogo>
      <v-toolbar-items class="hidden-sm-and-down">

        <!--
        Особый пункт меню, который отображается только
        на больших экранах в разделе МКД отдела ФРП
        -->
        <v-btn v-if="mkdMenuItem" text :to="mkdMenuItem.to">МКД</v-btn>

        <!-- Стандартные пункты меню, которые отображаюся в разделе ФРП-->
        <v-btn v-for="item in getMenu.items" :key="item.name" text :to="item.to">{{ item.label }}</v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-navigation-drawer
        v-model="drawer"
        temporary
        app
    >
      <v-list dense>
        <v-subheader class="text-uppercase">{{ getMenu.name }}</v-subheader>

        <!--
        Стандартные пункты меню, которые отображаюся в разделе ФРП
        на мобильных устройствах
        -->
        <v-list-item v-for="item in getMenu.items"
                     :key="item.name"
                     :to="item.to"
                     color="primary">
          <v-list-item-title>{{ item.label }}</v-list-item-title>
        </v-list-item>

        <!--
        Пункты подменю, которые отображаются на определенных страницах
        на мобильных устройствах
        -->
        <v-list-item-group v-if="getSubMenu">
          <v-subheader class="text-uppercase">{{ getSubMenu.name }}</v-subheader>

          <v-list-item v-for="item in getSubMenu.items"
                       :key="item.name"
                       :to="item.to"
                       color="primary">
            <v-list-item-title>{{ item.label }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <router-view></router-view>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';

export default {
  data() {
    return {}
  },


  computed: {
    ...mapGetters('Pfd', ['getDrawer', 'getMenu', 'getSubMenu']),

    drawer: {
      get() {
        return this.getDrawer;
      },
      set(value) {
        this.setDrawer(value);
      }
    },


    mkdMenuItem() {
      return this.getSubMenu ? this.getSubMenu.items[0] : null
    }
  },


  methods: {
    ...mapMutations('Pfd', ['setDrawer'])
  }
}
</script>

<style scoped>

</style>