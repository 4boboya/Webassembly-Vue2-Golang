<template>
  <div>
    <div class="rwd-content">
      <perfect-scrollbar class="desktop">
        <MainLiveDesktop />
        <NotFoundData v-if="LiveGameData.length == 0" />
      </perfect-scrollbar>
      <div class="mobile">
        <MainLiveMobile v-show="LiveGameData.length != 0" />
        <NotFoundData v-if="LiveGameData.length == 0" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import GameData from "@/mixins/GameData";
import ApiGameData from "@/mixins/ApiGameData";
import GameDataConfig from "@/config/components/GameData";
import * as GameApi from "@/apis/game";
export default {
  mixins: [GameData, ApiGameData],
  data() {
    return {
      gameDataTimeOut: null,
      allChannelID: [],
    };
  },
  computed: {
    ...mapState("WebSocket", ["LiveGameWSStatus", "LiveGameData"]),
    ...mapState("Render", [
      "Width",
      "GameType",
      "canCloseAll",
      "Loading",
      "BreakPoint",
    ]),
    ...mapState("Language", ["Lang"]),
  },
  components: {
    MainLiveDesktop: () =>
      import("@/components/application/main/LiveDesktop.vue"),
    MainLiveMobile: () =>
      import("@/components/application/main/LiveMobile.vue"),
  },
  watch: {
    async GameType() {
      this.UpdateisOpen("reset");
      await this.deSubscribeToLiveServer();
    },
    async LiveGameWSStatus() {
      if (!this.LiveGameWSStatus) {
        this.updateLiveGameData([]);
        this.updateLiveGameIDMapping({});
        await this.getAllChannel();
        await this.getGameData();
        await this.SubscribeToLiveServer();
      }
    },
  },
  async created() {
    await this.getAllChannel();
    await this.getGameData();
    this.gameDataTimeOut = setInterval(async () => {
      await this.getAllChannel();
      this.getGameData();
    }, 600000);
    await this.SubscribeToLiveServer();
  },
  beforeDestroy() {
    clearInterval(this.gameDataTimeOut);
    this.deSubscribeToLiveServer();
    this.UpdateisOpen("reset");
  },
  methods: {
    ...mapMutations("Render", [
      "UpdateGameType",
      "UpdatecanCloseAll",
      "UpdateisOpen",
      "UpdateLoading",
    ]),
    ...mapMutations("WebSocket", [
      "updateLiveGameData",
      "updateLiveGameIDMapping",
      "changeLiveGameStatus",
      "updateSiteGameIDMapping",
    ]),
    async getAllChannel() {
      this.allChannelID = [];
      const allChannel = await GameApi.AllChannel();
      if (allChannel != undefined) {
        allChannel.forEach((item) => {
          this.allChannelID.push(item.channelID);
        });
      }
    },
    async getGameData() {
      this.UpdateLoading(true);
      await this.LanguageMapping("Live");
      const gameType = { gameType: this.GameType };
      const liveGameData = await GameApi.LiveGame(gameType);
      if (liveGameData == undefined) {
        this.$msg.Error();
        this.UpdateLoading(false);
      } else if (
        liveGameData.gameLiveDtos != undefined &&
        liveGameData.gameLiveDtos != null
      ) {
        this.proccessGameData(liveGameData);
      }
      this.changeLiveGameStatus(true);
      this.UpdateLoading(false);
    },
    // proccessGameData(liveGameData) {
    //   const lang = this.LangMapping[this.Lang];
    //   let mapping = JSON.parse(
    //     localStorage.getItem(`langLiveMapping${this.GameType}`)
    //   );
    //   if (mapping != null && mapping != undefined) {
    //     mapping = mapping.mapping;
    //   } else {
    //     mapping = {};
    //   }
    //   // 遊戲資料 (沒聯盟)、 聯盟清單、 siteGame資料、 要存入vuex的GameData (含聯盟)
    //   let leagueList = [];
    //   let LiveSiteGameIDMapping = [];
    //   let LiveGameData = [];
    //   let { SiteList: siteList } = this;
    //   let InitialGameDataVaribles = (gameDataList) => {
    //     let gameData = {};
    //     gameData.status = this.GameTypeStatus[this.GameType];
    //     gameData.site = this.$format.DeConnection(
    //       GameDataConfig.SiteGameStructure
    //     );
    //     let { gameID, gameDate, gameTime, score1, score2, team1, team2 } =
    //       gameDataList;
    //     gameData.isOpen = this.allChannelID.includes(gameID);
    //     gameData.time = `${gameDate} &nbsp;${gameTime}`;
    //     gameData.mainGameID = gameID;
    //     gameData.score1 = score1;
    //     gameData.score2 = score2;
    //     gameData.team1 =
    //       mapping[team1] == undefined || mapping[team1][lang] == undefined
    //         ? team1
    //         : mapping[team1][lang];
    //     gameData.team2 =
    //       mapping[team2] == undefined || mapping[team2][lang] == undefined
    //         ? team2
    //         : mapping[team2][lang];
    //     return gameData;
    //   };
    //   liveGameData.gameDtos.forEach((gameDataList) => {
    //     if (gameDataList.gameStatus == "Final") {
    //       return;
    //     }
    //     let gameData = InitialGameDataVaribles(gameDataList);
    //     let { league, siteGameDtos } = gameDataList;
    //     league =
    //       mapping[league] == undefined || mapping[league][lang] == undefined
    //         ? league
    //         : mapping[league][lang];
    //     let leagueIndex = leagueList.indexOf(league);
    //     if (leagueIndex == -1) {
    //       //此gamedata的聯盟是否存在
    //       leagueList.push(league);
    //     }
    //     let newLeagueIndex = leagueList.indexOf(league); //取得聯盟 index
    //     siteGameDtos.forEach((siteDataList) => {
    //       let index = siteList.indexOf(siteDataList.site);
    //       if (siteDataList.site == "bet365.com") {
    //         gameData.gameID = siteDataList.gameID;
    //       }
    //       LiveSiteGameIDMapping[siteDataList.gameID] = {
    //         LeagueID: newLeagueIndex,
    //         gameID: gameData.gameID,
    //       };
    //       let spreadTypeHA =
    //         gameDataList.gameStatus == "PreGame" ? "HA" : "RBHA";
    //       let spreadTypeOU =
    //         gameDataList.gameStatus == "PreGame" ? "OU" : "RBOU";
    //       // proccess odds
    //       siteDataList.odds.forEach((odds) => {
    //         if (index == -1) return;
    //         gameData.site[index].siteGameID = siteDataList.gameID;
    //         odds.prices.forEach((prices) => {
    //           if (odds.playMode == spreadTypeHA) {
    //             gameData = this.proccessHA(index, prices, gameData);
    //           } else if (odds.playMode == spreadTypeOU) {
    //             gameData = this.proccessOU(index, prices, gameData);
    //           }
    //         });
    //       });
    //     });
    //     if (leagueIndex != -1) {
    //       LiveGameData[leagueIndex].gameData.push(gameData);
    //     } else {
    //       LiveGameData.push({
    //         league: league,
    //         gameData: [gameData],
    //       });
    //     }
    //   });
    //   this.updateLiveGameData(LiveGameData);
    //   this.updateSiteGameIDMapping(LiveSiteGameIDMapping);
    // },
    // proccessHA(index, prices, gameData) {
    //   let oddsIndex;
    //   if (prices.spread != "1X2") {
    //     //撇出 1X2
    //     if (prices.main) {
    //       //找出 main 為 true的
    //       if (prices.spread.indexOf("-") != 0) {
    //         //如果為正，就是主隊讓分，就存在0
    //         oddsIndex = 0;
    //         if (gameData.site[index].odds[0].spread != "-") {
    //           // 如果0已經有值(OU)，就把OU丟到1，HA存0
    //           gameData.site[index].odds[2].spread =
    //             gameData.site[index].odds[0].spread;
    //           gameData.site[index].odds[2].oddType =
    //             gameData.site[index].odds[0].oddType;
    //         }
    //       } else {
    //         prices.spread = prices.spread.substring(1);
    //         oddsIndex = 2;
    //       }
    //       gameData.site[index].odds[oddsIndex].oddType = "HA";
    //     }
    //   } else {
    //     // 1X2
    //     oddsIndex = 1;
    //     gameData.site[index].odds[oddsIndex].oddType = "1X2";
    //   }
    //   // 保存賠率
    //   if (oddsIndex != undefined) {
    //     prices.odds.forEach((odd) => {
    //       gameData = this.saveOdds(odd, gameData, index, oddsIndex);
    //     });
    //     gameData.site[index].odds[oddsIndex].spread = prices.spread;
    //   }
    //   return gameData;
    // },
    // proccessOU(index, prices, gameData) {
    //   //找出OU
    //   let oddsIndex = 2;
    //   if (prices.main) {
    //     if (gameData.site[index].odds[0].spread == "-") {
    //       // 如果0沒值(HA)，就存到0
    //       oddsIndex = 0;
    //     }
    //     prices.odds.forEach((odd) => {
    //       // 存入賠率
    //       gameData = this.saveOdds(odd, gameData, index, oddsIndex);
    //     });
    //     gameData.site[index].odds[oddsIndex].spread = `o${prices.spread}`;
    //     gameData.site[index].odds[oddsIndex].oddType = "OU";
    //   }
    //   return gameData;
    // },
    // saveOdds(odd, gameData, index, oddsIndex) {
    //   let oddData = "-";
    //   if (odd.odd != -1) {
    //     oddData = odd.odd;
    //   }
    //   if (odd.oddType == "O" || odd.oddType == "H") {
    //     gameData.site[index].odds[oddsIndex].odd1 = oddData;
    //   } else if (odd.oddType == "U" || odd.oddType == "A") {
    //     gameData.site[index].odds[oddsIndex].odd2 = oddData;
    //   }
    //   return gameData;
    // },
  },
};
</script>

<style>
@media screen and (max-width: 768px) {
  .desktop {
    display: none;
  }
  .mobile {
    display: unset;
  }
}
@media screen and (min-width: 769px) {
  .desktop {
    display: unset;
  }
  .mobile {
    display: none;
  }
}
</style>
