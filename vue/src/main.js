import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { i18n } from './i18n'
import VueCarousel from 'vue-carousel';
import VueSweetalert2 from 'vue-sweetalert2';
import SmoothScrollbar from 'vue-smooth-scrollbar'
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { EmojiPickerPlugin } from 'vue-emoji-picker'
import Go from './wasm_exec'

// import dev use library
import * as UseLibrary from "@/library/index.js";

// import other library
import './filters'
import './components'
import './styles/app.scss'

Vue.use(VueCarousel);
Vue.use(VueSweetalert2);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(SmoothScrollbar)
Vue.use(PerfectScrollbar)
Vue.use(i18n)
Vue.use(EmojiPickerPlugin)

Vue.component('icon', FontAwesomeIcon)

library.add(fas, far, fab)

Vue.config.productionTip = false
Vue.prototype.$page = UseLibrary.PageCtrl;
Vue.prototype.$request = UseLibrary.Request;
Vue.prototype.$format = UseLibrary.Format;
Vue.prototype.$array = UseLibrary.ArrayTools;
Vue.prototype.$date = UseLibrary.DateTime;
Vue.prototype.$auth = UseLibrary.Auth;
Vue.prototype.$msg = UseLibrary.Msg;
Vue.prototype.$code = UseLibrary.MsgCode;

const go = new Go()
WebAssembly.instantiateStreaming(fetch('main.wasm'), go.importObject).then((res) => {
    go.run(res.instance)
    Vue.prototype.$go = {
        ProccessHA,
        ProccessOU,
    }
})

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')
