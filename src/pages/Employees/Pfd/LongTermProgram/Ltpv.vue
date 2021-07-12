<template>
  <div>
    <v-navigation-drawer
        v-model="filter"
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

    <v-main>
      <Notifications></Notifications>

      <v-app-bar dense>
        <v-toolbar-items>
          <v-btn icon @click="$router.push('/pfd/ltp')">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-toolbar-items>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon @click="filter = !filter">
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

      <v-container fluid>

        <v-simple-table dense>
          <template v-slot:default>
            <thead>
            <tr>
              <th v-for="(header, i) in headers" :key="i">{{ header.text }}</th>
            </tr>
            </thead>
            <tbody>
            <template v-for="item in items">
              <template v-for="(period, period_key) in item.periods_arr">
                <template v-if="!period.opened">
                  <tr :key="period_key">
                    <td v-if="period_key===0" :rowspan="getColspan(item)">{{ item.mkdstate_id }}</td>
                    <td v-if="period_key===0" :rowspan="getColspan(item)">{{ item.mkd_code }}</td>
                    <td v-if="period_key===0" :rowspan="getColspan(item)">{{ item.mun_name }}</td>
                    <td v-if="period_key===0" :rowspan="getColspan(item)">
                      <router-link :to="'/mkd/' + item.mkdstate_id">{{ item.mkd_address }}</router-link>
                    </td>
                    <td>{{ period.plan_period }}</td>
                    <td class="light-blue lighten-4 v-chip--clickable" @click="period.opened = !period.opened">
                      {{ period.improgs.map(improg => improg.wk_abbreviations).join(', ') }}
                    </td>
                    <td class="light-blue lighten-4 v-chip--clickable" @click="period.opened = !period.opened">&nbsp;</td>
                    <td class="light-blue lighten-4 v-chip--clickable" @click="period.opened = !period.opened">
                      {{ period.improgs[0].improg_date_include_stp }}
                    </td>
                    <td class="light-blue lighten-4 v-chip--clickable" @click="period.opened = !period.opened">
                      {{ period.improgs[0].improg_date_exclude_stp }}
                    </td>
                    <td class="light-blue lighten-4 v-chip--clickable" @click="period.opened = !period.opened">
                      {{ period.improgs[0].improg_date_include_ltp }}
                    </td>
                    <td class="light-blue lighten-4 v-chip--clickable" @click="period.opened = !period.opened">
                      {{ period.improgs[0].improg_date_exclude_ltp }}
                    </td>
                    <td>{{ period.improg_planed_amount }}</td>
                    <td>{{ period.improg_contract_amount }}</td>
                    <td>{{ period.improg_acts_amount }}</td>
                  </tr>
                </template>
                <template v-else v-for="(improg, improg_key) in period.improgs">
                  <tr :key="improg_key">
                    <td v-if="improg_key===0 && period_key===0" :rowspan="getColspan(item)">{{ item.mkdstate_id }}</td>
                    <td v-if="improg_key===0 && period_key===0" :rowspan="getColspan(item)">{{ item.mkd_code }}</td>
                    <td v-if="improg_key===0 && period_key===0" :rowspan="getColspan(item)">{{ item.mun_name }}</td>
                    <td v-if="improg_key===0 && period_key===0" :rowspan="getColspan(item)">
                      <router-link :to="'/mkd/' + item.mkdstate_id">{{ item.mkd_address }}</router-link>
                    </td>
                    <td v-if="improg_key===0" :rowspan="period.improgs.length">{{ period.plan_period }}</td>
                    <td class="light-blue lighten-4 v-chip--clickable" @click="period.opened = !period.opened">
                      {{ improg.wk_abbreviations }}
                    </td>
                    <td class="light-blue lighten-4 v-chip--clickable" @click="period.opened = !period.opened">
                      {{ improg.improg_year }}
                    </td>
                    <td class="light-blue lighten-4 v-chip--clickable" @click="period.opened = !period.opened">
                      {{ improg.improg_date_include_stp }}
                    </td>
                    <td class="light-blue lighten-4 v-chip--clickable" @click="period.opened = !period.opened">
                      {{ improg.improg_date_exclude_stp }}
                    </td>
                    <td class="light-blue lighten-4 v-chip--clickable" @click="period.opened = !period.opened">
                      {{ improg.improg_date_include_ltp }}
                    </td>
                    <td class="light-blue lighten-4 v-chip--clickable" @click="period.opened = !period.opened">
                      {{ improg.improg_date_exclude_ltp }}
                    </td>
                    <td v-if="improg_key===0" :rowspan="period.improgs.length">{{ period.improg_planed_amount }}</td>
                    <td v-if="improg_key===0" :rowspan="period.improgs.length">{{ period.improg_contract_amount }}</td>
                    <td v-if="improg_key===0" :rowspan="period.improgs.length">{{ period.improg_acts_amount }}</td>
                  </tr>
                </template>
              </template>
            </template>
            </tbody>
          </template>
        </v-simple-table>

      </v-container>
    </v-main>
  </div>
