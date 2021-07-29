<template>
  <v-card color="white"
          :height="$vuetify.application.top"
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
  name: "AppBarNavLogo.vue",
}
</script>