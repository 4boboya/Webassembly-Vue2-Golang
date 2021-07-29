import * as signalR from "@aspnet/signalr";
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";
import Format from "@/library/global/Format";
import store from "@/store";

const vuex = store.state.Chat;
export default class WSChat {
    static channelID = null;
    ConnectionObject = null;
    ErrorLog = [];
    HeartBeatTimer = null;
    connectStatus = false;
    addChannelStatus = false;
    onlineMembers = 0;
    async ConnectHub(ServerConfig) {
        //建立設定
        const { server_host } = ServerConfig;
        try {
            this.ConnectionObject = new signalR.HubConnectionBuilder()
                .withHubProtocol(new MessagePackHubProtocol())
                .withUrl(server_host)
                .build(); //設定路由
        } catch (e) {
            this.ErrorLog.push({ line: 26, msg: e });
            return false;
        }
        // 設定連線觸發事件
        this.ConnectionObject.on("ReceiveAddChannel", this.ReceiveAddChannel);
        this.ConnectionObject.on("ReceiveMessage", this.ReceiveMessage);
        this.ConnectionObject.on("ReceiveChannelPopulation", this.ReceiveChannelPopulation);
        let connectStatus = false;
        // 連線
        await this.ConnectionObject
            .start()
            .then(function () {
                connectStatus = true;
            })
            .catch(function (err) {
                // 連接失敗
                this.ErrorLog.push({ line: 43, msg: err });
            });
        this.connectStatus = connectStatus;
        return connectStatus;
    }
    async AddChannel(username, ID) {
        if (this.connectStatus) {
            WSChat.channelID = ID;
            await this.ConnectionObject.invoke("AddChannel", username, ID);
        }
    }
    ReceiveAddChannel(...response) {
        let [channelID, status] = response;
        store.commit('Chat/setChannelStatus', { channelID, status });
    }
    ReceiveMessage(...messages) {
        let [time, username, channelID, message] = messages;
        store.commit('Chat/updateMessage', { time, username, channelID, message });
    }
    ReceiveChannelPopulation(...response) {
        let [channelID, users] = response;
        store.commit('Chat/setChannelOnlineUsers', { channelID, users });
    }
    async LeaveChannel(channelID) {
        window.clearInterval(this.HeartBeatTimer);
        if (this.connectStatus) {
            await this.ConnectionObject.invoke("LeaveChannel", channelID)
            store.commit('Chat/removeIsLeaveChannel', channelID);
        }
    }
    SendMessage(channelID, Msg) {
        this.ConnectionObject.invoke("SendMessage", channelID, Msg);
    }
    HeartBeat(channelID) {
        this.ConnectionObject.invoke("HeartBeat", channelID);
        let unixTime = new Date().getTime();
        store.commit('Chat/setChannelLastHeartBeat', { channelID, unixTime });
    }
    DeConnection() {
        if (this.ConnectionObject != null) this.ConnectionObject.stop();
    }
}
