export default {
    namespaced: true,
    state: {
        LiveGameWSStatus: false,
        HotGameWSStatus: false,
        LiveGameData: [],
        HotGameData: [],
        LiveGameIDMapping: {},
        LiveSiteGameIDMapping: {},
        HotGameIDMapping: {},
    },
    mutations: {
        changeLiveGameStatus(state, status) {
            state.LiveGameWSStatus = status;
        },
        changeHotGameStatus(state, status) {
            state.HotGameWSStatus = status;
        },
        updateLiveGameData(state, data) {
            state.LiveGameData = data;
        },
        updateHotGameData(state, data) {
            state.HotGameData = data;
        },
        updateLiveGameIDMapping(state, data) {
            state.LiveGameIDMapping = data;
        },
        updateSiteGameIDMapping(state, data) {
            state.LiveSiteGameIDMapping = data;
        },
        updateHotGameIDMapping(state, data) {
            state.HotGameIDMapping = data;
        },
        assignObjToLiveGameIDMapping(state, newObject) {
            Object.assign(state.LiveGameIDMapping, newObject);
        },
        assignObjToSiteGameIDMapping(state, newObject) {
            Object.assign(state.LiveSiteGameIDMapping, newObject);
        },
        assignObjToHotGameIDMapping(state, newObject) {
            Object.assign(state.HotGameIDMapping, newObject);
        }
    },
    getters: {},
    actions: {},
}
