<template>
  <v-main>
    <Notifications></Notifications>

    <v-layout class="d-flex align-center justify-center" fill-height>
      <v-form ref="form"
              class="mx-auto col-sm-8 col-md-6 col-lg-5 col-xl-4"
              v-model="valid"
              validation
              @submit.prevent="submit">
        <v-img
            width="300"
            :src="$root.images.OriginalLogo"
            class="mx-auto mb-2"
        ></v-img>
        <v-card>
          <v-card-title>
            Авторизация
          </v-card-title>

          <v-progress-linear
              v-if="loading"
              v-model="progress"
              absolute
              top
              color="primary"
          ></v-progress-linear>

          <v-card-text>
            <v-text-field
                v-model="username"
                label="Login"
                placeholder="Enter Login..."
                prepend-icon="mdi-account"
                :rules="usernameRules"
            ></v-text-field>
            <v-text-field
                v-model="password"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter Password..."
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                :rules="passwordRules"
                @click:append="showPassword = !showPassword"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                type="submit"
                color="primary"
                :disabled="!valid || loading"
                :loading="loading"
            >Войти
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-layout>
  </v-main>
</template>

<script>

import {mapActions, mapGetters} from 'vuex'

export default {
  data() {
    return {
      valid: false,
      username: '',
      password: '',
      showPassword: false,
      usernameRules: [
        v => !!v || 'Поле обязательно для заполнения'
      ],
      passwordRules: [
        v => !!v || 'Поле обязательно для заполнения'
      ],
    }
  },


  computed: {
    ...mapGetters(['loading', 'progress'])
  },


  methods: {
    ...mapActions('login', ['requestLogin']),

    submit() {
      if (this.$refs.form.validate()) {
        let auth_data = {
          grant_type: 'password',
          client_id: process.env.VUE_APP_CLIENT_ID,
          client_secret: process.env.VUE_APP_CLIENT_SECRET,
          username: this.username,
          password: this.password,
          scope: '*',
        };

        this.requestLogin(auth_data);
      }
    }
  }
}
</script>