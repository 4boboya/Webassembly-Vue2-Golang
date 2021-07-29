import Vue from 'vue'
import VueI18n from 'vue-i18n'
import languages from './langs/enus.js';
import VueCookies from "vue-cookies";

Vue.use(VueI18n);

export const i18n = new VueI18n({
    locale: null, // 设置语言环境
    fallbackLocale: null,
    messages: {
        languages
    } // 设置语言环境信息
})

const loadedLanguages = [] // 默認語言

function setI18nLanguage(lang) {
    VueCookies.remove("lang");
    VueCookies.set("lang", lang);
    i18n.locale = VueCookies.get("lang");
    return lang
}


export default function loadLanguageAsync(lang) {
    // 如果語言相同
    if (i18n.locale === lang) {
        return Promise.resolve(setI18nLanguage(lang))
    }
    // 如果語言已加載
    if (loadedLanguages.includes(lang)) {
        return Promise.resolve(setI18nLanguage(lang))
    }
    // 如果語言未加載
    return import(/* webpackChunkName: "lang-[request]" */ `./langs/${lang}.js`).then(
        messages => {
            i18n.setLocaleMessage(lang, messages.default)
            loadedLanguages.push(lang)
            return setI18nLanguage(lang)
        }
    )
}
