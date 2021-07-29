<template>
  <div>
    <v-navigation-drawer
        v-if="getSubMenu"
        class="hidden-sm-and-down"
        v-model="sub_drawer"
        app
    >
      <v-list dense>
        <v-subheader class="text-uppercase">{{ getSubMenu.name }}</v-subheader>

        <!--
        Стандартные пункты меню, которые отображаюся в разделе ФРП
        на мобильных устройствах
        -->
        <v-list-item v-for="sub_item in getSubMenu.items"
                     :key="sub_item.name"
                     :to="sub_item.to"
                     color="primary">
          <v-list-item-title>{{ sub_item.label }}</v-list-item-title>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>

    <v-main app>

      <v-app-bar ref="toolbar"
                 class="hidden-sm-and-down"
                 dense>
      <v-toolbar-items>
        <v-btn icon @click="sub_drawer = !sub_drawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      </v-app-bar>
    </v-main>

    <router-view></router-view>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';


export default {
  mounted() {
    // Добавляем подменю для стрицы МКД
    this.setSubMenu({
      name: 'МКД',
      items: [
        {
          name: 'mkd_params',
          label: 'Параметры МКД',
          to: {name: 'mkd', params: {ltpv_id: this.ltpv_id, mkdstate_id: this.mkdstate_id}}
        },
        {
          name: 'mkd_params_history',
          label: 'Изменения параметров МКД',
          to: '/mkd/params_history'
        },
      ]
    });
  },


  beforeDestroy() {
    // Удаляем подменю для стрицы МКД
    this.setSubMenu(null);
  },


  data() {
    return {}
  },


  computed: {
    ...mapGetters('Pfd', ['getSubDrawer', 'getSubMenu']),

    ltpv_id() {
      return parseInt(this.$route.params.ltpv_id);
    },
    mkdstate_id() {
      return parseInt(this.$route.params.mkdstate_id);
    },

    sub_drawer: {
      get() {
        return this.getSubDrawer;
      },
      set(value) {
        this.setSubDrawer(value);
      }
    },
  },


  methods: {
    ...mapMutations('Pfd', ['setSubDrawer', 'setSubMenu']),
  }
}
</script>