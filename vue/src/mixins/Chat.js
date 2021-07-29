import Vue from "vue";
import VueSweetalert2 from 'vue-sweetalert2';
import WSChat from '@/library/application/chat/WSChat';
import { WSConfig } from '@/config/library/WebSocketConfig';
import { i18n } from '@/i18n'
import { mapState } from 'vuex';
Vue.use(VueSweetalert2);
Vue.use(i18n)
const Chat = {
    data() {
        return {
            ChatServer: '',
            Username: null,
            HeartBeatTimer: {},
            channelID: null,
            channelConnectStatus: false,
        }
    },
    computed: {
        ...mapState('Login', ['User', 'Status']),
        ...mapState('Chat', ['channels', 'isUpdate', 'GlobalChannel']),
        // channelID() {
        //     let exitis = this.$route.params.id != undefined && this.$route.params.gametype != undefined;
        //     return exitis ? this.$route.params.id : '109765C1B2822C8213F58E795B61AEDF';
        // }
    },
    watch: {
        Status() {
            if (this.Status) {
                this.Username = this.User.Name
            } else {
                this.Username = null
            }
        },
        isUpdate(newValue, oldValue) {
            if (newValue && !oldValue) {
                this.checkConnectionStatus();
            }
        }
    },
    async created() {
        if (this.Status) {
            this.Username = this.User.Name
        }
    },
    methods: {
        async LeaveChannel(channelID) {
            await this.ChatServer.LeaveChannel(channelID);
            window.clearInterval(this.HeartBeatTimer[channelID]);
        },
        checkConnectionStatus() {
            if (this.channels[this.channelID] !== undefined && this.channels[this.channelID]['status'] == true) {
                this.HeartBeat();
                this.HeartBeatTimer[this.channelID] = setInterval(this.HeartBeat, 30 * 1000);
                this.$store.commit('Chat/setUpdateStatus', {status: false, channelID: this.channelID});
            }
        },
        async GetAllChannel() {
            var allChannel = await GameApi.AllChannel()
        },
        async ConnectionToHub() {
            let websocketConnectionStatus = false;
            this.ChatServer = new WSChat();
            await this.ChatServer.ConnectHub(WSConfig.Chat);
            if (this.ChatServer.connectStatus) {
                websocketConnectionStatus =  true;
            } else {
                websocketConnectionStatus =  false;
            }
            this.$store.commit('Chat/setHubConnectionStatus', websocketConnectionStatus);
            return websocketConnectionStatus;
        },
        async SubscribeToChannel(channelID) {
            this.channelID = channelID;
            await this.ChatServer.AddChannel(this.Username, channelID);
            this.HeartBeat();
        },
        SendMessage(msg) {
            if (typeof this.ChatServer == 'object' && this.ChatServer !== null) {
                this.ChatServer.SendMessage(this.channelID, msg)
            }
        },
        HeartBeat() {
            if (typeof this.ChatServer == 'object' && this.ChatServer !== null) {
                this.ChatServer.HeartBeat(this.channelID);
            }
        },
        deSubscribeToChannel() {
            if (typeof this.ChatServer == 'object' && this.ChatServer !== null) {
                this.ChatServer.DeConnection();
                this.$store.commit('Chat/setHubConnectionStatus', false);
            }
        },
    },
};
export default Chat;
