import Vue from "vue";
import VueSweetalert2 from 'vue-sweetalert2';
import { i18n } from '@/i18n'
Vue.use(VueSweetalert2);
Vue.use(i18n)
const Msg = new class extends Vue {
    $page = () => import('@/library/global/PageCtrl');
    Alert(MsgCode, icon = null, text = null) {
        return this.$swal({
            title: i18n.t(`MsgCode.${MsgCode}`),
            icon: !icon ? "info" : icon,
            text: text,
            timer: 3000,
            timerProgressBar: true,
        });
    }
    Error(msg) {
        console.clear();
        return this.$swal({
            title: i18n.t(`MsgCode.SystemError`),
            icon: "error",
            text: msg,
            timer: 3000,
            timerProgressBar: true,
        });
    }
};
export default Msg;
