<template>
  <div>
    <MemberNavbar class="nav-bar" />
    <div
      :style="{
        'padding-left': Width >= BreakPoint.md ? '200px' : '0',
      }"
      class="cont-member"
    >
      <smooth-scrollbar>
        <div>
          <router-view class="router-view-member" />
          <Footer />
        </div>
      </smooth-scrollbar>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState("Render", ["Width", "MemberSideBarStatus","BreakPoint"]),
  },
};
</script>
