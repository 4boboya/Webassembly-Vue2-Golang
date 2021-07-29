import router from '@/router';


export default class PageCtrl {
    path = null;
    static GoToPage(target) {
        this.path = router.app.$route.path;
        if (target == this.path) return false;
        router.app.$router.push(target).catch(() => {});
    }
    static RedirectUrl(target) {
        window.location.assign(target);
    }
}
