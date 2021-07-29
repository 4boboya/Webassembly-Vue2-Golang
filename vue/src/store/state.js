export const state = {
    // root
    ApiUrl: document.querySelectorAll("meta[name='api-url']")[0].content,
    // root
    // render
    Width: 0,
    GameType: "BK",
    SideBarStatus: false, //Sidebar有沒有開
    SideBarSmallStatus: false, //Sidebar變小
    SideBarFontStatus: true, //Sidebar文字
    UserBarStatus: false, //Userbar有沒有開
    AdvBarStatus: false, //Advbar有沒有開
    MemberSideBarStatus: false, //MemberSidebar有沒有開
    Loading: false,
    canCloseAll: false,
    isOpen: [],
    // render
    // login
    Status: false, //登入狀態
    User: { // 會員資料
        Account: null,
        AddTime: null,
        Finger: null,
        Rank: null,
        Status: null,
        Token: null,
        Name: null,
    },
    Finger: null,
    // login
    // websocket
    LiveGameWSStatus: false,
    HotGameWSStatus: false,
    LiveGameData: [],
    HotGameData: [],
    LiveGameIDMapping: {},
    LiveSiteGameIDMapping: {},
    HotGameIDMapping: {},
    // websocket
    Lang: 'English',
    // language
};
