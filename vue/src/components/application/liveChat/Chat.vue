<template>
  <div class="chat-template">
    <div class="chat-title">{{ $t("Chat.Chatroom") }}</div>
    <div class="chat-cont">
      <perfect-scrollbar ref="msgChannelScrollbar">
        <b-row
          class="noRow message"
          v-for="(item, index) in MessageList[gameID]"
          :key="index"
          align-h="between"
        >
          <b-row class="noRow chat-msg">
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
</template>

<style lang="scss" scoped>
.chat-title {
  text-align: center;
  color: #dedede;
  height: 46px;
  padding-top: 10px;
  font-weight: 700;
  font-size: 1.3rem;
}
.chat-template {
  height: calc(100vh - 100px);
  background-color: #25292d;
  width: 350px;
}
.chat-cont {
  width: 90%;
  margin-inline: auto;
  height: calc(100% - 210px);
}
.chat-input {
  width: 90%;
  margin-inline: auto;
  margin-top: 10px;
  border-radius: 10px;
}
@media screen and (max-width: 920px) {
  .chat-msg {
    max-width: calc(100% - 31px);
  }
}
@media screen and (min-width: 921px) {
  .chat-msg {
    max-width: 270px;
  }
}
</style>

<script>
import { mapState, mapMutations } from "vuex";
import Chat from "@/mixins/Chat.js";
export default {
  inject: ["gameID", "leave"],
  mixins: [Chat],
  data() {
    return {
      messageList: [],
      input: "",
      textareaPlaceholder: "Enter",
      timer: null,
      timerCount: "",
      pushMsgActive: true,
    };
  },
  computed: {
    ...mapState("Login", ["Status"]),
    ...mapState("Chat", ["MessageList", "isChannelforceUpdate"]),
    leaveStatus() {
      return this.leave();
    },
  },
  watch: {
    leaveStatus() {
      this.leaveChannel();
    },
    Status() {
      if (!this.Status) {
        this.textareaPlaceholder = "PleaseLogin";
      } else {
        this.textareaPlaceholder = "Enter";
      }
    },
    isChannelforceUpdate: {
      deep: true,
      immediate: true,
      handler: function () {
        this.$forceUpdate();
        this.setChannelForceUpdate(false);
        if (this.$refs[`msgChannelScrollbar`] != undefined) {
          let scroll = this.$refs[`msgChannelScrollbar`].$el;
          var oldHeight = scroll.scrollHeight;
          var contHeight = scroll.offsetHeight;
          if (scroll.scrollTop + contHeight == oldHeight) {
            this.$nextTick(() => {
              scroll.scrollTop = scroll.scrollHeight;
            });
          }
        }
      },
    },
  },
  created() {
    if (!this.Status) {
      this.textareaPlaceholder = "PleaseLogin";
    }
  },
  async mounted() {
    if (!this.HubConnectionStatus) {
      await this.ConnectionToHub();
    }
    if (this.channels[this.gameID] == undefined) {
      await this.SubscribeToChannel(this.gameID);
    }
  },
  destroyed() {
    this.leaveChannel();
  },
  methods: {
    ...mapMutations("Chat", ["setChannelForceUpdate"]),
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
        this.SendMessage(this.input);
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
    async leaveChannel() {
      await this.LeaveChannel(this.gameID);
    },
  },
};
</script>