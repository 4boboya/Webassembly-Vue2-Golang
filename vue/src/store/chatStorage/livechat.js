export default {
    namespaced: true,
    state: {
        channels: {},
        isUpdate: false,
        isChannelforceUpdate: false,
        forceUpdate: false,
        updateChannelID: null,
        GlobalChannel: "GlobalChannel",
        HubConnectionStatus: false,
        MessageList: [],
        ChatServiceStaus: true,
    },
    actions: {},
    mutations: {
        setChannelStatus(state, params) {
            let {channelID, status} = params;
            if (state.channels[channelID] == undefined) {
                state.channels[channelID] = {
                    status,
                    onlineUsers: 0,
                    lastHeartBeat: 0,
                };
            }
            state.isUpdate = status;
            state.updateChannelID = channelID;
            if (channelID == state.GlobalChannel) {
                state.forceUpdate = true;
            } else {
                state.isChannelforceUpdate = true;
            }
        },
        setChannelOnlineUsers(state, params) {
            let {channelID, users} = params;
            if (state.channels[channelID] != undefined) {
                state.channels[channelID]['onlineUsers'] = users;
            }
            if (channelID == state.GlobalChannel) {
                state.forceUpdate = true;
            } else {
                state.isChannelforceUpdate = true;
            }
        },
        setChannelLastHeartBeat(state, params) {
            let {channelID, unixTime} = params;
            if (state.channels[channelID] != undefined) state.channels[channelID]['lastHeartBeat'] = unixTime;
            if (channelID == state.GlobalChannel) {
                state.forceUpdate = true;
            } else {
                state.isChannelforceUpdate = true;
            }
        },
        setUpdateStatus(state, params) {
            let {status, updateChannelID} = params;
            if (updateChannelID == state.GlobalChannel) {
                state.isUpdate = status;
            } else {
                state.isChannelUpdate = status;
            }
            state.updateChannelID = updateChannelID;
            if (updateChannelID == state.GlobalChannel) {
                state.forceUpdate = true;
            } else {
                state.isChannelforceUpdate = true;
            }
        },
        setForceUpdate(state, status) {
            state.forceUpdate = status;
        },
        setChannelForceUpdate(state, status) {
            state.isChannelforceUpdate = status;
        },
        removeIsLeaveChannel(state, channelID) {
            delete state.channels[channelID];
            if (channelID == state.GlobalChannel) {
                state.forceUpdate = true;
            } else {
                state.isChannelforceUpdate = true;
            }
        },
        setHubConnectionStatus(state, status) {
            state.HubConnectionStatus = status;
        },
        updateMessage(state, params) {
            let {time, username, channelID, message} = params;
            if (state.MessageList[channelID] == undefined) {
                state.MessageList[channelID] = [];
            }
            state.MessageList[channelID].push({
                message,
                username,
                time,
            });
            if (channelID == state.GlobalChannel) {
                state.forceUpdate = true;
            } else {
                state.isChannelforceUpdate = true;
            }
        },
        setChatServiceStaus(state, status){
            state.ChatServiceStaus = status
        }
    },
    getters: {},
}
