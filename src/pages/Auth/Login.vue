<template>
  <v-main>
    <v-container>
      <v-img
          width="300"
          :src="Logo"
          class="mx-auto mb-2"
      ></v-img>
      <v-card
      class="mx-auto col-sm-8 col-md-6 col-lg-5  col-xl-4"
      >
        <v-card-title>
          Авторизация
        </v-card-title>
        <v-card-text>
          <v-text-field
              label="Login"
              placeholder="Enter Login..."
              prepend-icon="mdi-account"
          ></v-text-field>
          <v-text-field
              label="Password"
              placeholder="Enter Password..."
              prepend-icon="mdi-lock"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
          >Sign In</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>

export default {
  data() {
    return {
      Logo: require('@/assets/images/Original Logo.svg')
    }
  }
}
</script>