</template>

<script>
export default {
  data() {

    return {
      filter: true,
      headers: [
        {text: '#'},
        {text: 'Код дома'},
        {text: 'ОМС'},
        {text: 'Адрес'},
        {text: 'Плановые периоды'},
        {text: 'Виды работы'},
        {text: 'Год'},
        {text: 'Дата вкл. в КП'},
        {text: 'Дата искл. из КП'},
        {text: 'Дата вкл. в ДП'},
        {text: 'Дата искл. из ДП'},
        {text: 'Затраты плановые'},
        {text: 'Затраты по договору'},
        {text: 'Затраты по актам'},
      ],
      items: [
        {
          mkdstate_id: 1,
          mkd_code: 23456,
          mun_name: 'Липецкий район',
          mkd_address: 'Липецк, ул. Ангарская, 23А',
          periods_arr: [
            {
              opened: false,
              plan_period: '2017-2019',
              improg_planed_amount: 2143455,
              improg_contract_amount: 2143455,
              improg_acts_amount: 2143455,
              improgs: [
                {
                  wk_abbreviations: 'Фундамент',
                  improg_year: 2017,
                  improg_date_include_stp: '26.11.2020',
                  improg_date_exclude_stp: '26.11.2020',
                  improg_date_include_ltp: '26.11.2020',
                  improg_date_exclude_ltp: '26.11.2020',
                },
                {
                  wk_abbreviations: 'Подвал',
                  improg_year: 2017,
                  improg_date_include_stp: '26.11.2020',
                  improg_date_exclude_stp: '26.11.2020',
                  improg_date_include_ltp: '26.11.2020',
                  improg_date_exclude_ltp: '26.11.2020',
                }
              ],
            },
            {
              opened: false,
              plan_period: '2020-2022',
              improg_planed_amount: 2143455,
              improg_contract_amount: 2143455,
              improg_acts_amount: 2143455,
              improgs: [
                {
                  wk_abbreviations: 'Крыша',
                  improg_year: 2020,
                  improg_date_include_stp: '26.11.2020',
                  improg_date_exclude_stp: '26.11.2020',
                  improg_date_include_ltp: '26.11.2020',
                  improg_date_exclude_ltp: '26.11.2020',
                },
                {
                  wk_abbreviations: 'Фасад',
                  improg_year: 2020,
                  improg_date_include_stp: '26.11.2020',
                  improg_date_exclude_stp: '26.11.2020',
                  improg_date_include_ltp: '26.11.2020',
                  improg_date_exclude_ltp: '26.11.2020',
                }
              ],
            }],
        }
      ]
    }
  },


  methods: {
    getColspan(item) {
      var openedPeriod = item.periods_arr.filter(period => period.opened);
      if (openedPeriod.length === 0) {
        return item.periods_arr.length
      }

      var colspan = 0;
      openedPeriod.forEach(period => {
        colspan += period.improgs.length;
      });
      colspan += item.periods_arr.length - openedPeriod.length;
      return colspan;
    }
  }
}
</script>

<style scoped>

</style>