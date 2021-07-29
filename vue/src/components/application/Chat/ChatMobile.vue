<template>
  <div
    class="chat-template"
    :class="chatStatus ? 'chat-cont-open' : 'chat-cont-close'"
  >
    <div v-show="chatStatus">
      <div class="user-count">
        <icon :icon="['fas', 'user-alt']" style="color: #ff0000" />
        {{
          channels["GlobalChannel"] == undefined
            ? 0
            : channels["GlobalChannel"].onlineUsers
        }}
      </div>
      <div class="chat-cont">
        <perfect-scrollbar ref="msgScrollbar">
          <b-row
            class="noRow message msg-mobile"
            v-for="(item, index) in MessageList['GlobalChannel']"
            :key="index"
            align-h="between"
          >
            <b-row class="noRow" style="max-width: calc(100% - 35px)">
              <div class="message-name" v-text="item.username" />
              ：
              <div v-text="item.message" />
            </b-row>
            <div class="message-time">{{ item.time }}</div>
          </b-row>
        </perfect-scrollbar>
      </div>
      <div v-if="Status" class="chat-input">
        <div class="wrapper">
          <b-textarea
            no-resize
            class="input-textarea"
            v-model="input"
            :placeholder="`${$t(`Chat.${textareaPlaceholder}`)} ${
              timerCount == '' ? `` : `(${timerCount}s)`
            }`"
            :disabled="!Status"
            @keydown="msgKeydown($event)"
          />
          <Emoji v-show="Status" v-on:emoji="emoji" />
        </div>
        <b-row align-h="between" style="margin-top: 10px">
          <b-col style="text-align: right">
            <b-button
              size="sm"
              style="background-color: #5c802b"
              :disabled="!Status || !pushMsgActive"
              @click="pushMessage"
            >
              {{ $t("Chat.Submit") }}
            </b-button>
          </b-col>
        </b-row>
      </div>
      <div v-else class="chat-nologin">
        <div class="chat-input-nologin">
          <div style="padding-top: 20px; text-align: center">
            {{ $t("Chat.NoLogin") }}
            <a class="chat-login-tag" @click="$page.GoToPage('/login')">
            {{ $t("Chat.Login") }}
            </a>
            {{ $t("Chat.Or") }}
            <a class="chat-login-tag" @click="$page.GoToPage('/register')">
            {{ $t("Chat.Register") }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-cont {
  width: 94%;
  height: calc(100vh - 275px);
  margin-left: auto;
  margin-right: 6px;
  padding-top: 10px;
  color: #dedede;
}
.chat-template {
  box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 50%);
  transition: all 0.2s ease-in-out;
  background-color: #25292d;
  border-radius: 1%;
}
.chat-cont-close {
  width: 0;
  height: 0;
}
.chat-cont-open {
  width: calc(100vw - 40px);
  height: calc(100vh - 120px);
  margin-top: 15px;
}
</style>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      chatStatus: false,
      input: "",
      textareaPlaceholder: "Enter",
      timer: null,
      timerCount: "",
      pushMsgActive: true,
    };
  },
  computed: {
    ...mapState("Chat", ["MessageList", "channels", "forceUpdate"]),
    ...mapState("Login", ["Status"]),
    ...mapState("Render", ["GlobalChatStatus"]),
  },
  watch: {
    GlobalChatStatus() {
      this.openChat();
    },
    Status() {
      if (!this.Status) {
        this.textareaPlaceholder = "PleaseLogin";
      } else {
        this.textareaPlaceholder = "Enter";
      }
    },
    forceUpdate() {
      if (this.forceUpdate) {
        this.$forceUpdate();
        this.setForceUpdate(false);
      }
      let scroll = this.$refs[`msgScrollbar`].$el;
      var oldHeight = scroll.scrollHeight;
      var contHeight = scroll.offsetHeight;
      if (scroll.scrollTop + contHeight == oldHeight) {
        this.$nextTick(() => {
          scroll.scrollTop = scroll.scrollHeight;
        });
      }
    },
  },
  created() {
    if (!this.Status) {
      this.textareaPlaceholder = "PleaseLogin";
    }
    this.setForceUpdate(false);
  },
  methods: {
    ...mapMutations("Chat", ["setForceUpdate"]),
    openChat() {
      if (this.GlobalChatStatus) {
        setTimeout(() => {
          this.chatStatus = this.GlobalChatStatus;
        }, 300);
      } else {
        this.chatStatus = this.GlobalChatStatus;
      }
    },
    emoji(emoji) {
      this.input += emoji;
    },
    msgKeydown(event) {
      if (!event.shiftKey && event.keyCode == 13) {
        this.pushMessage();
        event.preventDefault();
      }
    },
    pushMessage() {
      if (this.$format.NotNull(this.input) && this.pushMsgActive) {
        this.timerCount = 15;
        this.$emit("sendMsg", this.input);
        this.pushMsgActive = false;
        this.timer = setInterval(() => {
          this.timerCount--;
          if (this.timerCount <= 0) {
            clearInterval(this.timer);
            this.timerCount = "";
            this.pushMsgActive = true;
          }
        }, 1000);
      }
      this.input = "";
    },
  },
};
</script>