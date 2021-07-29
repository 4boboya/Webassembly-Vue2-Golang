<template>
  <div>
    <div
      v-if="UserBarStatus && Width <= BreakPoint.md"
      class="backdrop mobilebackdropDisplay"
      @click="backDrop"
    />
    <b-navbar class="header desktop-navbar-display">
      <b-navbar-nav style="width: 36%">
        <b-nav-item> {{this.$t('Header.BestDeals')}} </b-nav-item>
        <b-nav-item> {{this.$t('Header.BestExperts')}} </b-nav-item>
      </b-navbar-nav>
      <b-navbar-brand class="LogoImg" @click="$page.GoToPage('/')">
        Logo Img
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <div class="navbarCtrl">
          <b-row
            class="d-flex justify-content-end align-items-center"
            style="height: 65px"
          >
            <b-nav-item-dropdown v-if="Status" right>
              <template #button-content>
                <icon :icon="['fas', 'user']" class="fa-lg" />
                {{ User.Name }}
              </template>
              <b-dropdown-item
                v-for="(item, index) in User_list"
                :key="index"
                @click="$auth.UserCtrl(item.path)"
              >
                <icon :icon="item.icon" class="fa-lg" />
                <span class="dropText">
                  {{ $t(item.text) }}
                </span>
              </b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item v-else to="/login"> {{this.$t('Header.SingIn')}} </b-nav-item>
          </b-row>
          <Header-Ctrl />
        </div>
      </b-navbar-nav>
    </b-navbar>
    <b-navbar class="header mobile-navbar-display">
      <div style="color: #c4c6c8">
        <b-navbar-brand class="LogoImg" @click="$page.GoToPage('/')">
          Logo Img
        </b-navbar-brand>
      </div>
      <div style="color: #c4c6c8" class="ml-auto">
        <icon
          :icon="UserBarStatus ? UserIcon[0] : UserIcon[1]"
          class="fa-lg iconClick"
          @click="openUserBar"
        />
      </div>
    </b-navbar>
    <Userbar
      ref="UserBar"
      id="UserBar"
      :style="{
        'margin-left': UserBarStatus ? 'calc(100vw - 250px)' : ' 105vw ',
      }"
    />
  </div>
</template>

<style lang="scss" scoped>
.header {
  justify-content: space-between;
  background:linear-gradient(#577726, #628931, #577726);
  height: 100px;
}
.LogoImg {
  cursor: pointer;
  width: 16%;
  text-align: center;
  color: #c4c6c8;
}
.navbarCtrl {
  padding-right: 20px;
  min-width: 308px;
}
.iconClick {
  cursor: pointer;
}
.bar {
  margin-top: 120px;
}
.backdrop {
  background-color: #000;
  opacity: 0.5;
  width: 100vw;
  margin-top: 70px;
  height: calc(100vh - 70px);
  position: fixed;
}
.dropText {
  padding-left: 8px;
}
.b-nav-dropdown {
  font-weight: 600;
  font-size: 1.2rem;
}
::v-deep .dropdown-menu {
  background-color: #222629;
  opacity: 0.95;
}
::v-deep .nav-link {
  color: #c4c6c8 !important;
  padding: 0.5rem 0.4rem;
}
::v-deep .dropdown-item {
  font-size: 0.84rem;
  color: #cecece;
}
::v-deep .dropdown-item:hover {
  color: #222629 !important;
}
::v-deep .dropdown-item:active {
  background-color: #cecece;
  color: #222629 !important;
}
</style>

<script>
import { mapState, mapMutations } from "vuex";
import Customer from "@/config/components/GlobalHeader";

export default {
  data() {
    return {
      UserIcon: [
        ["far", "user"],
        ["fas", "user"],
      ],
      SideIcon: [
        ["fas", "align-left"],
        ["fas", "align-justify"],
      ],

      BackDropStatus: false,
      Customer_list: [{ text: "Become an Expert", value: "Customer_Expert" }],
    };
  },
  computed: {
    ...mapState("Render", [
      "Width",
      "UserBarStatus",
      "BreakPoint",
    ]),
    ...mapState("Login", ["Status", "User"]),
    User_list() {
      return Customer.User_list();
    },
  },
  watch: {
    Width() {
      this.widthCtrl();
    },
    UserBarStatus() {
      let userbar = this.$refs[`UserBar`].$el;
      userbar.setAttribute("style", "transition: margin-left 0.5s ease;");
      setTimeout(() => {
        userbar.style.transition = "";
      }, 500);
    },
  },
  created() {
    this.widthCtrl();
  },
  methods: {
    ...mapMutations("Render", ["UpdateUserBarStatus"]),
    openUserBar() {
      this.UpdateUserBarStatus("");
    },
    backDrop() {
      this.BackDropStatus = false;
      this.UpdateUserBarStatus(false);
    },
    widthCtrl() {
      if (this.Width >= this.BreakPoint.md) {
        this.UpdateUserBarStatus(false);
      }
    },
  },
};
</script>
