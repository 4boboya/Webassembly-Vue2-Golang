<template>
  <div>
    <div
      class="div-table-content ml-4"
    >
      <div id="row_1" class="mb-4 div-table-title">
        <div v-if="index != 0" >
          <b-button  
            class="live-btn"
            :style="{'color':$format.NotNull(data.liveUrl) ? '#f13737':'#464A4F'}" 
            size="sm"
            @click="ChatServiceStaus ? $router.push(`/liveChat/${GameType}/${data.mainGameID}`) : ''"
          >
            <icon :icon="['fas', 'circle']"/>
            <span style="font-weight:700;letter-spacing: 1px;"> Live</span>
          </b-button>
        </div>
        <b-row v-if="index == 0" style="width: 100%">
          <div style="width: 19%; padding-left: 14px">
            <b-button 
              class="live-btn"
              :style="{'color':$format.NotNull(data.liveUrl) ? '#f13737':'#464A4F'}" 
              size="sm"
              @click="ChatServiceStaus ? $router.push(`/liveChat/${GameType}/${data.mainGameID}`) : ''"
            >
              <icon :icon="['fas', 'circle']" />
              <span style="font-weight:700;letter-spacing: 1px;"> Live</span>
            </b-button>
          </div>
          <div class="div-table-col-row">TWSL</div>
          <div class="div-table-col-row">Bet365</div>
          <div class="div-table-col-row">Bwin</div>
          <div class="div-table-col-row">Ku888</div>
          <div class="div-table-col-row">Betfair</div>
          <div class="div-table-col-row">Pinnacle</div>
          <div class="div-table-col-row">Status</div>
        </b-row>
      </div>
      <b-row class="div-table" id="row_2">
        <div class="div-table-time">
          <div
            v-html="$date.proccessTimeToSimple(data.time)"
            style="margin-top: 7px"
          />
          <icon
            style="margin-left: 8px; cursor: pointer"
            :icon="['fas', 'chart-line']"
            @click="checkImg(data)"
          />
        </div>
        <div style="width: 12%">
          <b-row style="margin: unset">
            <div style="width: 78%">{{ data.team1 }}</div>
            <div style="margin-left: 5px">{{ data.score1 }}</div>
          </b-row>
          <br />
          <b-row style="margin: unset">
            <div style="width: 78%">{{ data.team2 }}</div>
            <div style="margin-left: 5px">{{ data.score2 }}</div>
          </b-row>
        </div>
        <div
          class="div-table-col-row"
          :id="site"
          v-for="(site, index) in Object.keys(siteSort)"
          :key="index"
        >
          <div
            v-if="
              data.site[siteSort[site]].odds[0].spread == '-' &&
              data.site[siteSort[site]].odds[1].spread == '-' &&
              data.site[siteSort[site]].odds[2].spread == '-'
            "
          >
            <div style="margin-top: 19px">N/A</div>
          </div>
          <div v-else>
            <b-row
              v-if="data.site[siteSort[site]].odds[0].spread != '-'"
              align-h="center"
            >
              <b-col class="haou" cols="5">
                {{ data.site[siteSort[site]].odds[0].spread }}
              </b-col>
              <b-col class="odds" cols="6">
                {{
                  `${data.site[siteSort[site]].odds[0].odd1} / ${
                    data.site[siteSort[site]].odds[0].odd2
                  }`
                }}
              </b-col>
            </b-row>
            <div v-else>N/A</div>
            <b-row
              v-if="data.site[siteSort[site]].odds[1].spread != '-'"
              align-h="center"
            >
              <b-col class="haou" cols="5">
                {{ data.site[siteSort[site]].odds[1].spread }}
              </b-col>
              <b-col class="odds" cols="6">
                {{
                  `${data.site[siteSort[site]].odds[1].odd1} / ${
                    data.site[siteSort[site]].odds[1].odd2
                  }`
                }}
              </b-col>
            </b-row>
            <div v-else>N/A</div>
            <b-row
              v-if="data.site[siteSort[site]].odds[2].spread != '-'"
              align-h="center"
            >
              <b-col class="haou" cols="5">
                {{ data.site[siteSort[site]].odds[2].spread }}
              </b-col>
              <b-col class="odds" cols="6">
                {{
                  `${data.site[siteSort[site]].odds[2].odd1} / ${
                    data.site[siteSort[site]].odds[2].odd2
                  }`
                }}
              </b-col>
            </b-row>
            <div v-else>N/A</div>
          </div>
        </div>
        <div class="div-table-col-row">
          <b-row v-if="GameType == 'SC'">
            <div v-if="data.status.status" style="width: 15%">
              <div>
                <div>
                  <icon :icon="['fas', 'clipboard']" style="color: red" />
                  {{ data.status.HRC }}
                </div>
                <div>
                  <icon :icon="['fas', 'clipboard']" style="color: yellow" />
                  {{ data.status.HYC }}
                </div>
              </div>
              <div>
                <div>
                  <icon :icon="['fas', 'clipboard']" style="color: red" />
                  {{ data.status.ARC }}
                </div>
                <div>
                  <icon :icon="['fas', 'clipboard']" style="color: yellow" />
                  {{ data.status.AYC }}
                </div>
              </div>
            </div>
            <div v-if="data.status.status" class="div-table-status-true">
              <div>{{ data.status.time }}</div>
              <div>{{ data.status.event }}</div>
            </div>
            <b-col v-else style="margin-top: 20px">N/A</b-col>
          </b-row>
          <div v-else-if="GameType == 'BK'">
            <div v-if="!data.status.status" style="margin-top: 20px">N/A</div>
            <span v-else>
              <div>{{ data.status.time }}</div>
              <div>{{ data.status.event }}</div>
              <div>{{ data.status.team }}</div>
            </span>
          </div>
          <div v-else-if="GameType == 'BS'">
            <div v-if="!data.status.status" style="margin-top: 20px">N/A</div>
            <span v-else>
              <div>{{ data.status.time }}</div>
              <div>{{ data.status.event }}</div>
              <div>{{ data.status.team }}</div>
              <div>{{ data.status.balls }}</div>
              <div>{{ data.status.strikes }}</div>
              <div>{{ data.status.out }}</div>
            </span>
          </div>
        </div>
      </b-row>
    </div>
  </div>
