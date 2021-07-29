<template>
  <div>
    <div style="min-height: calc(100vh - 230px); color: #dedede">
      <b-row align-h="between" class="live-title">
        <div style="width: 20px">
          <icon
            style="cursor: pointer"
            :icon="['fas', 'home']"
            class="fa-sm"
            @click="$page.GoToPage('/')"
          />
        </div>
        <b-col v-if="showTitle" style="padding-left: 7px">
          {{ LiveGameData[0].league }} -
          {{ LiveGameData[0].gameData[0].team1 }} vs
          {{ LiveGameData[0].gameData[0].team2 }}
        </b-col>
      </b-row>
      <div
        v-if="liveStatus"
        style="color: #dedede; background-color: #000; height: 500px"
      >
        影片區
      </div>
      <div v-else class="no-live-cont">
        <div class="no-live-text">目前暫無直播訊號</div>
      </div>
      <b-row class="live-time" align-h="between">
        <b-col v-if="liveStatus"> {{ $t("Chat.LiveDate") }}：2021/07/20 </b-col>
        <b-col style="text-align: right">
          <icon :icon="['fas', 'user-alt']" style="color: #ff0000" />
          {{ channels[gameID] == undefined ? 0 : channels[gameID].onlineUsers }}
        </b-col>
      </b-row>
      <div v-show="Width > 920" class="sp-scroll-x" style="margin: 20px">
        <LiveData v-on:showData="showData" />
      </div>
      <LiveChat v-if="Width <= 920" class="chat-mobile" />
    </div>
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.live-title {
  user-select: none;
  margin-left: unset;
  margin-right: unset;
  margin-block: 10px;
  font-size: 1.1rem;
  padding-left: 7px;
}
.live-time {
  user-select: none;
  padding-inline: 25px;
}
.chat-mobile {
  width: 95% !important;
  margin-inline: auto;
}
.no-live-cont {
  color: #dedede;
  background-color: #000;
  height: 400px;
}
.no-live-text {
  text-align: center;
  padding-top: 198px;
}
</style>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  inject: ["gameID", "url"],
  data() {
    return {
      liveStatus: false,
      showTitle: false,
    };
  },
  computed: {
    ...mapState("Render", ["Width", "Loading", "BreakPoint"]),
    ...mapState("Chat", ["channels", "isChannelforceUpdate"]),
    ...mapState("WebSocket", ["LiveGameData"]),
  },
  watch: {
    isChannelforceUpdate: {
      deep: true,
      immediate: true,
      handler: function () {
        this.$forceUpdate();
        this.setChannelForceUpdate(false);
      },
    },
  },
  mounted() {
    if (this.url != "") {
      this.liveStatus = true;
    }
  },
  methods: {
    ...mapMutations("Chat", ["setChannelForceUpdate"]),
    showData(status) {
      this.showTitle = status;
    },
  },
};
</script>