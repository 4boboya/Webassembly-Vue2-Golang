<template>
  <div class="main">
    <carousel
      :paginationEnabled="false"
      :perPage="Per"
      :navigationEnabled="true"
    >
      <slide v-for="(item, index) in HotGameData" :key="index">
        <b-card no-body>
          <b-card-body class="shadow">
            <div>{{ item.league }}</div>
            <b-row>
              <b-col> {{ teamNameToShort(item.team1)}} </b-col>
              <b-col cols="4">
                <div>{{ item.score }} </div>
                <div v-html="item.time"/>
              </b-col>
              <b-col> {{ teamNameToShort(item.team2) }} </b-col>
            </b-row>
            <b-row>
              <b-col>Analysis</b-col>
              <b-col>Prediction</b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </slide>
      <slide v-if="HotGameData.length <= 0">
        <b-card no-body>
          <b-card-body class="shadow">
            <div>League not found</div>
            <b-row>
              <b-col> team not found </b-col>
              <b-col cols="4"> 0-0 </b-col>
              <b-col> team not found </b-col>
            </b-row>
            <b-row>
              <b-col>not found</b-col>
              <b-col>not found</b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </slide>
    </carousel>
  </div>
</template>

<style lang="scss" scoped>
.main {
  background-color: #464a4f;
  min-height: 115px;
}
.card {
  height: 115px;
  border: unset;
  background-color: #464a4f;
  border-radius: unset;
  font-size: 0.85rem;
}
.card-body {
  padding: unset;
  margin: 1rem;
  background-color: #6a6e71;
  border-radius: 0.25rem;
  color: #c4c6c8;
}
::v-deep .VueCarousel-navigation-prev {
  left: 35px !important;
}
::v-deep .VueCarousel-navigation-next {
  right: 35px !important;
}
::v-deep .VueCarousel-navigation-button {
  color: #fff;
}
</style>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      Per: 4,
    };
  },
  computed: {
    ...mapState('Render',["Width","BreakPoint"]),
    ...mapState("WebSocket", ["HotGameData"]),
  },
  watch: {
    Width() {
      this.perPage();
    },
  },
  created() {
    this.perPage();
  },
  methods: {
    perPage() {
      if (this.Width > this.BreakPoint.xxxl) {
        this.Per = 5;
      } else if (this.Width <= this.BreakPoint.xxxl && this.Width > this.BreakPoint.xxl) {
        this.Per = 4;
      } else if (this.Width <= this.BreakPoint.xxl && this.Width > this.BreakPoint.lg) {
        this.Per = 3;
      } else if (this.Width <= this.BreakPoint.lg && this.Width > this.BreakPoint.md) {
        this.Per = 2;
      } else {
        this.Per = 1;
      }
    },
    teamNameToShort(teamName){
      if (teamName.length >= 10){
        let teamName15 = teamName.substr(10)
        return teamName.replace(teamName15,'...')
      }else{
        return teamName
      }
    }
  },
};
</script>
