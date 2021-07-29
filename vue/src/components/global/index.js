import Vue from 'vue';
// -Global components
Vue.component('Navbar', () => import('./Header.vue') );
Vue.component('Sidebar', () => import('./SideBar.vue') );
Vue.component('Userbar', () => import('./UserBar.vue') );
Vue.component('Footer', () => import('./Footer.vue') );
Vue.component('NotFoundData', () => import('./NotFoundData.vue') );
Vue.component('Loading', () => import('./Loading.vue') );
