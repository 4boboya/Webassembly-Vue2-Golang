<template>
  <div>
    <b-row style="margin-block: 20px">
      <b-col
        style="
          color: #dedede;
          padding-left: 50px;
          margin-block: auto;
          font-weight: 700;
          font-size: 1.75rem;
        "
      >
        {{ $t(gameTypeName) }}
      </b-col>
      <b-col md="8">
        <b-row align-h="end">
          <b-col cols="6" md="4">
            <b-form-select v-model="filterLeague" :options="leagueOptions">
              <template #first>
                <b-form-select-option :value="null" disabled>
                  -- {{ $t("Result.LeagueOptions") }} --
                </b-form-select-option>
              </template>
            </b-form-select>
          </b-col>
          <b-col cols="6" md="4">
            <b-form-datepicker
              v-model="filterDate"
              :date-format-options="{
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              }"
              :locale="local"
              :max="filterDateMax"
              class="mb-2"
            />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-table
      responsive
      striped
      :items="resultData"
      :fields="tableFields"
      :per-page="perPage"
      :current-page="currentPage"
    >
      <template v-slot:head(date)="data">
        {{ $t(data.label) }}
      </template>
      <template v-slot:head(league)="data">
        {{ $t(data.label) }}
      </template>
      <template v-slot:head(team)="data">
        {{ $t(data.label) }}
      </template>
      <template v-slot:head(score)="data">
        {{ $t(data.label) }}
      </template>
    </b-table>
    <b-row align-h="center">
      <b-col cols="7" md="4">
        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="my-table"
        />
      </b-col>
    </b-row>
  </div>
</template>

<style lang="scss" scoped>
::v-deep .table {
  color: #dedede;
}
::v-deep .page-link {
  background-color: #222629 !important;
  border-color: #222629 !important;
  color: #83c92c;
  font-weight: 700 !important;
}
::v-deep .page-item.disabled .page-link {
  background-color: #222629 !important;
  border-color: #222629 !important;
  color: #83c92c;
  font-weight: 700 !important;
}
::v-deep .page-item.active {
  color: #fff !important;
}
::v-deep .b-form-btn-label-control.form-control > .btn {
  color: #fff;
}
::v-deep .form-control {
  background-color: #242c33;
  color: #fff !important;
  border: unset;
}
::v-deep .dropdown-menu {
  background-color: #242c33;
}
::v-deep .text-dark {
  color: #fff !important;
}
::v-deep .btn-outline-light:hover {
  color: #242c33 !important;
}
::v-deep .b-calendar-grid-help {
  display: none;
}
::v-deep .bg-light {
  background-color: unset !important;
}
::v-deep .table.b-table > thead > tr > [aria-sort]:not(.b-table-sort-icon-left),
.table.b-table > tfoot > tr > [aria-sort]:not(.b-table-sort-icon-left) {
  background-image: url("https://www.zbdigital.net/docs/sort/sort.svg") !important;
  // background-color: #dedede;
}
.pagination {
  justify-content: center;
}
.custom-select {
  background-color: #242c33;
  color: #fff !important;
  border: unset;
}
.custom-select:focus {
  box-shadow: 0 0 0 0.2rem #242c3370;
}
</style>

