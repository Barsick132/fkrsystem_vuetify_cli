<template>
  <div>
    <v-navigation-drawer
        v-model="showFilter"
        app clipped right
    >
      <v-card flat tile>
        <form @submit.prevent="submit" @reset="reset">
          <v-card-actions>
            <v-btn type="reset" color="error" text small>Сбросить</v-btn>
            <v-spacer></v-spacer>
            <v-btn type="submit" color="primary" text small>Применить</v-btn>
          </v-card-actions>
          <v-card-text>
            <v-text-field
                v-model.trim.number="filters.mkd_code"
                type="number"
                label="Код МКД"
                placeholder="23456"
                prepend-icon="mdi-barcode"
                clearable
                dense
                @change="changeMkdCode"
            ></v-text-field>

            <v-subheader>Адрес</v-subheader>

            <v-autocomplete
                v-model="filters.settlement_id"
                :loading="getSettlements.loading"
                :items="getSettlements.data"
                item-value="settlement_id"
                item-text="settlement_name"
                search-input="settlement_id"
                label="Город"
                placeholder="г. Липецк"
                no-data-text="Нет данных"
                prepend-icon="mdi-city"
                hide-selected
                clearable
                dense
                @change="changeSettlement"
            ></v-autocomplete>
            <v-autocomplete
                v-model="filters.street_id"
                :loading="getStreets.loading"
                :items="getStreets.data"
                item-value="street_id"
                item-text="street_name"
                search-input="street_id"
                label="Улица"
                placeholder="ул. Советская"
                no-data-text="Нет данных"
                prepend-icon="mdi-road"
                hide-selected
                clearable
                dense
                :disabled="!filters.settlement_id && filters.settlement_id !== 0"
                @change="changeStreet"
            ></v-autocomplete>
            <v-text-field
                v-model.trim="filters.mkd_home"
                label="Дом"
                placeholder="66"
                prepend-icon="mdi-home"
                clearable
                dense
                :disabled="!filters.street_id && filters.street_id !== 0"
                @change="changeMkdHome"
            ></v-text-field>


            <v-autocomplete
                v-model="filters.mun_id_arr"
                :loading="getMunicipalities.loading"
                :items="getMunicipalities.data"
                item-value="mun_id"
                item-text="mun_name"
                search-input="mun_id"
                label="ОМС"
                placeholder="Воловский район"
                no-data-text="Нет данных"
                multiple
                hide-selected
                clearable
                dense
                small-chips
                outlined
                @change="changeMunicipalities"
            ></v-autocomplete>

            <v-autocomplete
                v-model="filters.stp_id_arr"
                :loading="getStpArr.loading"
                :items="getStpArr.data"
                item-value="stp_id"
                item-text="stp_period"
                search-input="stp_id"
                label="Плановый период"
                placeholder="2020 - 2021"
                no-data-text="Нет данных"
                multiple
                hide-selected
                clearable
                dense
                small-chips
                outlined
                @change="changeStpArr"
            ></v-autocomplete>

            <v-autocomplete
                v-model="filters.wk_id_arr"
                :loading="getWkArr.loading"
                :items="getWkArr.data"
                item-value="wk_id"
                item-text="wk_abbreviation"
                search-input="wk_id"
                label="Вид работ"
                placeholder="Крыша"
                no-data-text="Нет данных"
                multiple
                hide-selected
                clearable
                dense
                small-chips
                outlined
                @change="changeWkArr"
            ></v-autocomplete>

            <v-autocomplete
                v-model="filters.mkd_type_id_arr"
                :loading="getMkdTypeArr.loading"
                :items="getMkdTypeArr.data"
                item-value="tmkd_id"
                item-text="tmkd_name"
                search-input="tmkd_id"
                label="Тип МКД"
                placeholder="Прямоугольный"
                no-data-text="Нет данных"
                multiple
                hide-selected
                clearable
                dense
                small-chips
                outlined
                @change="changeMkdTypeArr"
            ></v-autocomplete>

            <v-autocomplete
                v-model="filters.mas_id_arr"
                :loading="getMasArr.loading"
                :items="getMasArr.data"
                item-value="mas_id"
                item-text="mas_name"
                search-input="mas_id"
                label="Статус"
                placeholder="Аварийный"
                no-data-text="Нет данных"
                multiple
                hide-selected
                clearable
                dense
                small-chips
                outlined
                @change="changeMasArr"
            ></v-autocomplete>

            <v-radio-group v-model="mkd_included_stp"
                           row dense
                           class="mt-0"
                           @change="changeMkdIncludedStp">
              <template v-slot:label>
                <div><strong>Включены</strong> в краткосрочный план</div>
              </template>
              <v-radio :value="1">
                <template v-slot:label>
                  <div><strong class="success--text">Да</strong></div>
                </template>
              </v-radio>
              <v-radio :value="0">
                <template v-slot:label>
                  <div><strong class="error--text">Нет</strong></div>
                </template>
              </v-radio>
              <v-radio :value="2">
                <template v-slot:label>
                  <div>Не важно</div>
                </template>
              </v-radio>
            </v-radio-group>
            <v-radio-group v-model="mkd_excluded_stp"
                           row dense
                           class="mt-0"
                           @change="changeMkdExcludedStp">
              <template v-slot:label>
                <div><strong>Исключены</strong> из краткосрочного плана</div>
              </template>
              <v-radio :value="1">
                <template v-slot:label>
                  <div><strong class="success--text">Да</strong></div>
                </template>
              </v-radio>
              <v-radio :value="0">
                <template v-slot:label>
                  <div><strong class="error--text">Нет</strong></div>
                </template>
              </v-radio>
              <v-radio :value="2">
                <template v-slot:label>
                  <div>Не важно</div>
                </template>
              </v-radio>
            </v-radio-group>
            <v-radio-group v-model="mkd_excluded_ltp"
                           row dense
                           class="mt-0"
                           @change="changeMkdExcludedLtp">
              <template v-slot:label>
                <div><strong>Исключены</strong> из краткосрочного плана</div>
              </template>
              <v-radio :value="1">
                <template v-slot:label>
                  <div><strong class="success--text">Да</strong></div>
                </template>
              </v-radio>
              <v-radio :value="0">
                <template v-slot:label>
                  <div><strong class="error--text">Нет</strong></div>
                </template>
              </v-radio>
              <v-radio :value="2">
                <template v-slot:label>
                  <div>Не важно</div>
                </template>
              </v-radio>
            </v-radio-group>

          </v-card-text>
        </form>
      </v-card>
    </v-navigation-drawer>

    <v-main ref="main">
      <Notifications></Notifications>

      <v-toolbar ref="toolbar"
                 dense>
        <v-toolbar-items>
          <v-btn icon @click="$router.push('/pfd/ltp')">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-toolbar-items>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon @click="showFilter = !showFilter">
            <v-icon>mdi-filter</v-icon>
          </v-btn>

          <v-menu>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item>
                <v-list-item-title>Экспорт ДП</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Экспорт таблицы</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar-items>
      </v-toolbar>

      <v-container v-if="loading" :style="{height: heightScrollArea + 'px'}" fluid>
        <v-row
            class="fill-height"
            align-content="center"
            justify="center"
        >
          <v-col
              class="text-subtitle-1 text-center"
              cols="12"
          >
            Загрузка... Пожалуйста, подождите
          </v-col>
          <v-col cols="6">
            <v-progress-linear
                v-model="progress"
                color="primary"
                height="10"
                value="10"
                striped
            ></v-progress-linear>
          </v-col>
        </v-row>
      </v-container>

      <v-sheet
          v-else
          class="overflow-y-auto"
          :max-height="heightScrollArea + 'px'"
      >
        <v-container fluid>
          <v-simple-table dense>
            <template v-slot:default>
              <thead>
              <tr>
                <template v-for="(header, key) in headers">
                  <th v-if="key !== 'year'|| hasOpenedStp" :style="{minWidth: header.minWidth}" :key="key">{{
                      header.text
                    }}
                  </th>
                </template>
              </tr>
              </thead>
              <!--              <thead v-if="loading">-->
              <!--              <tr class="v-data-table__progress">-->
              <!--                <th :colspan="Object.keys(headers).length" class="column">-->
              <!--                  <v-progress-linear-->
              <!--                      v-model="progress"-->
              <!--                      absolute-->
              <!--                      left-->
              <!--                  ></v-progress-linear>-->
              <!--                </th>-->
              <!--              </tr>-->
              <!--              </thead>-->
              <tbody>
              <!--              <tr v-if="loading" class="v-data-table__empty-wrapper">-->
              <!--                <td :colspan="Object.keys(headers).length">Загрузка... Пожалуйста, подождите</td>-->
              <!--              </tr>-->
              <tr v-if="!getMkds || !getMkds.mkd_arr || getMkds.mkd_arr.length===0"
                  class="v-data-table__empty-wrapper">
                <td :colspan="Object.keys(headers).length">Нет данных</td>
              </tr>
              <template v-else v-for="mkd in getMkds.mkd_arr">
                <template v-for="(stp, stp_key) in mkd.stp_arr">
                  <template v-if="!stp.opened">
                    <tr :key="'mkd' + mkd.mkdstate_id + 'stpv' + stp.stpv_id + 'i'">
                      <!--                    <td v-if="stp_key===0" :rowspan="getRowspan(mkd)">{{ mkd.mkdstate_id }}</td>-->
                      <td v-if="stp_key===0" :rowspan="getRowspan(mkd)">{{ mkd.mkd_code }}</td>
                      <td v-if="stp_key===0" :rowspan="getRowspan(mkd)">{{ mkd.mun_name }}</td>
                      <td v-if="stp_key===0" :rowspan="getRowspan(mkd)">
                        <router-link :to="'/mkd/' + mkd.mkdstate_id">{{ mkd.mkd_address }}</router-link>
                      </td>
                      <td>{{ stp.stp_year_start + ' - ' + stp.stp_year_end }}</td>
                      <td class="v-chip--clickable"
                          @click="stp.opened = !stp.opened">
                        {{ stp.wk_arr.map(improg => improg.wk_abbreviation).join(', ') }}
                      </td>
                      <td v-if="hasOpenedStp" class="v-chip--clickable" @click="stp.opened = !stp.opened">&nbsp;</td>
                      <td class="v-chip--clickable" @click="stp.opened = !stp.opened">
                        {{ stp.wk_arr[0].improg_date_include_stp | filterDtLocalFromISO }}
                      </td>
                      <td class="v-chip--clickable" @click="stp.opened = !stp.opened">
                        {{ stp.wk_arr[0].improg_date_exclusion_stp | filterDtLocalFromISO }}
                      </td>
                      <td class="v-chip--clickable" @click="stp.opened = !stp.opened">
                        {{ stp.wk_arr[0].improg_date_include_ltp | filterDtLocalFromISO }}
                      </td>
                      <td class="v-chip--clickable" @click="stp.opened = !stp.opened">
                        {{ stp.wk_arr[0].improg_date_exclusion_ltp | filterDtLocalFromISO }}
                      </td>
                      <td :style="{textAlign: headers['ohcost_amount_planed'].textAlign}">
                        {{ stp.ohcost_amount_planed | filterMoney }}
                      </td>
                      <td :style="{textAlign: headers['ohcost_amount_contract'].textAlign}">
                        {{ stp.ohcost_amount_contract | filterMoney }}
                      </td>
                      <td :style="{textAlign: headers['ohcost_amount_acts'].textAlign}">
                        {{ stp.ohcost_amount_acts | filterMoney }}
                      </td>
                    </tr>
                  </template>
                  <template v-else v-for="(improg, improg_key) in stp.wk_arr">
                    <tr :key="'mkd' + mkd.mkdstate_id + 'stpv' + stp.stpv_id + 'i' + improg_key">
                      <!--                    <td v-if="improg_key===0 && stp_key===0" :rowspan="getRowspan(mkd)">{{ mkd.mkdstate_id }}</td>-->
                      <td v-if="improg_key===0 && stp_key===0" :rowspan="getRowspan(mkd)">{{ mkd.mkd_code }}</td>
                      <td v-if="improg_key===0 && stp_key===0" :rowspan="getRowspan(mkd)">{{ mkd.mun_name }}</td>
                      <td v-if="improg_key===0 && stp_key===0" :rowspan="getRowspan(mkd)">
                        <router-link :to="'/mkd/' + mkd.mkdstate_id">{{ mkd.mkd_address }}</router-link>
                      </td>
                      <td v-if="improg_key===0" :rowspan="stp.wk_arr.length">
                        {{ stp.stp_year_start + ' - ' + stp.stp_year_end }}
                      </td>
                      <td class="v-chip--clickable" @click="stp.opened = !stp.opened">
                        {{ improg.wk_abbreviation }}
                      </td>
                      <td class="v-chip--clickable" @click="stp.opened = !stp.opened">
                        {{ improg.improg_year }}
                      </td>
                      <td class="v-chip--clickable" @click="stp.opened = !stp.opened">
                        {{ improg.improg_date_include_stp | filterDtLocalFromISO }}
                      </td>
                      <td class="v-chip--clickable" @click="stp.opened = !stp.opened">
                        {{ improg.improg_date_exclusion_stp | filterDtLocalFromISO }}
                      </td>
                      <td class="v-chip--clickable" @click="stp.opened = !stp.opened">
                        {{ improg.improg_date_include_ltp | filterDtLocalFromISO }}
                      </td>
                      <td class="v-chip--clickable" @click="stp.opened = !stp.opened">
                        {{ improg.improg_date_exclusion_ltp | filterDtLocalFromISO }}
                      </td>
                      <td v-if="improg_key===0"
                          :style="{textAlign: headers['ohcost_amount_planed'].textAlign}"
                          :rowspan="stp.wk_arr.length">{{
                          stp.ohcost_amount_planed | filterMoney
                        }}
                      </td>
                      <td v-if="improg_key===0"
                          :style="{textAlign: headers['ohcost_amount_contract'].textAlign}"
                          :rowspan="stp.wk_arr.length">{{
                          stp.ohcost_amount_contract | filterMoney
                        }}
                      </td>
                      <td v-if="improg_key===0"
                          :style="{textAlign: headers['ohcost_amount_acts'].textAlign}"
                          :rowspan="stp.wk_arr.length">{{
                          stp.ohcost_amount_acts | filterMoney
                        }}
                      </td>
                    </tr>
                  </template>
                </template>
              </template>
              </tbody>
            </template>
          </v-simple-table>
        </v-container>
      </v-sheet>

      <v-footer v-if="getMkds" ref="footer" fixed>
        <v-pagination
            v-model="page"
            :length="Math.ceil(getMkds.count_el / step)"
            total-visible="10"
            @input="inputPage"
        ></v-pagination>
      </v-footer>
    </v-main>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
  mounted() {
    // Выполняем запрос МКД в редакции долгосрочной программы и
    // другие запросы получения справочников для фильтрации
    this.requestGetMkdInLtpV(this.getRequestBody);
    this.requestGetAllSettlementsWithFull();
    this.requestGetMunicipalities();
    this.requestGetStpByLtpvId(this.ltpv_id);
    this.requestGetWkArr();
    this.requestGetMkdType();
    this.requestGetMkdAdditionalStatus();

    // Создаем слушатель события изменения размеров окна
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    })
  },


  watch: {
    // Обновление высоты рабочей области
    // после получения перечня МКД
    getMkds(value) {
      if (value) {
        this.onResize();
      }
    }
  },


  data() {

    return {
      step: 100,
      offset: 0,
      filters: {},

      mkd_included_stp: 2,
      mkd_excluded_stp: 2,
      mkd_excluded_ltp: 2,

      showFilter: true,
      headers: {
        // id: {text: '#'},
        mkd_code: {text: 'Код дома'},
        mun_name: {text: 'ОМС'},
        mkd_address: {text: 'Адрес', minWidth: '25em'},
        stp_period: {text: 'Плановые периоды', minWidth: '9em'},
        wk: {text: 'Виды работы', minWidth: '30em'},
        year: {text: 'Год'},
        date_include_stp: {text: 'Дата вкл. в КП', minWidth: '9em'},
        date_exclusion_stp: {text: 'Дата искл. из КП', minWidth: '9em'},
        date_include_ltp: {text: 'Дата вкл. в ДП', minWidth: '9em'},
        date_exclusion_ltp: {text: 'Дата искл. из ДП', minWidth: '9em'},
        ohcost_amount_planed: {text: 'Затраты плановые', textAlign: 'right'},
        ohcost_amount_contract: {text: 'Затраты по договору', textAlign: 'right'},
        ohcost_amount_acts: {text: 'Затраты по актам', textAlign: 'right'},
      },

      heightScrollArea: 810, // высота рабочей области
      innerHeight: window.innerHeight, // высота окна
    }
  },


  computed: {
    ...mapGetters('Ltpv', ['getMkds', 'getStpArr']),
    ...mapGetters('address', ['getMunicipalities', 'getSettlements', 'getStreets']),
    ...mapGetters('catalogs', ['getWkArr', 'getMkdTypeArr', 'getMasArr']),
    ...mapGetters(['loading', 'progress']),

    // Получает ltpv_id из параметров адресной строки
    ltpv_id() {
      return parseInt(this.$route.params.id);
    },


    // Определяет развернута ли строка с плановым периодом
    hasOpenedStp() {
      if (!this.getMkds)
        return false;

      return this.getMkds.mkd_arr.some(mkd => {
        return mkd.stp_arr.some(stp => stp.opened);
      })
    },


    // Калькулятор номера страницы,
    // а также step и offset для запроса
    page: {
      get() {
        return this.offset / this.step + 1;
      },
      set(page) {
        this.offset = this.step * (page - 1);
      }
    },

    // Аккумулятор данных запроса
    getRequestBody() {
      return {
        ltpv_id: this.ltpv_id,
        step: this.step,
        offset: this.offset,
        filters: this.filters,
      }
    },
  },


  methods: {
    ...mapActions('Ltpv', ['requestGetMkdInLtpV', 'requestGetStpByLtpvId']),
    ...mapActions('address', ['requestGetMunicipalities', 'requestGetAllSettlementsWithFull', 'requestGetStreets']),
    ...mapActions('catalogs', ['requestGetWkArr', 'requestGetMkdType', 'requestGetMkdAdditionalStatus']),


    /**
     *
     * Обработчики событий формы
     *
     */
    submit() {
      this.step = 100;
      this.offset = 0;
      this.requestGetMkdInLtpV(this.getRequestBody);
    },

    reset() {
      this.filters = {};

      this.mkd_included_stp = 2;
      this.mkd_excluded_stp = 2;
      this.mkd_excluded_ltp = 2;

      this.submit();
    },


    /**
     *
     * Обработчики для удаления фильтров
     * выпадающих списков
     *
     */
    changeMkdCode() {
      if (!this.filters.mkd_code)
        delete this.filters.mkd_code;
    },
    changeSettlement() {
      if (!this.filters.settlement_id && this.filters.settlement_id !== 0) {
        delete this.filters.settlement_id;
        delete this.filters.street_id;
        delete this.filters.mkd_home;
        return;
      }

      this.requestGetStreets(this.filters.settlement_id);
    },
    changeStreet() {
      if (!this.filters.street_id && this.filters.street_id !== 0) {
        delete this.filters.street_id;
        delete this.filters.mkd_home;
      }
    },
    changeMkdHome() {
      if (!this.filters.mkd_home)
        delete this.filters.mkd_home;
    },
    changeMunicipalities() {
      if (!this.filters.mun_id_arr.length)
        delete this.filters.mun_id_arr;
    },
    changeStpArr() {
      if (!this.filters.stp_id_arr.length)
        delete this.filters.stp_id_arr;
    },
    changeWkArr() {
      if (!this.filters.wk_id_arr.length)
        delete this.filters.wk_id_arr;
    },
    changeMkdTypeArr() {
      if (!this.filters.mkd_type_id_arr.length)
        delete this.filters.mkd_type_id_arr;
    },
    changeMasArr() {
      if (!this.filters.mas_id_arr.length)
        delete this.filters.mas_id_arr;
    },
    changeMkdIncludedStp(item) {
      switch (item) {
        case 0:
          this.filters.mkd_included_stp = false;
          return;
        case 1:
          this.filters.mkd_included_stp = true;
          return;
        default:
          delete this.filters.mkd_included_stp;
      }
    },
    changeMkdExcludedStp(item) {
      switch (item) {
        case 0:
          this.filters.mkd_excluded_stp = false;
          return;
        case 1:
          this.filters.mkd_excluded_stp = true;
          return;
        default:
          delete this.filters.mkd_excluded_stp;
      }
    },
    changeMkdExcludedLtp(item) {
      switch (item) {
        case 0:
          this.filters.mkd_excluded_ltp = false;
          return;
        case 1:
          this.filters.mkd_excluded_ltp = true;
          return;
        default:
          delete this.filters.mkd_excluded_ltp;
      }
    },


    // Обновление высоты рабочей обасти в случае изменения
    // размеров окна
    onResize() {
      this.innerHeight = window.innerHeight;

      this.$nextTick(() => {
        // function calcHeightScrollArea(application) {
        //   if(typeof application.top === 'number') {
        //     console.log('top', application.top);
        //     heightScrollArea -= application.top;
        //   }
        //   else {
        //     console.log('top_obj', application.top[Object.keys(application.top)[0]]);
        //     heightScrollArea -= application.top[Object.keys(application.top)[0]];
        //   }
        //   if(typeof application.footer === 'number') {
        //     console.log('footer', application.footer);
        //     heightScrollArea -= application.footer;
        //   }
        //   else {
        //     console.log('footer_obj', application.footer[Object.keys(application.footer)[0]]);
        //     heightScrollArea -= application.footer[Object.keys(application.footer)[0]];
        //   }
        //
        //   if (application.application)
        //     calcHeightScrollArea(application.application);
        // }
        //
        // let heightScrollArea = this.innerHeight;
        // calcHeightScrollArea(this.$vuetify.application);
        // this.heightScrollArea = heightScrollArea;

        this.heightScrollArea = this.innerHeight;
        this.heightScrollArea -= (this.$refs.toolbar.$el.clientHeight + this.$refs.footer.$el.clientHeight + this.$vuetify.application.top);
      });
    },


    // Запрос данных в случае обновления страницы
    inputPage() {
      this.requestGetMkdInLtpV(this.getRequestBody);
    },


    // Вычисляет нужный rowspan для МКД
    getRowspan(item) {
      var openedStp = item.stp_arr.filter(stp => stp.opened);
      if (openedStp.length === 0) {
        return item.stp_arr.length
      }

      var colspan = 0;
      openedStp.forEach(stp => {
        colspan += stp.wk_arr.length;
      });
      colspan += item.stp_arr.length - openedStp.length;
      return colspan;
    }
  },


  // Уничтожает слушателя resize для window
  // при разрушении компонента
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
}
</script>

<style scoped>

</style>