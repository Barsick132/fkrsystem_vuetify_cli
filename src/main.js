import Vue from "vue"
import App from "./App.vue"
import {router} from "./router/routes"
import vuetify from "./vuetify"
import store from "./store"
import images from "./images"

// Загрузчик
import './bootstrap'
// Подключение компонентов глобально
import './components'
// Подключение фильтров глобально
import './filters'
// Перечень ошибок
import './errors'
// Кастомные стили
import "./styles/main.sass"


new Vue({
    el: '#app',
    data: () => ({
        images
    }),
    store,
    render: h => h(App),
    router,
    vuetify,
    methods: {
        getIconNameByExtension(file_extension) {
            switch (file_extension) {
                case 'pdf':
                    return 'mdi-file-pdf';
                case 'xls':
                case 'xlsx':
                case 'xml':
                    return 'mdi-file-excel';
                case 'doc':
                case 'docx':
                    return 'mdi-file-word';
                case 'jpeg':
                case 'jpg':
                case 'png' :
                case 'gif':
                    return 'mdi-file-image';
                case 'zip':
                case 'rar':
                    return 'mdi-archive';
                default:
                    return 'mdi-file';
            }
        },
    }
})
