import VueCookies from "vue-cookies";

export const mutations = {
    UpdateWidth(state, width) {
        state.Width = width
    },
    UpdateStatus(state, status) {
        state.Status = status;
        state.User.Account = null;
        state.User.AddTime = null;
        state.User.Finger = null;
        state.User.Rank = null;
        state.User.Token = null;
        state.User.Name = null;
        VueCookies.set('user_info', null);
    },
    UpdateSideBarStatus(state, status) {
        if (status != '') {
            state.SideBarStatus = status
        } else {
            state.SideBarStatus = !state.SideBarStatus
        }
    },
    UpdateUserBarStatus(state, status) {
        if (status != '') {
            state.UserBarStatus = status
        } else {
            state.UserBarStatus = !state.UserBarStatus
        }
    },
    UpdateMemberSideBarStatus(state, status) {
        if (status != '') {
            state.MemberSideBarStatus = status
        } else {
            state.MemberSideBarStatus = !state.MemberSideBarStatus
        }
    },
    CreateFinger(state, finger) {
        state.Finger = finger;
    },
    LoginStorage(state, data) {
        state.User.Account = data.account;
        state.User.AddTime = data.addTime;
        state.User.Finger = state.Finger;
        state.User.Rank = data.rank;
        state.Status = true;
        state.User.Token = data.token;
        state.User.Name = data.userName;
        VueCookies.set('user_info', JSON.stringify(data));
    }
};
