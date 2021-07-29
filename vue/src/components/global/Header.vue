<template>
  <div style="z-index: 999">
    <div
      v-if="SideBarStatus || UserBarStatus"
      class="mobile-backdrop mobile-backdrop-display"
      @click="mobileBackdrop"
    />
    <div
      v-if="!SideBarSmallStatus"
      class="desktop-backdrop desktop-backdrop-display"
    />
    <b-navbar class="header desktop-navbar-display">
      <b-navbar-nav style="width: 36%">
        <b-nav-item> {{ $t("Header.BestDeals") }} </b-nav-item>
        <b-nav-item> {{ $t("Header.BestExperts") }} </b-nav-item>
      </b-navbar-nav>
      <b-navbar-brand class="LogoImg" @click="$page.GoToPage('/')">
        Logo Img
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <div class="userCtrlNav">
          <b-row
            class="d-flex justify-content-end align-items-center"
            style="height: 65px"
          >
            <b-nav-item-dropdown v-if="Status" class="loginDropdwonItem" right>
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
            <b-nav-item v-if="!Status" to="/login">
              {{ $t("Header.SingIn") }}
            </b-nav-item>
          </b-row>
          <HeaderCtrl />
        </div>
      </b-navbar-nav>
    </b-navbar>
    <b-navbar class="header mobile-navbar-display">
      <div style="color: #c4c6c8">
        <icon
          :icon="SideBarStatus ? SideIcon[0] : SideIcon[1]"
          class="fa-lg iconClick"
          style="margin-right: 1rem"
          @click="openSideBar"
        />
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
    <Sidebar :style="{ 'margin-left': SideBarStatus ? '0px' : ' -200px ' }" />
    <Userbar
      ref="UserBar"
      :style="{
        'margin-left': UserBarStatus ? 'calc(100vw - 250px)' : ' 105vw ',
      }"
    />
  </div>
</template>

<style lang="scss" scoped>
.header {
  justify-content: space-between;
  background: linear-gradient(#577726, #628931, #577726);
  height: 100px;
}
.LogoImg {
  cursor: pointer;
  text-align: center;
  width: 16%;
  color: #c4c6c8;
}
.loginDropdwonItem {
  font-weight: 600;
  font-size: 1.2rem;
}
.userCtrlNav {
  padding-right: 20px;
  min-width: 308px;
}
.iconClick {
  cursor: pointer;
}
.bar {
  margin-top: 120px;
}
.mobile-backdrop {
  background-color: #000;
  opacity: 0.5;
  width: 100vw;
  margin-top: 100px;
  height: calc(100vh - 100px);
  position: fixed;
}
.desktop-backdrop {
  background-color: #000;
  opacity: 0.5;
  width: 100vw;
  margin-top: 230px;
  height: calc(100vh - 230px);
  position: fixed;
}
.dropText {
  padding-left: 8px;
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
import Auth from "@/library/global/Auth";
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
      LangString: "English",
      Customer_list: [{ text: "Become an Expert", value: "Customer_Expert" }],
    };
  },
  computed: {
    ...mapState("Render", [
      "Width",
      "SideBarStatus",
      "UserBarStatus",
      "SideBarSmallStatus",
      "BreakPoint",
    ]),
    ...mapState("Login", ["Status", "User"]),
    User_list() {
      return Customer.User_list();
    },
  },
  watch: {
    UserBarStatus() {
      let userbar = this.$refs[`UserBar`].$el;
      userbar.setAttribute("style", "transition: margin-left 0.5s ease;");
      setTimeout(() => {
        userbar.style.transition = "";
      }, 500);
    },
    Width() {
      this.widthCtrl();
    },
  },
  created() {
    this.widthCtrl();
  },
  methods: {
    ...mapMutations("Render", [
      "UpdateSideBarStatus",
      "UpdateUserBarStatus",
      "UpdateAdvBarStatus",
    ]),
    callAction(path) {
      Auth.UserCtrl(path);
    },
    openSideBar() {
      this.UpdateSideBarStatus("");
      if (this.UserBarStatus) {
        this.UpdateUserBarStatus("");
      }
    },
    openUserBar() {
      this.UpdateUserBarStatus("");
      if (this.SideBarStatus) {
        this.UpdateSideBarStatus("");
      }
    },
    mobileBackdrop() {
      this.BackDropStatus = false;
      this.UpdateSideBarStatus(false);
      this.UpdateUserBarStatus(false);
    },
    widthCtrl() {
      if (this.Width >= this.BreakPoint.md) {
        this.UpdateSideBarStatus(true);
        this.UpdateUserBarStatus(false);
      } else {
        this.UpdateSideBarStatus(false);
      }
      if (this.Width >= 1400) {
        this.UpdateAdvBarStatus(true);
      } else {
        this.UpdateAdvBarStatus(false);
      }
    },
  },
};
</script>
