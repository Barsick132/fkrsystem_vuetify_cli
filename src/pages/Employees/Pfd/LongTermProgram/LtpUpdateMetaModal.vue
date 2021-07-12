<template>
  <v-dialog
      v-model="getMeta.dialog"
      persistent
      max-width="600px"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Изменение редакции</span>
      </v-card-title>

      <div v-if="getMeta.loading" class="text-center">
        <v-progress-circular
            v-model="getMeta.progress"
            :size="50"
            color="primary"
            indeterminate
        ></v-progress-circular>
      </div>

      <v-card-text v-else>
        <v-form v-if="currentLtpv" ref="form"
                v-model="valid" color="primary" validation>
          <v-container>
            <v-text-field
                v-if="currentLtpv.ltpv_name !== 'Текущая редакция'"
                v-model="ltpv_name"
                label="Наименование редакции"
                placeholder="Введите наименование редакции"
                :rules="ltpvNameRules"
            ></v-text-field>

            <v-list
                v-if="currentLtpv.file_arr.length"
                subheader
                two-line
                flat
            >

              <v-subheader>Удалить файлы</v-subheader>
              <v-divider></v-divider>

              <v-list-item-group
                  v-model="delFiles"
                  multiple
              >

                <v-list-item v-for="file in currentLtpv.file_arr" :key="file.file_id" :value="file.file_id">
                  <template v-slot:default="{ active }">
                    <v-list-item-avatar>
                      <v-icon
                          class="primary"
                          dark
                      >{{ $root.getIconNameByExtension(file.file_extension) }}
                      </v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>{{ file.file_name }}.{{ file.file_extension }}</v-list-item-title>

                      <v-list-item-subtitle>
                        {{ (file.updated_at ? file.updated_at : file.created_at) | filterBeautifulDtLocalFromISO }}
                      </v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-checkbox
                          :input-value="active"
                          color="error"
                          append-icon="mdi-delete"
                      >
                      </v-checkbox>
                    </v-list-item-action>
                  </template>
                </v-list-item>

              </v-list-item-group>

            </v-list>

            <v-subheader>Добавить файлы</v-subheader>
            <v-divider></v-divider>

            <v-file-input
                v-model="addFiles"
                truncate-length="15"
                label="Выписка из ЕГРН (обязательно)"
                placeholder="Выберите файлы"
                prepend-icon="mdi-paperclip"
                accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                            application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                            application/vnd.ms-excel,
                            text/csv,
                            application/csv,
                            text/plain,
                            application/pdf,
                            application/msword"
                hint="Доступны форматы: xlsx, xls, docx, doc, pdf, csv или txt"
                :rules="filesRules"
                multiple
                required
            ></v-file-input>
          </v-container>
        </v-form>
        <div v-else class="text-center">
          <v-progress-circular
              :size="50"
              color="primary"
              indeterminate
          ></v-progress-circular>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="close">Закрыть</v-btn>
        <v-btn color="primary" :disabled="!valid || getMeta.loading" :loading="getMeta.loading" @click="submit">
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex'

export default {
  mounted() {
    this.setMeta({dialog: true});

    if (this.currentLtpv)
      this.ltpv_name = this.currentLtpv.ltpv_name;
  },


  watch: {
    currentLtpv(value) {
      this.ltpv_name = value.ltpv_name;
    },
  },


  data: () => ({
    valid: false,

    ltpv_name: '',
    delFiles: [],
    addFiles: [],

    ltpvNameRules: [
      v => !!v || 'Поле обязательно для заполнения'
    ],
    filesRules: [
      v => {
        if (v.length <= 10) {
          return true;
        } else {
          return 'Нельзя прикрепить больше 10 файлов'
        }
      },
      v => {
        var accept = ["application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel",
          "text/csv", "application/csv", "text/plain", "application/pdf", "application/msword"]
        return !Array.from(v).some(file => !accept.some(type => type === file.type)) || 'Файлы должны соответствовать форматам: xlsx, xls, docx, doc, pdf, csv или txt'
      },
      v => !Array.from(v).some(file => file.size > 200 * 1024 * 1024) || 'Размер файла не может быть больше 200 Мб',
    ],
  }),


  computed: {
    ...mapGetters('Ltp', ['getVersions', 'getMeta']),

    ltpv_id() {
      return parseInt(this.$route.params.id);
    },

    currentLtpv() {
      return this.getVersions.find(ltpv => ltpv.ltpv_id === this.ltpv_id);
    }
  },


  methods: {
    ...mapActions('Ltp', ['requestUpdateMeta']),
    ...mapMutations('Ltp', ['setMeta']),


    close() {
      this.setMeta({dialog: false});
    },


    submit() {
      if (this.$refs.form.validate()) {
        this.requestUpdateMeta({ltpv_id: this.ltpv_id, ltpv_name: this.ltpv_name, file_arr: this.addFiles, del_file_arr: this.delFiles});
      }
    }
  }
}
</script>

<style scoped>

</style>