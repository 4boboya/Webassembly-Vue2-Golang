<template>
  <div>
    <Navbar class="nav-bar" />
    <Schedule class="schedule" v-if="Width >= BreakPoint.md" />
    <AdvBar
      :style="{
        'margin-left': AdvBarStatus ? 'calc(100% - 200px)' : ' 100% ',
      }"
    />
    <div
      :style="{
        'padding-left': Width >= BreakPoint.md ? '60px' : '0',
        'padding-right': Width >= BreakPoint.xxl ? '200px' : '0',
      }"
      class="cont"
    >
      <div class="close">
        <b-button
          v-b-tooltip.hover.lefttop="'Collapse All'"
          variant="info"
          class="m-1 left button-radius"
          @click="UpdatecanCloseAll(true)"
          v-show="LiveGameData.length > 0 && $route.params.tabpage == 'live'"
        >
          <!-- <icon :icon="['fas', 'bars']" class="fa-lg" /> -->
          <img src="@/assets/collapse.png" />
        </b-button>
      </div>
      <smooth-scrollbar>
        <div>
          <router-view class="router-view" />
          <Footer />
        </div>
      </smooth-scrollbar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.schedule {
  margin-top: 100px;
  user-select: none;
}
.close {
  position: absolute;
  z-index: 1;
  right: 217px;
  top: 221px;
  transition: all 0.2s ease;
  opacity: unset;
}
@media screen and (max-width: 1400px) {
  .close {
    right: 16px;
  }
}
@media screen and (max-width: 768px) {
  .close {
    display: none;
  }
}
.button-radius {
  background-color: #17a2b890;
  border-color: #17a2b890;
  border-radius: 50%;
  height: 55px;
  width: 55px;
}
</style>

<script>
import { mapState, mapMutations } from "vuex";
import GameData from "@/mixins/GameData";
import ApiGameData from "@/mixins/ApiGameData";
import * as GameApi from "@/apis/game";

export default {
  data() {
    return {
      gameDataTimeOut: null,
    };
  },
  computed: {
    ...mapState("Render", [
      "Width",
      "SideBarStatus",
      "AdvBarStatus",
      "BreakPoint",
    ]),
    ...mapState("WebSocket", ["HotGameWSStatus", "LiveGameData"]),
    ...mapState("Language", ["Lang"]),
  },
  mixins: [GameData,ApiGameData],
  async created() {
    if (!localStorage.getItem("gameType")) {
      this.UpdateGameType("BK");
    }
    await this.getHotGame();
    await this.SubscribeToHotGame();
    this.gameDataTimeOut = setInterval(async () => {
      this.getHotGame();
    }, 1800000);
  },
  watch: {
    async HotGameWSStatus() {
      if (!this.HotGameWSStatus) {
        this.updateHotGameData([]);
        this.updateHotGameIDMapping([]);
        await this.getHotGame();
        await this.SubscribeToHotGame();
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.gameDataTimeOut);
    this.deSubscribeToHotGame();
    this.updateHotGameData([]);
  },
  methods: {
    ...mapMutations("Render", ["UpdateGameType", "UpdatecanCloseAll"]),
    ...mapMutations("WebSocket", [
      "updateHotGameData",
      "updateHotGameData",
      "changeHotGameStatus",
      "assignObjToHotGameIDMapping",
      "updateHotGameIDMapping",
    ]),
    async getHotGame() {
      // this.GetAllChannel()
      await this.LanguageMapping('Hot');
      const data = await GameApi.HotGame("hotgame");
      const lang = this.LangMapping[this.Lang]
      let hotGameData = {};
      let HotGameData = [];
      let allMapping = []
      this.gameTypeArr.forEach((type)=>{
        allMapping.push(JSON.parse(localStorage.getItem(`langLiveMapping${type}`)))
      })
      if (data != undefined && data.gameDtos != undefined) {
        data.gameDtos.forEach((hotGame, index) => {
          let {gameDate,gameTime,league,team1,team2,score1,score2,siteGameDtos} = hotGame
          let hotGameTime = this.$date.Simplify(
            `${gameDate} &nbsp;${gameTime}`
          );
          this.changeHotGameStatus(true);
          hotGameData = {};
          hotGameData.score = `${score1}-${score2}`;
          hotGameData.time = hotGameTime;
          allMapping.forEach((mapping)=>{
            hotGameData.league = this.undefinedCheck(mapping,league,lang) ? league : mapping.mapping[league][lang];
            hotGameData.team1 = this.undefinedCheck(mapping,team1,lang) ? team1 : mapping.mapping[team1][lang];
            hotGameData.team2 = this.undefinedCheck(mapping,team2,lang) ? team2 : mapping.mapping[team2][lang];
          })
          siteGameDtos.forEach((site) => {
            if (site.site == "bet365.com") {
              hotGameData.gameID = site.gameID;
              this.assignObjToHotGameIDMapping({
                [`${hotGameData.gameID}`]: index,
              });
            }
          });
          HotGameData.push(hotGameData);
        });
        this.updateHotGameData(HotGameData);
      }
    },
    undefinedCheck(mapping,name,lang){
      if (!this.$format.NotNull(mapping) || mapping.mapping[name] == undefined || mapping.mapping[name][lang] == undefined){
        return true
      }
      return false
    }
  },
};
</script>
