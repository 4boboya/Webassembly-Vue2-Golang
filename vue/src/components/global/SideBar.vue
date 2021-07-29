<template>
  <div
    class="sidebar shadow"
    :style="{
      height:
        Width < BreakPoint.md ? 'calc(100vh - 100px)' : 'calc(100vh - 185px)',
      'margin-top': Width < BreakPoint.md ? '' : '115px',
      width: SideBarSmallStatus ? '60px' : '200px',
    }"
    @mouseover="mouseOverSidebar"
    @mouseleave="mouseLeaveSidebar"
  >
    <perfect-scrollbar>
      <div class="nav">
        <b-nav-item
          :class="GameType == item.type ? 'itemActive' : ''"
          v-for="(item, index) in BallItem"
          :key="index"
          @click="changGameType(item.type)"
        >
          <div class="itemText" :class="active == index ? 'textActive' : ''">
            <icon v-if="item.type != 'TN'" :icon="item.icon" class="fa-lg" />
            <img v-else style="max-width:22px" src="@/assets/gameIcon/tennis.svg" alt="">
            <span v-show="SideBarFontStatus" class="sideText">
              {{ $t(item.text) }}
            </span>
          </div>
        </b-nav-item>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  background-color: #33373a;
  width: 200px;
  position: fixed;
  transition: margin-left 0.5s ease, width 0.2s ease;
}
.sideText {
  padding-left: 8px;
}
.textActive {
  color: #fff !important;
}
.itemActive {
  background-color: #222629 !important;
}
.itemText {
  color: #86c231;
  white-space: nowrap;
}
.shadow {
  box-shadow: 0 0.5rem 2rem rgb(0 0 0 / 35%) !important;
}
.nav {
  padding: unset;
  padding-top: 20px;
  padding-inline-start: unset;
  text-align: left;
}
.nav-item {
  padding-left: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  width: 100%;
}
.nav-item:hover {
  transition: all 0.3s ease-in;
  background-color: #282c2f;
}
</style>

<script>
import { mapState, mapMutations } from "vuex";
import Ball from "@/config/components/GlobalSidebar";

export default {
  data() {
    return {
      active: "BK",
    };
  },
  computed: {
    BallItem() {
      return Ball.BallItem();
    },
    ...mapState("Render", [
      "Width",
      "SideBarStatus",
      "SideBarSmallStatus",
      "SideBarFontStatus",
      "BreakPoint",
      "GameType"
    ]),
  },
  watch: {
    Width() {
      this.changeSidebarSize();
    },
  },
  created() {
    this.changeSidebarSize();
  },
  methods: {
    ...mapMutations("Render", [
      "UpdateSideBarStatus",
      "UpdateGameType",
      "UpdateSideBarSmallStatus",
      "UpdateSideBarFontStatus",
    ]),
    changGameType(gameType) {
      this.active = gameType;
      this.Width < this.BreakPoint.md ? this.UpdateSideBarStatus(false) : "";
      localStorage.setItem('gameType',gameType)
      this.UpdateGameType(gameType);
    },
    changeSidebarSize() {
      if (this.Width >= this.BreakPoint.md) {
        this.UpdateSideBarSmallStatus(true);
        this.UpdateSideBarFontStatus(false);
      } else {
        this.UpdateSideBarSmallStatus(false);
        this.UpdateSideBarFontStatus(true);
      }
    },
    mouseOverSidebar() {
      if (this.Width >= this.BreakPoint.md) {
        this.UpdateSideBarSmallStatus(false);
        this.UpdateSideBarFontStatus(true);
      }
    },
    mouseLeaveSidebar() {
      if (this.Width >= this.BreakPoint.md) {
        this.UpdateSideBarSmallStatus(true);
        this.UpdateSideBarFontStatus(false);
      }
    },
  },
};
</script>