</template>

<style>
.div-table {
  max-width: 100%;
  text-align: left;
  color: #fff;
}
.div-table-title {
  max-width: 100%;
  text-align: left;
  color: #fff;
  margin-bottom: 0.6rem !important;
}
.div-table-time {
  width: 7%;
  text-align: left;
}
.div-table-content {
  min-width: 1220px;
  padding-bottom: 6px;
  padding-top: 6px;
  padding-left: 12px;
  padding-right: 12px;
  font-size: 0.8rem !important;
  border-bottom: 1px solid rgb(155, 152, 152);
}
.div-table-content:hover {
  background: linear-gradient(90deg, #212528, #171a1c, #212528);
}
.div-table-status-true {
  padding-left: 10px;
  text-align: right;
  width: 85%;
}
.div-table-col-row {
  width: 116px;
  margin-left: 12px;
  margin-right: 10px;
  text-align: center;
}
.div-table-header-line {
  border: 1px solid #f8f9fa;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
}
.live-btn{
    background-color: rgb(34, 38, 41) !important;
    border: unset;
    box-shadow: 1px 1px 1px #00000080;
    border-radius: 12px;
}
/* .viewer-canvas > img {
  width: auto !important;
  position: unset !important;
  margin-inline: auto !important;
} */
</style>

<script>
import { mapState } from "vuex";
import "viewerjs/dist/viewer.css";
import VueViewer from "v-viewer";
import Vue from "vue";
import Live from "@/mixins/Live";
Vue.use(VueViewer);
export default {
  props: ["data", "index"],
  data() {
    return {
      chatStatus: true,
      siteSort: {
        twsl: 0,
        bet365: 1,
        bwin: 2,
        ku888: 3,
        betfair: 4,
        pinnacle: 5,
      },
    };
  },
  mixins: [Live],
  computed: {
    ...mapState("Render", ["GameType"]),
    ...mapState("Chat", ["ChatServiceStaus"]),
  },
};
</script>
