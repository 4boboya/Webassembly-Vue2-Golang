<template>
  <div style="color: #dedede; min-width: 1350px; font-size: 0.95rem">
    <b-row v-if="showData">
      <b-col style="min-width: 150px; max-width: 250px">
        <br />
        <br />
        <div>{{ LiveGameData[0].gameData[0].team1 }}</div>
        <br />
        <div>{{ LiveGameData[0].gameData[0].team2 }}</div>
      </b-col>
      <b-col style="max-width: 55px">
        <br />
        <br />
        <div>{{ LiveGameData[0].gameData[0].score1 }}</div>
        <br />
        <div>{{ LiveGameData[0].gameData[0].score2 }}</div>
      </b-col>
      <b-col
        style="width:150px;max-width:150px"
        v-for="(item, index) in LiveGameData[0].gameData[0].site"
        :key="index"
      >
        <div style="text-align: center">{{ item.site }}</div>
        <br />
        <div
          v-if="
            LiveGameData[0].gameData[0].site[index].odds[0].spread == '-' &&
            LiveGameData[0].gameData[0].site[index].odds[1].spread == '-' &&
            LiveGameData[0].gameData[0].site[index].odds[2].spread == '-'
          "
          style="padding-top: 18px;text-align:center"
        >
          N/A
        </div>
        <div v-else>
          <div>
            <b-row
              v-if="
                LiveGameData[0].gameData[0].site[index].odds[0].spread != '-'
              "
            >
              <b-col class="haou" cols="5">
                {{ LiveGameData[0].gameData[0].site[index].odds[0].spread }}
              </b-col>
              <b-col class="odds" cols="7">
                {{ LiveGameData[0].gameData[0].site[index].odds[0].odd1 }} /
                {{ LiveGameData[0].gameData[0].site[index].odds[0].odd2 }}
              </b-col>
            </b-row>
            <span style="text-align:center" v-else> N/A </span>
          </div>
          <div>
            <b-row
              v-if="
                LiveGameData[0].gameData[0].site[index].odds[0].spread != '-'
              "
            >
              <b-col class="haou" cols="5">
                {{ LiveGameData[0].gameData[0].site[index].odds[1].spread }}
              </b-col>
              <b-col class="odds" cols="7">
                {{ LiveGameData[0].gameData[0].site[index].odds[1].odd1 }} /
                {{ LiveGameData[0].gameData[0].site[index].odds[1].odd2 }}
              </b-col>
            </b-row>
            <span style="text-align:center" v-else> N/A </span>
          </div>
          <div>
            <b-row
              v-if="
                LiveGameData[0].gameData[0].site[index].odds[0].spread != '-'
              "
            >
              <b-col class="haou" cols="5">
                {{ LiveGameData[0].gameData[0].site[index].odds[2].spread }}
              </b-col>
              <b-col class="odds" cols="7">
                {{ LiveGameData[0].gameData[0].site[index].odds[2].odd1 }} /
                {{ LiveGameData[0].gameData[0].site[index].odds[2].odd2 }}
              </b-col>
            </b-row>
            <span style="text-align:center" v-else> N/A </span>
          </div>
        </div>
      </b-col>
      <b-col style="min-width: 150px">
        <div>Status</div>
        <br />
        <b-row v-if="GameType == 'SC'">
          <div
            v-if="LiveGameData[0].gameData[0].status.status"
            style="width: 15%"
          >
            <div>
              <div>
                <icon :icon="['fas', 'clipboard']" style="color: red" />
                {{ LiveGameData[0].gameData[0].status.HRC }}
              </div>
              <div>
                <icon :icon="['fas', 'clipboard']" style="color: yellow" />
                {{ LiveGameData[0].gameData[0].status.HYC }}
              </div>
            </div>
            <div>
              <div>
                <icon :icon="['fas', 'clipboard']" style="color: red" />
                {{ LiveGameData[0].gameData[0].status.ARC }}
              </div>
              <div>
                <icon :icon="['fas', 'clipboard']" style="color: yellow" />
                {{ LiveGameData[0].gameData[0].status.AYC }}
              </div>
            </div>
          </div>
          <div
            v-if="LiveGameData[0].gameData[0].status.status"
            class="div-table-status-true"
          >
            <div>{{ LiveGameData[0].gameData[0].status.time }}</div>
            <div>{{ LiveGameData[0].gameData[0].status.event }}</div>
          </div>
          <b-col v-else style="margin-top: 20px">N/A</b-col>
        </b-row>
        <div v-else-if="GameType == 'BK'">
          <div
            v-if="!LiveGameData[0].gameData[0].status.status"
            style="margin-top: 20px"
          >
            N/A
          </div>
          <span v-else>
            <div>{{ LiveGameData[0].gameData[0].status.time }}</div>
            <div>{{ LiveGameData[0].gameData[0].status.event }}</div>
            <div>{{ LiveGameData[0].gameData[0].status.team }}</div>
          </span>
        </div>
        <div v-else-if="GameType == 'BS'">
          <div
            v-if="!LiveGameData[0].gameData[0].status.status"
            style="margin-top: 20px"
          >
            N/A
          </div>
          <span v-else>
            <div>{{ LiveGameData[0].gameData[0].status.time }}</div>
            <div>{{ LiveGameData[0].gameData[0].status.event }}</div>
            <div>{{ LiveGameData[0].gameData[0].status.team }}</div>
            <div>{{ LiveGameData[0].gameData[0].status.balls }}</div>
            <div>{{ LiveGameData[0].gameData[0].status.strikes }}</div>
            <div>{{ LiveGameData[0].gameData[0].status.out }}</div>
          </span>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import GameData from "@/mixins/GameData";
import ApiGameData from "@/mixins/ApiGameData";
import * as GameApi from "@/apis/game";
import { mapState } from "vuex";
export default {
  inject: ["gameID"],
  mixins: [GameData, ApiGameData],
  data() {
    return {
      gameData: null,
      showData: false,
    };
  },
  computed: {
    ...mapState("WebSocket", ["LiveGameData"]),
    gameType() {
      return this.$route.params.gametype;
    },
  },
  created() {
    this.getGameData();
  },
  destroyed() {
    this.deSubscribeToLiveServer();
  },
  methods: {
    ...mapMutations("Render", ["UpdateLoading"]),
    async getGameData() {
      await this.LanguageMapping("Live");
      const requestData = { gameType: this.gameType, gameID: this.gameID };
      const liveGameData = await GameApi.OnlyGameData(requestData);
      this.SubscribeToLiveServer();
      if (liveGameData == undefined) {
        this.$msg.Error();
        this.UpdateLoading(false);
      } else if (
        liveGameData.gameLiveDtos != undefined &&
        liveGameData.gameLiveDtos != null
      ) {
        this.proccessGameData(liveGameData, "liveChat");
      }
      this.$nextTick(() => {
        this.showData = true;
        this.$emit("showData", this.showData);
      });
    },
  },
};
</script>