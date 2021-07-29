import VueCookies from "vue-cookies";
import MsgCode from '@/library/application/response/MsgCode';
export default {
    namespaced: true,
    state: {
        Lang: 'English',
    },
    actions: {},
    mutations: {
        setLanguage(state, lang) {
            state.Lang = lang;
        }
    },
    getters: {},
}