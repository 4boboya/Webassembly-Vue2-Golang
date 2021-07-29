import Vue from 'vue';

Vue.component('Schedule', () => import('./home/Schedule.vue'));
Vue.component('AdvBar', () => import('./home/AdvBar.vue'));


Vue.component('LoginNavbar', () => import('./login/Header.vue'));

Vue.component('MainLive', () => import('./main/Live.vue'));
Vue.component('MainForums', () => import('./main/Forums.vue'));
Vue.component('MainResult', () => import('./main/Result.vue'));


Vue.component('MemberNavbar', () => import('./member/Header.vue'));
Vue.component('MemberSidebar', () => import('./member/SideBar.vue'));

Vue.component('OtherNavbar', () => import('./other/Header.vue'));

Vue.component('HeaderCtrl', () => import('./subComponents/HeaderCtrl.vue'));
Vue.component('Language', () => import('./subComponents/Language.vue'));

Vue.component('LiveChat', () => import('./liveChat/Chat.vue'));
Vue.component('LiveCont', () => import('./liveChat/Live.vue'));
Vue.component('LiveData', () => import('./liveChat/LiveData.vue'));

Vue.component('GlobalChat', () => import('./Chat/GlobalChat.vue'));
Vue.component('ChatDesktop', () => import('./Chat/ChatDesktop.vue'));
Vue.component('ChatMobile', () => import('./Chat/ChatMobile.vue'));
Vue.component('Emoji', () => import('./Chat/Emoji.vue'));
