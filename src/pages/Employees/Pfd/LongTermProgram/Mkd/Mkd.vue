<template>
  <div>
    <MkdNavigationDrawer></MkdNavigationDrawer>

    <v-main app>
      <v-toolbar ref="toolbar"
                 class="hidden-sm-and-down"
                 dense>
        <v-toolbar-items>
          <v-btn icon @click="sub_drawer = !sub_drawer">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </v-toolbar-items>
        <v-spacer></v-spacer>
      </v-toolbar>

      <router-view></router-view>

    </v-main>
  </div>
</template>

<script>
import MkdNavigationDrawer from "@/pages/Employees/Pfd/LongTermProgram/Mkd/MkdNavigationDrawer";
import {mapGetters, mapMutations} from 'vuex';


export default {
  components: {
    MkdNavigationDrawer
  },

  computed: {
    ...mapGetters('Pfd', ['getSubDrawer']),

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
    ...mapMutations('Pfd', ['setSubDrawer']),
  }
}
</script>