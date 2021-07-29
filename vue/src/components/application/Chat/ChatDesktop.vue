<template>
  <div class="chat-template">
    <b-row class="chat-title" align-h="between" @click="UpdateGlobalChat()">
      <b-col>{{ $t("Chat.Chatroom") }} </b-col>
      <b-col style="text-align: right">
        <icon :icon="['fas', 'user-alt']" style="color: #ff0000" />
        {{
          channels["GlobalChannel"] == undefined
            ? 0
            : channels["GlobalChannel"].onlineUsers
        }}
      </b-col>
    </b-row>
    <div>
      <div class="chat-cont">
        <perfect-scrollbar ref="msgScrollbar">
          <b-row
            class="noRow message msg-desktop"
            v-for="(item, index) in MessageList['GlobalChannel']"
            :key="index"
            align-h="between"
          >
            <b-row class="noRow" style="max-width: 242px">
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
          <b-form-textarea
            no-resize
            class="input-textarea"
            v-model="input"
            :placeholder="`${$t(`Chat.${textareaPlaceholder}`)} ${
              timerCount == '' ? `` : `(${timerCount}s)`
            }`"
            @keydown="msgKeydown($event)"
          />
          <Emoji v-show="Status" v-on:emoji="emoji" />
        </div>
        <div align-h="between" style="margin-top: 10px">
          <div style="text-align: right">
            <b-button
              size="sm"
              style="background-color: #5c802b"
              :disabled="!Status || !pushMsgActive"
              @click="pushMessage"
            >
              {{ $t("Chat.Submit") }}
            </b-button>
          </div>
        </div>
      </div>
      <div v-else class="chat-nologin" style="max-wdith: 320px">
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
.chat-template {
  background-color: #25292d;
  box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 50%);
}
.chat-title {
  user-select: none;
  width: 320px;
  height: 40px;
  padding-top: 7px;
  padding-inline: 10px;
  background-color: #5c802b;
  color: #dedede;
  cursor: pointer;
  margin-right: unset;
  margin-left: unset;
}
.chat-cont {
  width: 90%;
  margin-inline: auto;
  max-height: 400px;
  height: calc(100vh - 280px);
  margin-top: 15px;
  color: #dedede;
}
.input-textarea {
  background-color: #222629;
  height: auto;
}
</style>

<script>
import { mapMutations, mapState } from "vuex";
import Chat from "@/mixins/Chat";
export default {
  mixins: [Chat],
  data() {
    return {
      input: "",
      textareaPlaceholder: "Enter",
      timer: null,
      timerCount: "",
      pushMsgActive: true,
    };
  },
  computed: {
    ...mapState("Login", ["Status"]),
    ...mapState("Chat", ["MessageList", "channels", "forceUpdate"]),
  },
  watch: {
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
  },
  mounted() {
    setTimeout(() => {
      this.$forceUpdate();
    }, 1000);
    this.setForceUpdate(false);
  },
  methods: {
    ...mapMutations("Render", ["UpdateGlobalChat"]),
    ...mapMutations("Chat", ["setForceUpdate"]),
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
