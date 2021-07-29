<template>
  <div>
    <div>
      <span v-for="(item, index) in LiveGameData" :key="index">
        <b-button class="league-btn" block @click="showCollapse(index)">
          {{ item.league }}
          <icon
            :ref="`iconMobile_${index}`"
            icon="angle-down"
            class="fa-lg angleIcon"
          />
        </b-button>
        <b-collapse :id="`collapseMobile_${index}`">
          <div
            class="gamedata-cont"
            v-for="(item2, index2) in item.gameData"
            :key="index2"
          >
            <b-row style="margin-left: -5px">
              <b-col style="max-width: 10%">
                <b-button  
                  class="live-btn"
                  :style="{'color':$format.NotNull(item2.liveUrl) ? '#f13737':'#464A4F'}" 
                  size="sm"
                  @click="ChatServiceStaus ? $router.push(`/liveChat/${GameType}/${item2.mainGameID}`) : ''"
                >
                  <icon :icon="['fas', 'circle']"/>
                  <span style="font-weight:700;letter-spacing: 1px;"> Live</span>
                </b-button>
              </b-col>
              <b-col style="max-width: 35%" >
                <b-row style="margin: unset">
                  <div v-html="$date.Simplify(item2.time)" />
                  <icon
                    class="odds-trend-icon"
                    :icon="['fas', 'chart-line']"
                    @click="checkImg(item2)"
                  />
                </b-row>
                <b-row style="margin-top: 10px">
                  <b-col style="max-width: 70%">
                    {{ teamNameToShort(item2.team1) }}
                  </b-col>
                  <b-col style="max-width: 30%"> {{ item2.score1 }} </b-col>
                </b-row>
                <br />
                <b-row>
                  <b-col style="max-width: 70%">
                    {{ teamNameToShort(item2.team2) }}
                  </b-col>
                  <b-col style="max-width: 30%"> {{ item2.score2 }} </b-col>
                </b-row>
              </b-col>
              <b-col class="sp-scroll-x gamedata-site-row">
                <b-row class="gamedata-site-col">
                  <div
                    style="min-width: 170px"
                    v-for="(item3, index3) in item2.site"
                    :key="index3"
                  >
                    <div style="text-align: center">
                      <div>{{ item3.site }}</div>
                      <div
                        v-if="
                          item3.odds[0].spread == '-' &&
                          item3.odds[1].spread == '-' &&
                          item3.odds[2].spread == '-'
                        "
                        style="margin-top: 10px"
                      >
                        <div style="margin-top:19px">N/A</div>
                      </div>
                      <div v-else>
                        <div>
                          <b-row
                            v-if="item3.odds[0].spread != '-'"
                            class="oddsRow"
                          >
                            <b-col class="haou">{{
                              item3.odds[0].spread
                            }}</b-col>
                            <b-col class="odds" cols="7">
                              {{
                                `${item3.odds[0].odd1} / ${item3.odds[0].odd2}`
                              }}
                            </b-col>
                          </b-row>
                          <div v-else>N/A</div>
                        </div>
                        <div>
                          <b-row
                            v-if="item3.odds[1].spread != '-'"
                            class="oddsRow"
                          >
                            <b-col class="haou">{{
                              item3.odds[1].spread
                            }}</b-col>
                            <b-col class="odds" cols="7">
                              {{
                                `${item3.odds[1].odd1} / ${item3.odds[1].odd2}`
                              }}
                            </b-col>
                          </b-row>
                          <div v-else>N/A</div>
                        </div>
                        <div>
                          <b-row
                            v-if="item3.odds[1].spread != '-'"
                            class="oddsRow"
                          >
                            <b-col class="haou">{{
                              item3.odds[2].spread
                            }}</b-col>
                            <b-col class="odds" cols="7">
                              {{
                                `${item3.odds[2].odd1} / ${item3.odds[2].odd2}`
                              }}
                            </b-col>
                          </b-row>
                          <div v-else>N/A</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div class="gamedata-status">
                      <div>Status</div>
                      <b-row v-if="GameType == 'SC'" class="statusRow">
                        <div v-if="item2.status.status">
                          <div>
                            <div>
                              <icon
                                :icon="['fas', 'clipboard']"
                                style="color: red"
                              />
                              {{ item2.status.HRC }}
                            </div>
                            <div>
                              <icon
                                :icon="['fas', 'clipboard']"
                                style="color: yellow"
                              />
                              {{ item2.status.HYC }}
                            </div>
                          </div>
                          <div>
                            <div>
                              <icon
                                :icon="['fas', 'clipboard']"
                                style="color: red"
                              />
                              {{ item2.status.ARC }}
                            </div>
                            <div>
                              <icon
                                :icon="['fas', 'clipboard']"
                                style="color: yellow"
                              />
                              {{ item2.status.AYC }}
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="item2.status.status"
                          style="padding-left: 10px"
                        >
                          <div>{{ item2.status.time }}</div>
                          <div>{{ item2.status.event }}</div>
                        </div>
                        <b-col v-else style="margin-top: 20px">N/A</b-col>
                      </b-row>
                      <div v-else-if="GameType == 'BK'">
                        <div
                          v-if="!item2.status.status"
                          style="margin-top: 20px"
                        >
                          N/A
                        </div>
                        <span v-else>
                          <div>{{ item2.status.time }}</div>
                          <div>{{ item2.status.event }}</div>
                          <div>{{ item2.status.team }}</div>
                        </span>
                      </div>
                      <div v-else-if="GameType == 'BS'">
                        <div
                          v-if="!item2.status.status"
                          style="margin-top: 20px"
                        >
                          N/A
                        </div>
                        <span v-else>
                          <div>{{ item2.status.time }}</div>
                          <div>{{ item2.status.event }}</div>
                          <div>{{ item2.status.team }}</div>
                          <div>{{ item2.status.balls }}</div>
                          <div>{{ item2.status.strikes }}</div>
                          <div>{{ item2.status.out }}</div>
                        </span>
                      </div>
                    </div>
                  </div>
                </b-row>
              </b-col>
            </b-row>
          </div>
        </b-collapse>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.league-btn {
  width: 100%;
  text-align: left;
}
.gamedata-cont {
  width: 100%;
  margin-block: 5px;
  border-bottom: 1px solid;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
}
.odds-trend-icon {
  margin-left: 20px;
  margin-top: 5px;
}
.gamedata-site-row {
  max-width: 50%;
  padding-left: unset;
}
.gamedata-site-col {
  min-width: 1200px;
  margin: unset;
}
.gamedata-status {
  text-align: center;
  height: 100%;
}
.tdData {
  max-width: 100%;
}
.ctrlTableBtn {
  border: 1px solid #dee2e6;
  border-radius: unset;
  width: 100%;
}
.oddsRow,
.statusRow {
  width: 100%;
  margin: unset;
}
.table th,
.table td {
  border-top: unset;
  border: 1px solid #dee2e6;
}
.angleIcon {
  position: absolute;
  right: 40px;
  transition: all 0.5s ease;
}
.rotated {
  transform: rotate(180deg);
}
.btn {
  border-radius: unset;
  border-block: 1px solid #86c231;
}
.live-btn{
    background-color: rgb(34, 38, 41) !important;
    border: unset;
    box-shadow: 1px 1px 1px #00000080;
    border-radius: 12px;
}
::before {
  max-width: 30%;
}
.pageSelect {
  display: flex;
  justify-content: center;
  margin-top: 50px;
  //   margin-left: 30px;
}
</style>

<script>
import { mapState } from "vuex";
import Live from "@/mixins/Live";
import "viewerjs/dist/viewer.css";
import VueViewer from "v-viewer";
import Vue from "vue";
Vue.use(VueViewer);
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState("Render", ["GameType", "Width", "Loading"]),
    ...mapState("WebSocket", ["LiveGameData"]),
    ...mapState("Chat", ["ChatServiceStaus"]),
  },
  mixins: [Live],
  watch: {
    Loading() {
      if (!this.Loading) {
        if (this.LiveGameData.length != 0) {
          this.$nextTick(() => {
            this.showCollapse(0);
          });
        }
      }
    },
  },
  methods: {
    showCollapse(id) {
      this.$root.$emit("bv::toggle::collapse", `collapseMobile_${id}`);
      let caret = this.$refs[`iconMobile_${id}`][0];
      caret.classList.toggle("rotated");
    },
    teamNameToShort(teamName) {
      if (teamName.length >= 8) {
        let teamName15 = teamName.substr(8);
        return teamName.replace(teamName15, "...");
      } else {
        return teamName;
      }
    },
  },
};
</script>

