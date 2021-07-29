import VueCookies from "vue-cookies";
import MsgCode from '@/library/application/response/MsgCode';
export default {
    namespaced: true,
    state: {
        Status: false, //登入狀態
        User: { // 會員資料
            Account: null,
            AddTime: null,
            Finger: null,
            Rank: null,
            Status: null,
            Token: null,
            Name: null,
            Site:null,
        },
        Finger: null,
    },
    mutations: {
        setUserFinger(state, finger) {
            state.Finger = finger;
        },
        setUserInfo(state, userInfo) {
            VueCookies.set('user_info', userInfo);
            state.User.Account = userInfo.account == undefined ? userInfo.Account : userInfo.account;
            state.User.AddTime = userInfo.addTime == undefined ? userInfo.AddTime : userInfo.addTime;
            state.User.Finger = userInfo.finger == undefined ? userInfo.Finger : userInfo.finger;
            state.User.Rank = userInfo.rank == undefined ? userInfo.Rank : userInfo.rank;
            state.User.Name = userInfo.userName == undefined ? userInfo.Name : userInfo.userName;
            state.User.Token = userInfo.token == undefined ? userInfo.Token : userInfo.token;
            state.User.Site = userInfo.site == undefined ? userInfo.Site : userInfo.site;
            state.User.Status = MsgCode.Success(userInfo.code == undefined ? userInfo.Code : userInfo.code);
            state.Status = MsgCode.Success(userInfo.code == undefined ? userInfo.Code : userInfo.code);
        },
        changeUserStatus(state, status) {
            state.Status = status;
        }
    },
    getters: {},
    actions: {},
}
