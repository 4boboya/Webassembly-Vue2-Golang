<template>
  <div>
    <div
      v-if="GlobalChatStatus && Width < BreakPoint.md"
      class="backdrop"
      @click="backdrop()"
    />
    <router-view v-if="isRouterAlive" />
    <Loading v-if="Loading" />
    <b-button
      v-if="showChat && ChatServiceStaus"
      class="chat-btn chat"
      :class="chatBtnStatus ? 'chat-open-btn' : ''"
      @click="UpdateGlobalChat()"
    >
      <icon :icon="['fas', 'comments']" class="fa-lg" />
    </b-button>
    <GlobalChat
      v-if="showChat && ChatServiceStaus"
      class="chat chat-cont"
      :class="GlobalChatStatus ? 'chat-open' : ''"
    />
  </div>
</template>

<script>
import finger from "@/library/global/Finger";
import { mapState, mapMutations } from "vuex";
import lazyload from "@/i18n";
import VueCookies from "vue-cookies";
import { HeartBeat } from "@/apis/heartbeat";
import Chat from "@/mixins/Chat.js";
import * as GameApi from "@/apis/game";
export default {
  mixins: [Chat],
  provide() {
    return {
      leave: () => this.leave,
    };
  },
  data() {
    return {
      leave: false,
      isError: false,
      HeartBeatTimer: null,
      isRouterAlive: true,
      chatBtnStatus: false,
      showChat: true,
      noChatList: [
        "/login",
        "/register",
        "/requestPassword",
        "/validate/forgetPassword",
        "/validate/member",
      ],
    };
  },
  computed: {
    ...mapState("Render", [
      "Width",
      "Loading",
      "BreakPoint",
      "GameType",
      "GlobalChatStatus",
    ]),
    ...mapState("Login", ["Finger"]),
    ...mapState("Language", ["Lang"]),
    ...mapState("Chat", ["channels","ChatServiceStaus"]),
    path() {
      return this.$route.path;
    },
  },
  watch: {
    isError() {
      if (this.isError) {
        this.$nextTick(() => {
          this.$auth.LoginTimeout();
          window.clearInterval(this.HeartBeatTimer);
        });
      }
    },
    Lang(n, o) {
      if (o != "English" && this.$route.name == "main") {
        this.reload();
      }
    },
    GlobalChatStatus() {
      this.ctrlChat();
    },
    path() {
      this.UpdateGlobalChat(false)
      if (this.noChatList.includes(this.path)) {
        this.showChat = false;
      } else {
        this.showChat = true;
      }
    },
  },
  beforeCreate() {
    window.onbeforeunload = () => {
      this.leave = true;
    };
  },
  async created() {
    window.addEventListener("resize", this.windowWidth);
    this.windowWidth();
    let lang = !this.$format.NotNull(VueCookies.get("lang"))
      ? "enus"
      : VueCookies.get("lang");
    lazyload(lang);
    this.setLanguage(lang);
    if (this.$format.NotNull(localStorage.getItem("gameType"))) {
      this.UpdateGameType(localStorage.getItem("gameType"));
    }
    var chatStatus = await GameApi.ChatStatus()
    if (chatStatus != undefined){
      this.setChatServiceStaus(this.$code.Success(chatStatus.code))
    }
  },
  async mounted() {
    finger.Create();
    this.CallHeartBeat();
    window.top.success = true;
  },
  beforeDestroy() {
    window.clearInterval(this.HeartBeatTimer);
    window.top.success = false;
  },
  methods: {
    ...mapMutations("Render", [
      "UpdateWidth",
      "UpdateGameType",
      "UpdateGlobalChat",
    ]),
    ...mapMutations("Language", ["setLanguage"]),
    ...mapMutations("Chat", ["setChatServiceStaus"]),
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
        this.$nextTick(() => {
          this.UpdateGameType(localStorage.getItem("gameType"));
        });
      });
      VueCookies.set("lang", this.Lang);
      // location.reload()
    },
    windowWidth() {
      this.UpdateWidth(window.innerWidth);
    },
    CallHeartBeat() {
      // 10分鐘呼叫一次後端，確認伺服器存活
      // 若後端斷線則強制登出
      let res;
      this.HeartBeatTimer = setInterval(async () => {
        res = await HeartBeat();
        if (res != undefined) {
          this.isError = this.$code.Error(res.code);
        }
      }, 60 * 1000 * 10);
    },
    backdrop() {
      this.UpdateGlobalChat(false);
    },
    ctrlChat() {
      if (this.GlobalChatStatus) {
        this.chatBtnStatus = this.GlobalChatStatus;
      } else {
        setTimeout(() => {
          this.chatBtnStatus = this.GlobalChatStatus;
        }, 300);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.chat-btn {
  box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 50%);
  background-color: #25292d !important;
  border-radius: 50% !important;
  width: 55px;
  height: 55px;
  bottom: 10px;
}
.backdrop {
  height: 100vh;
  width: 100vw;
  background-color: #000;
  opacity: 0.5;
  position: fixed;
  z-index: 1000;
  top: 0;
}
@media screen and (max-width: 767px) {
  .chat {
    position: absolute;
    transition: all 0.2s ease-in-out !important;
    right: 20px;
    z-index: 1100;
  }
  .chat-cont {
    top: 70px;
  }
  .chat-close {
    bottom: 40px;
  }
  .chat-open {
    // bottom: calc(100vh - 80px) !important;
    z-index: 1100;
  }
  .chat-open-btn {
    bottom: calc(100% - 80px) !important;
  }
}
@media screen and (min-width: 768px) {
  .chat {
    position: absolute;
    transition: all 0.2s ease-in-out;
    right: 20px;
    // bottom: -538px;
    // bottom: calc(142px - 100vh);
    bottom: clamp(-538px, calc(142px - 100vh), -138px);
    z-index: 999;
  }
  .chat-open {
    bottom: 0px !important;
  }
  .chat-btn {
    display: none;
  }
}
</style>