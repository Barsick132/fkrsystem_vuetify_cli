<template>
  <div class="v-snack v-snack--absolute v-snack--has-background v-snack--right v-snack--top" style="z-index: 203">
    <v-list color="transparent">
      <v-list-item
          class="mb-1"
          v-for="noti in notifications"
          :key="noti.time"
      >
        <v-snackbar
            :timeout="timeout"
            :value="!!noti.value"
            shaped
            absolute
            top
            right
            :color="noti.color"
            @input="clearNotification(noti.time)"
        >
          {{ noti.value }}
          <template v-slot:action="{ attrs }">
            <v-btn
                icon
                v-bind="attrs"
                @click="clearNotification(noti.time)"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-snackbar>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'

export default {
  data() {
    return {
      timeout: 5000
    }
  },


  computed: {
    ...mapGetters(['notifications']),
  },


  methods: {
    ...mapMutations(['clearNotification']),
  }
}
</script>

