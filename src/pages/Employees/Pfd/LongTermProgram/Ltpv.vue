<template>
  <div>
    <v-navigation-drawer
        v-model="showFilter"
        app clipped right
    >
      <v-card flat tile>
        <v-card-actions>
          <v-btn color="error" text>Сбросить</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text>Применить</v-btn>
        </v-card-actions>
        <v-card-text>
          <v-text-field
              label="Код МКД"
              placeholder="23456"
              prepend-icon="mdi-barcode"
          ></v-text-field>
        </v-card-text>
      </v-card>
    </v-navigation-drawer>

    <v-main ref="main">
      <Notifications></Notifications>

      <v-app-bar ref="toolbar"
                 absolute
                 elevate-on-scroll
                 scroll-target="#scrolling-techniques-7"
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
      </v-app-bar>

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
          id="scrolling-techniques-7"
          class="overflow-y-auto pt-12"
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
                      <!--                    <td v-if="stp_key===0" :rowspan="getColspan(mkd)">{{ mkd.mkdstate_id }}</td>-->
                      <td v-if="stp_key===0" :rowspan="getColspan(mkd)">{{ mkd.mkd_code }}</td>
                      <td v-if="stp_key===0" :rowspan="getColspan(mkd)">{{ mkd.mun_name }}</td>
                      <td v-if="stp_key===0" :rowspan="getColspan(mkd)">
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
                      <!--                    <td v-if="improg_key===0 && stp_key===0" :rowspan="getColspan(mkd)">{{ mkd.mkdstate_id }}</td>-->
                      <td v-if="improg_key===0 && stp_key===0" :rowspan="getColspan(mkd)">{{ mkd.mkd_code }}</td>
                      <td v-if="improg_key===0 && stp_key===0" :rowspan="getColspan(mkd)">{{ mkd.mun_name }}</td>
                      <td v-if="improg_key===0 && stp_key===0" :rowspan="getColspan(mkd)">
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
    </v-main>

    <v-footer v-if="getMkds" ref="footer" app>
      <v-pagination
          v-model="page"
          :length="Math.ceil(getMkds.count_el / step)"
          total-visible="10"
          @input="inputPage"
      ></v-pagination>
    </v-footer>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
  mounted() {
    this.requestGetMkdInLtpV(this.getRequestBody);

    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    })
  },


  watch: {
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
      filters: [],
      showFilter: true,
      headers: {
        // id: {text: '#'},
        mkd_code: {text: 'Код дома'},
        mun_name: {text: 'ОМС'},
        mkd_address: {text: 'Адрес'},
        stp_period: {text: 'Плановые периоды', minWidth: '9em'},
        wk: {text: 'Виды работы', minWidth: '40em'},
        year: {text: 'Год'},
        date_include_stp: {text: 'Дата вкл. в КП', minWidth: '9em'},
        date_exclusion_stp: {text: 'Дата искл. из КП', minWidth: '9em'},
        date_include_ltp: {text: 'Дата вкл. в ДП', minWidth: '9em'},
        date_exclusion_ltp: {text: 'Дата искл. из ДП', minWidth: '9em'},
        ohcost_amount_planed: {text: 'Затраты плановые', textAlign: 'right'},
        ohcost_amount_contract: {text: 'Затраты по договору', textAlign: 'right'},
        ohcost_amount_acts: {text: 'Затраты по актам', textAlign: 'right'},
      },
      heightScrollArea: 810,
      innerHeight: window.innerHeight
    }
  },


  computed: {
    ...mapGetters('Ltpv', ['getMkds']),
    ...mapGetters(['loading', 'progress']),

    ltpv_id() {
      return parseInt(this.$route.params.id);
    },

    hasOpenedStp() {
      if (!this.getMkds)
        return false;

      return this.getMkds.mkd_arr.some(mkd => {
        return mkd.stp_arr.some(stp => stp.opened);
      })
    },

    page: {
      get() {
        return this.offset / this.step + 1;
      },
      set(page) {
        this.offset = this.step * (page - 1);
      }
    },

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
    ...mapActions('Ltpv', ['requestGetMkdInLtpV']),

    onResize() {
      this.innerHeight = window.innerHeight;

      setTimeout(() => {
        this.heightScrollArea = this.innerHeight;
        this.heightScrollArea -= (this.$vuetify.application.top + this.$vuetify.application.footer);
      }, 0)
    },

    inputPage() {
      this.requestGetMkdInLtpV(this.getRequestBody);
    },

    getColspan(item) {
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


  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
}
</script>

<style scoped>

</style>