<script>
import { mapState } from "vuex";
import GameData from "@/mixins/GameData";
import ApiGameData from "@/mixins/ApiGameData";
import * as GameApi from "@/apis/game";
export default {
  data() {
    return {
      requestData: {
        gameType: null,
        date: null,
      },
      gameTypeName: "",
      local: null,
      currentPage: 1,
      perPage: 15,
      gameDataTimeOut: null,
      leagueOptions: [],
      filterLeague: null,
      filterDate: null,
      filterDateMax: null,
      resultDataBackup: [],
      resultData: [],
      tableFields: [
        {
          key: "date",
          label: "Result.Date",
          sortable: true,
        },
        {
          key: "league",
          label: "Result.League",
          sortable: true,
        },
        {
          key: "team",
          label: "Result.Team",
        },
        {
          key: "score",
          label: "Result.Score",
        },
      ],
      gameTypeMapping: {
        BK: "Sidebar.Basketball",
        SC: "Sidebar.Soccer",
        BS: "Sidebar.Baseball",
        HL: "Sidebar.IceHockey",
        TN: "Sidebar.Tennis",
      },
    };
  },
  mixins: [GameData,ApiGameData],
  computed: {
    ...mapState("Render", ["GameType"]),
    ...mapState("Language", ["Lang"]),
    rows() {
      return this.resultData.length;
    },
    tabpage() {
      return this.$route.params.tabpage;
    },
  },
  watch: {
    filterDate(nVal, oVal) {
      if (oVal != null) {
        this.setDate();
      }
    },
    filterLeague() {
      this.filter();
    },
    GameType() {
      this.getResultData();
    },
    Lang() {
      this.leagueOptions[this.leagueOptions.length - 1].text =
        this.$t("Result.NoSelect");
      this.setLocal();
    },
    tabpage() {
      if (this.tabpage != "results") {
        this.initialization();
        clearInterval(this.gameDataTimeOut);
      } else {
        this.getResultData();
        this.gameDataTimeOut = setInterval(() => {
          this.getResultData();
        }, 600000);
      }
    },
  },
  created() {
    this.setLocal();
    this.filterDateMax = this.$date.diff_f(0);
    this.requestData.gameType = this.GameType;
    this.filterDate = this.$date.diff_f(0);
    this.setDate("created");
  },
  beforeDestroy() {
    clearInterval(this.gameDataTimeOut);
  },
  methods: {
    async getResultData() {
      this.gameTypeName = this.gameTypeMapping[this.GameType];
      await this.LanguageMapping("Result", this.requestData.date);
      const lang = this.LangMapping[this.Lang];
      let mapping = await JSON.parse(
        localStorage.getItem(`langResultMapping${this.GameType}`)
      );
      if (mapping != null && mapping != undefined) {
        mapping = mapping.mapping;
      } else {
        mapping = {};
      }
      // 初始化
      this.initialization();
      //取資料
      this.requestData.gameType = this.GameType;
      let resultRes = await GameApi.Result(this.requestData);
      let leagueTemp = [];
      if (resultRes != null && resultRes.gameResultData != null) {
        resultRes = resultRes.gameResultData.gameDtos;
        if (resultRes == null) {
          this.resultRes = [];
          resultRes = [];
        }
        resultRes.forEach((resultData) => {
          let resultTemp = {};
          let { gameDate, gameTime, league, team1, team2, score1, score2 } =
            resultData;
          league =
            mapping[league] == undefined || mapping[league][lang] == undefined
              ? league
              : mapping[league][lang];
          team1 =
            mapping[team1] == undefined || mapping[team1][lang] == undefined
              ? team1
              : mapping[team1][lang];
          team2 =
            mapping[team2] == undefined || mapping[team2][lang] == undefined
              ? team2
              : mapping[team2][lang];
          resultTemp.date = `${gameDate} ${gameTime}`;
          resultTemp.league = league;
          resultTemp.team = `${team1} vs ${team2}`;
          resultTemp.score = `${score1} - ${score2}`;
          if (
            leagueTemp.indexOf(league) == -1 &&
            this.$format.NotNull(league)
          ) {
            leagueTemp.push(league);
          }
          this.resultData.push(resultTemp);
        });
        this.resultDataBackup = this.$format.DeConnection(this.resultData);
        //聯盟選單
        leagueTemp.forEach((leagueData) => {
          this.leagueOptions.push({
            value: leagueData,
            text: leagueData,
          });
        });
      }
      if (this.leagueOptions.length > 0) {
        this.leagueOptions.push({
          value: null,
          text: this.$t("Result.NoSelect"),
        });
      }
    },
    initialization() {
      this.resultData = [];
      this.resultDataBackup = [];
      this.leagueOptions = [];
      this.filterLeague = null;
    },
    noSelectOption() {
      this.leagueOptions[this.leagueOptions.length - 1].text =
        this.$t("Result.NoSelect");
    },
    setDate(from) {
      clearInterval(this.gameDataTimeOut);
      if (this.$format.NotNull(sessionStorage.getItem("searchDate"))) {
        if (from == "created") {
          this.filterDate = sessionStorage.getItem(
            "searchDate",
            this.filterDate
          );
        }
      }
      sessionStorage.removeItem("searchDate");
      sessionStorage.setItem("searchDate", this.filterDate);
      this.requestData.date = this.filterDate.replace(/-/gi, "");
      this.getResultData();
      this.gameDataTimeOut = setInterval(() => {
        this.getResultData();
      }, 600000);
    },
    setLocal() {
      const localLang = {
        enus: "en-US",
        jajp: "ja-jp",
        zhtw: "zh-tw",
        zhcn: "zh-cn",
      };
      this.local = localLang[this.Lang];
    },
    filter() {
      this.resultData = this.resultDataBackup;
      if (this.filterLeague != null) {
        this.resultData = this.resultData.filter(
          (result) => result.league == this.filterLeague
        );
      }
    },
  },
};
</script>
