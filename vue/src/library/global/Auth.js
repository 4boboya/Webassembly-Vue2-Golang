
import Vue from 'vue'
import VueSweetalert2 from 'vue-sweetalert2';
import store from '@/store'
import PageCtrl from '@/library/global/PageCtrl';
import Request from '@/library/global/Request';
import VueCookies from "vue-cookies";
import MsgCode from "@/library/application/response/MsgCode";
import { TokenCheck } from "@/apis/user";
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use(VueSweetalert2);

export default new class Auth extends Vue {
    UserCtrl(path) {
        if (path == "/LogOut") {
            this.LogOut();
        } else {
            PageCtrl.GoToPage(path);
        }
    }
    LogOut() {
        this.$swal({
            title: "Sign out",
            text: "Confirm whether to wait out",
            icon: "warning",
            showDenyButton: true,
            confirmButtonText: "determine",
            denyButtonText: "cancel",
        }).then((res) => {
            if (res.isConfirmed) {
                store.commit("Login/changeUserStatus", false);
                localStorage.clear();
                sessionStorage.clear();
                VueCookies.keys().forEach((item) => {
                  if (item != "lang") {
                    VueCookies.remove(item);
                  }
                });
                const tab = location.href.split('/')[location.href.split('/').length - 1];
                if (!['live', 'forums', 'results', 'analysis'].includes(tab)) {
                    PageCtrl.GoToPage("/");
                }
            }
        });
    }
    LoginTimeout() {
        store.commit("Login/changeUserStatus", false);
        VueCookies.remove("user_info")
        this.$swal('system', 'The login phase has expired!', 'info')
            .then(() => {
                PageCtrl.GoToPage('/');
            }).catch(() => {
                PageCtrl.GoToPage('/');
            })
    }
    async AuthCheck() {
        const cookie = VueCookies.get("user_info");
        if (cookie != null && cookie != 'null') {
            const postData = {
                token: cookie,
                finger: cookie.finger,
            };
            const tokenCheckResult = await TokenCheck(postData);
            if (tokenCheckResult == undefined || MsgCode.Error(tokenCheckResult.code)) {
                this.LoginTimeout();
            } else {
                store.commit("Login/setUserInfo", cookie);
            }
        }
    }
}
