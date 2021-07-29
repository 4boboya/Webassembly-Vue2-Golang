export default {
    namespaced: true,
    state: {
        SideBarStatus: false, //Sidebar有沒有開
        SideBarSmallStatus: false, //Sidebar變小
        SideBarFontStatus: true, //Sidebar文字
        UserBarStatus: false, //Userbar有沒有開
        AdvBarStatus: false, //Advbar有沒有開
        MemberSideBarStatus: false, //MemberSidebar有沒有開
        GlobalChatStatus: false, //大廳聊天室有沒有開
        Loading: false,
        canCloseAll: false,
        isOpen: [],
        Width: 0,
        GameType: "BK",
        BreakPoint: {
            sm: 576,
            md: 768,
            lg: 992,
            xl: 1200,
            xxl: 1400,
            xxxl: 1700,
        },
    },
    actions: {},
    mutations: {
        UpdateWidth(state, width) {
            state.Width = width
        },
        UpdateSideBarStatus(state, status) {
            if (status !== '') {
                state.SideBarStatus = status
            } else {
                state.SideBarStatus = !state.SideBarStatus
            }
        },
        UpdateSideBarSmallStatus(state, status) {
            state.SideBarSmallStatus = status
        },
        UpdateSideBarFontStatus(state, status) {
            state.SideBarFontStatus = status
        },
        UpdateUserBarStatus(state, status) {
            if (status !== '') {
                state.UserBarStatus = status
            } else {
                state.UserBarStatus = !state.UserBarStatus
            }
        },
        UpdateAdvBarStatus(state, status) {
            if (status !== '') {
                state.AdvBarStatus = status
            } else {
                state.AdvBarStatus = !state.AdvBarStatus
            }
        },
        UpdateMemberSideBarStatus(state, status) {
            if (status !== '') {
                state.MemberSideBarStatus = status
            } else {
                state.MemberSideBarStatus = !state.MemberSideBarStatus
            }
        },
        UpdateGameType(state, status) {
            state.GameType = status
        },
        UpdateLoading(state, status) {
            state.Loading = status
        },
        UpdateisOpen(state, id) {
            if (id == "reset") {
                state.isOpen = []
            } else if (state.isOpen.includes(id)) {
                state.isOpen.splice(state.isOpen.indexOf(id), 1);
            } else {
                state.isOpen.push(id);
            }
        },
        UpdatecanCloseAll(state, status) {
            if (status !== '') {
                state.canCloseAll = status
            } else {
                state.canCloseAll = !state.canCloseAll
            }
        },
        UpdateGlobalChat(state, status) {
            if (status != undefined) {
                state.GlobalChatStatus = status
            } else {
                state.GlobalChatStatus = !state.GlobalChatStatus
            }
        }
    },
    getters: {},
}
