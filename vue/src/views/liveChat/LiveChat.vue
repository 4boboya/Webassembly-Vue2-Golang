<template>
  <div>
    <div style="display: flex; flex-wrap: wrap">
      <smooth-scrollbar>
        <div>
          <LiveCont
            class="live-cont"
            style="height: 100%; transition: width 0.2s ease"
          />
        </div>
      </smooth-scrollbar>
      <LiveChat v-if="Width > 920" style="position: absolute; right: 0" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@media screen and (max-width: 920px) {
  .live-cont {
    width: 100vw;
  }
  .live-chat-desktop {
    display: none;
  }
}
@media screen and (min-width: 921px) {
  .live-cont {
    width: calc(100vw - 350px);
  }
  .live-chat-desktop {
    display: block;
  }
}
.row {
  margin-left: unset;
  margin-right: unset;
}
</style>

<script>
//920
import * as GameApi from "@/apis/game";
import { mapState, mapMutations } from "vuex";
export default {
  provide() {
    return {
      gameID: this.gameID,
      // gameID:'GAyb5s3ZsNU',
      url: "",
    };
  },
  data() {
    return {
      singleChannel: null,
    };
  },
  computed: {
    ...mapState("Render", [
      "Width",
      "GameType",
      "canCloseAll",
      "Loading",
      "BreakPoint",
    ]),
    ...mapState("Chat", ["ChatServiceStaus"]),
    gameID() {
      return this.$route.params.id;
    },
  },
  async created() {
    this.singleChannel = await GameApi.SingleChannel({ gameID: this.gameID });
    if (!this.ChatServiceStaus || this.singleChannel == undefined || this.singleChannel.enabled == 0 ) {
      this.$router.push("/error");
    }else{
      this.url = this.singleChannel.url
    }
  },
};
</script>