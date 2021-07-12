<template>
  <v-card color="white"
          :height="$vuetify.breakpoint.smAndDown ? 56 : 64"
          flat tile
          to="/">
    <img
        :src="$root.images.Logo"
        height="100%"
    />
  </v-card>
</template>

<script>
export default {
  name: "AppBarNavLogo.vue"
}
</script>