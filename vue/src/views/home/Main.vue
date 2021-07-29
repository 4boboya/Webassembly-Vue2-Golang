<template>
  <div>
    <div>
      <div class="close" style="display: none">
        <b-button
          variant="info"
          class="m-1 left"
          @click="UpdatecanCloseAll(true)"
          v-show="LiveGameData.length > 0 && tabpage == 'live'"
        >
          Collapse all
        </b-button>
      </div>
      <b-tabs
        v-model="tabIndex"
        ref="my-tabs"
        nav-class="scrollable-tabs-nav"
        content-class="mt-3"
      >
        <b-tab :title="$t('Main.Live')" @click="tabpage = 'live'">
          <MainLive v-if="liveStatus" />
        </b-tab>
        <b-tab
          :title="$t('Main.AnalysisPredictions')"
          @click="tabpage = 'analysis'"
        >
          Analysis & Predictions
        </b-tab>
        <b-tab
          v-if="Width > BreakPoint.md"
          :title="$t('Main.Forums')"
          @click="tabpage = 'forums'"
        >
          <MainForums v-if="forumsStatus" :tabpage="tabpage" />
        </b-tab>
        <b-tab :title="$t('Main.Results')" @click="tabpage = 'results'">
          <MainResult />
        </b-tab>
      </b-tabs>
    </div>
    <!-- <div v-if="Width < BreakPoint.md" style="margin: 15px">
      <MainLive />
    </div> -->
  </div>
</template>

<style lang="css" scoped>
.tabs {
  padding-inline: 20px;
  margin-bottom: 20px;
}
.close {
  margin-top: 26px;
  margin-right: 16px;
}
::v-deep .tab-content {
  margin-top: unset !important;
  background-color: #222629;
  border: 0.1px solid;
  border-color: #222629;
}
::v-deep .nav a {
  color: #a6aaaf;
}
::v-deep .nav-tabs .nav-link.active {
  background-color: #303336 !important;
  border-color: #86c23100 !important;
  color: #fff;
}
::v-deep .nav-link {
  white-space: nowrap;
}
::v-deep .nav-tabs {
  padding: unset;
  padding-top: 30px;
  border-bottom: unset;
}
::v-deep .nav-tabs .nav-link:hover {
  background-color: #282c2f;
  border-color: #707070;
}
::v-deep .scrollable-tabs-nav {
  flex-wrap: nowrap;
  overflow: hidden;
}
.left {
  margin-left: auto !important;
}
</style>

<script>
import { mapState, mapMutations } from "vuex";
import TabsSlide from "@/mixins/TabsSlide";
import WSProccessWithMain from "@/mixins/GameData";
export default {
  data() {
    return {
      liveStatus: false,
      forumsStatus: false,
      resultStatus: false,
      isMouseDown: false,
      startX: null,
      scrollLeft: null,
      navElement: null,
      tabpage: null,
      tabList: ["live", "analysis", "forums", "results"],
      tabIndex: 0,
      liveTimeOut: null,
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
    ...mapState("WebSocket", ["LiveGameData", "LiveGameWSStatus"]),
    urlTabPage() {
      return this.$route.params.tabpage;
    },
  },
  watch: {
    tabpage(newVal, oldVal) {
      if (newVal != oldVal) {
        this.$router
          .push({
            params: {
              ...this.$route.params,
              tabpage: newVal,
            },
          })
          .catch(() => {});
      }
      if (newVal == "live") {
        this.liveStatus = true;
      }
    },
    urlTabPage(newVal, oldVal) {
      this.changeTab(oldVal, newVal);
    },
    LiveGameWSStatus() {
      if (this.LiveGameWSStatus) {
        this.forumsStatus = true;
      }
    },
  },
  mixins: [TabsSlide, WSProccessWithMain],
  async created() {
    if (this.urlTabPage == "live") {
    } else {
      this.$nextTick(() => (this.forumsStatus = true));
    }
    // this.UpdateLoading(true);
    if (this.urlTabPage != this.tabpage || this.tabpage == null) {
      this.changeTab();
    }
  },
  beforeDestroy() {
    this.UpdateisOpen("reset");
  },
  methods: {
    ...mapMutations("Render", [
      "UpdatecanCloseAll",
      "UpdateisOpen",
      "UpdateLoading",
    ]),
    changeTab(from = "init", to = "init") {
      this.tabpage = this.$format.NotNull(this.urlTabPage)
        ? this.urlTabPage
        : "live";
      this.tabIndex = this.tabList.indexOf(this.tabpage);
      if (from == "live") {
        this.liveTimeOut = setTimeout(() => {
          this.liveStatus = false;
          this.deSubscribeToLiveServer();
        }, 30000);
      }
      if (to == "live") {
        clearTimeout(this.liveTimeOut);
      } else if (to == "result") {
        this.resultStatus = false;
      }
    },
  },
};
</script>
