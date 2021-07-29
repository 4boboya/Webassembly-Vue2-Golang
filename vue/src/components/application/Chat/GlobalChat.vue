<template>
  <div>
    <ChatDesktop v-if="Width >= BreakPoint.md" v-on:sendMsg="sendMsg" />
    <ChatMobile v-if="Width < BreakPoint.md" v-on:sendMsg="sendMsg" />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Chat from "@/mixins/Chat.js";
export default {
  inject: ["leave"],
  mixins: [Chat],
  computed: {
    ...mapState("Render", ["Width", "BreakPoint"]),
    ...mapState("Chat", [
      "GlobalChannel",
      "channels",
      "HubConnectionStatus",
    ]),
    leaveStatus() {
      return this.leave();
    },
  },
  watch: {
    leaveStatus() {
      this.leaveChannel();
    },
  },
  async mounted() {
    if (!this.HubConnectionStatus) {
      await this.ConnectionToHub();
    }
    if (this.channels[this.GlobalChannel] == undefined) {
      await this.SubscribeToChannel(this.GlobalChannel);
    }
  },
  async destroyed() {
    await this.leaveChannel();
    await this.deSubscribeToChannel();
  },
  methods: {
    ...mapMutations("Chat", ["setHubConnectionStatus"]),
    async leaveChannel() {
      await this.LeaveChannel(this.GlobalChannel);
    },
    sendMsg(msg) {
      if (this.$format.NotNull(msg)) {
        this.SendMessage(msg);
      }
    },
  },
};
</script>