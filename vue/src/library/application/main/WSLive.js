
import * as signalR from "@aspnet/signalr";
import Zlib from "zlib";
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";
import store from '@/store';

let state_key = null;
export default class WSLive {
    ConnectionObject = null;
    static ResponseMsg = new String();
    ConnectHub(ServerConfigObject, gtype = "Match", gstatus = "ALL") {
        //建立設定
        const { server_host, invoke_key, state_key: state } = ServerConfigObject;
        state_key = state;
        this.ConnectionObject = new signalR.HubConnectionBuilder()
            .withHubProtocol(new MessagePackHubProtocol())
            .withUrl(server_host)
            .build(); //設定路由
        //開始連線
        this.ConnectionObject.on("ReceiveMessage", this.onReceiveMessage);
        this.ConnectionObject.on("ReceiveGroupMessage", this.onReceiveMessage);
        this.ConnectionObject.onclose(() => {
            store.commit('WebSocket/changeLiveGameStatus', false);
        })
        let conn = this.ConnectionObject;
        this.ConnectionObject
            .start()
            .then(function () {
                conn
                    .invoke("AddGroup", `${gtype}_UI`, invoke_key)
                    .catch(function (err) {
                        return console.error(err.toString());
                    });
                event.preventDefault();
            })
            .catch(function (err) {
                // 連接失敗
                return console.error(err.toString());
            });
    }
    onReceiveMessage(result) {
        WSLive.DeCompress(result);
    }
    DeConnection() {
        if (this.ConnectionObject != null) this.ConnectionObject.stop();
    }
    static DeCompress(message) {
        //Step1.解Base64編碼
        let strData = atob(message);
        //Step2.將base64字串切割為binnary array
        let charData = strData.split('').map((x) => { return x.charCodeAt(0); });
        let binData = new Uint8Array(charData);
        //Step3.前四碼為壓縮前的字串長度,可忽略.
        binData = binData.slice(4);
        try {
            // 解壓縮並decode成字串
            Zlib.gunzip(binData, function (e, b) {
                WSLive.ResponseMsg = b.toString('utf8');
            });
        } catch (e) {
            WSLive.ResponseMsg = "Add group error ,gametype not support.";
        }
    }
}
