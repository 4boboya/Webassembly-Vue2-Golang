<template>
  <div class="sidebar">
    <perfect-scrollbar>
      <div class="nav">
        <b-nav-item
          :class="active == item.path ? 'itemActive' : ''"
          v-for="(item, index) in MemberCtrlItem"
          :key="index"
          @click="
            active = item.path;
            $page.GoToPage(`/account/${item.path}`);
            Width < BreakPoint.md ? UpdateMemberSideBarStatus(false) : '';
          "
        >
          <div
            class="itemText"
            :class="active == item.path ? 'textActive' : ''"
          >
            <icon :icon="item.icon" class="fa-lg" />
            <span class="sideText">
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
  height: calc(100vh - 60px);
  width: 200px;
  position: fixed;
  transition: margin-left 0.5s ease;
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
import MemberCtrl from "@/config/components/MemberSidebar";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      active: null,
    };
  },
  computed: {
    MemberCtrlItem() {
      return MemberCtrl.MemberCtrlItem();
    },
    ...mapState("Render", ["Width", "BreakPoint"]),
  },
  created() {
    this.active = this.$route.path.slice(9);
  },
  methods: {...mapMutations("Render", ["UpdateMemberSideBarStatus"])},
};
</script>
