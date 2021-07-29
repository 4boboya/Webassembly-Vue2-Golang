import store from '@/store';
export default new class WordpressMessage {
    ForumService = store.state.Root.ForumService;
    Message = {
        [`loginRequest`]: { event:'/login', type: "changeVuePage"},
        [`registerRequest`]: { event:'/register', type: "changeVuePage"},
        [`changePage`]: { event:'', type: "changeLanguage"},
        [`url`]: { event:'', type: "changeForumsPage"},
        [`404Page`]: { event: this.ForumService, type: "changeForumsPage"},
        [`loginSuccess`]: { event: this.ForumService, type: "changeForumsPage"},
        [`reloadForums`]: { event: '', type: "destoryElement"},
        [`logoutSuccess`]: { event: '', type: "destoryElement"},
        [`loginLoading`]: { event:'', type: "loadingStart"},
        [`clickATag`]: { event:'', type: "loadingStart"},
        [`clickFormTag`]: { event:'', type: "loginCheck"},
        [`clickButtonTag`]: { event:'', type: "loginCheck"},
    }
}
