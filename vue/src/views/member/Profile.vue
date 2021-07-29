<template>
  <div>
    <div style="min-height: 10vh" />
    <b-card class="profile-card">
      <b-tabs
        ref="my-tabs"
        nav-class="scrollable-tabs-nav"
        content-class="mt-3"
      >
        <b-tab active>
          <template #title>
            <span style="white-space: nowrap">
              {{ $t("Profile.ChangeUsername") }}
            </span>
          </template>
          <b-input-group :prepend="$t('Profile.Username')" class="mt-3">
            <b-form-input
              v-model="UpdateNameData.Username"
              @input="checkUserName()"
            />
            <b-input-group-append>
              <b-button :disabled="!UserNameLength" @click="updateUserName()">
                {{ $t("Profile.Submit") }}
              </b-button>
            </b-input-group-append>
          </b-input-group>
          <div
            :class="UserNameLength ? 'text-success' : 'text-danger'"
            class="data-check"
          >
            <icon
              :icon="
                UserNameLength
                  ? ['far', 'check-circle']
                  : ['fas', 'exclamation-circle']
              "
            />
            {{ $t("Profile.UserNameLong") }}
          </div>
          <div
            :class="UserNameSpecialSymbol ? 'text-success' : 'text-danger'"
            class="data-check"
          >
            <icon
              :icon="
                UserNameSpecialSymbol
                  ? ['far', 'check-circle']
                  : ['fas', 'exclamation-circle']
              "
            />
            {{ $t("Profile.UserNameLang") }}
          </div>
        </b-tab>
        <b-tab v-if="User.Site == undefined">
          <template #title>
            <span style="white-space: nowrap">{{
              $t("Profile.ChangePassword")
            }}</span>
          </template>
          <b-input-group :prepend="$t('Profile.Oldpassword')" class="mt-3">
            <b-form-input
              type="password"
              v-model="UpdatePasswordData.Password"
            />
          </b-input-group>
          <b-input-group :prepend="$t('Profile.Newpassword')" class="mt-3">
            <b-form-input
              type="password"
              v-model="UpdatePasswordData.NewPassword"
              @input="checkPassword()"
            />
          </b-input-group>
          <div
            :class="
              PasswordCheck.EnglishWithNumber ? 'text-success' : 'text-warning'
            "
            class="data-check"
          >
            <icon
              :icon="
                PasswordCheck.EnglishWithNumber
                  ? ['far', 'check-circle']
                  : ['fas', 'exclamation-circle']
              "
            />
            {{ $t("Profile.PasswordNumAndEng") }}
          </div>
          <div
            :class="PasswordCheck.LengthEight ? 'text-success' : 'text-danger'"
            class="data-check"
          >
            <icon
              :icon="
                PasswordCheck.LengthEight
                  ? ['far', 'check-circle']
                  : ['fas', 'exclamation-circle']
              "
            />
            {{ $t("Profile.PasswordLong") }}
          </div>
          <b-input-group :prepend="$t('Profile.CheckNewpassword')" class="mt-3">
            <b-form-input
              type="password"
              v-model="CheckPassword"
              @input="checkPassword()"
            />
          </b-input-group>
          <b-row v-if="!PasswordSame">
            <h3 class="text-danger" style="margin-left: 15px">
              {{ $t("Profile.PasswordSame") }}
            </h3>
          </b-row>
          <b-button
            style="margin-top: 20px"
            :disabled="!PWDCheck"
            @click="updatePassword()"
          >
            {{ $t("Profile.Submit") }}
          </b-button>
        </b-tab>
      </b-tabs>
      <template #footer>
        <b-button @click="$page.GoToPage('/')">
          {{ $t("Profile.GoHome") }}
        </b-button>
      </template>
    </b-card>
  </div>
</template>

<style lang="scss" scoped>
.profile-card {
  max-width: 700px;
  min-height: 500px;
  margin-inline: auto;
  background-color: #464a4f;
}
.card-footer {
  background-color: unset;
  border-top: unset;
  text-align: right;
}
::v-deep .nav-tabs .nav-link {
  color: #000;
}
::v-deep .scrollable-tabs-nav {
  flex-wrap: nowrap;
  overflow: hidden;
}
</style>

<script>
import VueCookies from "vue-cookies";
import { mapState, mapMutations } from "vuex";
import TabsSlide from "@/mixins/TabsSlide";
import * as User from "@/apis/user";
import * as Forums from "@/apis/forums";

export default {
  data() {
    return {
      UpdateNameData: {
        Username: "",
        Token: "",
        Finger: "",
      },
      UpdatePasswordData: {
        Password: "",
        NewPassword: "",
        Token: "",
        Finger: "",
      },
      PasswordSame: true,
      PasswordCheck: {
        EnglishWithNumber: false,
        LengthEight: false,
      },
      CheckPassword: "",
      PWDCheck: false,
      UserNameLength: true,
      UserNameSpecialSymbol: true,
    };
  },
  computed: {
    ...mapState("Login", ["Finger", "User"]),
  },
  mixins: [TabsSlide],
  watch: {
    Finger() {
      this.UpdateNameData.Finger = this.Finger;
      this.UpdatePasswordData.Finger = this.Finger;
    },
  },
  created() {
    this.UpdateNameData.Username = this.User.Name;
    this.UpdateNameData.Finger = this.Finger;
    this.UpdatePasswordData.Finger = this.Finger;
    if (this.User.Name != undefined) {
      if (this.User.Name.length < 2 || this.User.Name.length > 10) {
        this.UserNameLength = false;
      }
    }
  },
  mounted() {
    if (VueCookies.get("user_info") != undefined) {
      this.UpdateNameData.Token = VueCookies.get("user_info").token;
      this.UpdatePasswordData.Token = VueCookies.get("user_info").token;
    }
  },
  methods: {
    ...mapMutations("Login", ["setUserInfo", "changeUserStatus"]),
    async updateUserName() {
      this.UpdateNameData.Finger = this.Finger;
      if (this.UserNameLength) {
        const updateUsernameResult = await User.UpdateUsername(
          this.UpdateNameData
        );
        if (this.$code.Success(updateUsernameResult.code)) {
          const forumsUpdateUsername = Forums.formusUpdateUsername(
            this.User.Account
          );
          let userInfoWithVuex = this.User;
          let userInfoWithCookies = VueCookies.get("user_info");
          userInfoWithCookies.userName = this.UpdateNameData.Username;
          userInfoWithVuex.Name = this.UpdateNameData.Username;
          userInfoWithVuex.Status = this.$code.Success(
            updateUsernameResult.code
          );
          userInfoWithVuex.Code = updateUsernameResult.code;
          this.changeUserStatus(userInfoWithVuex);
          VueCookies.set("user_info", userInfoWithCookies);
          this.$msg.Alert(updateUsernameResult.message, "success");
        } else {
          this.$msg.Alert(updateUsernameResult.message, "error");
        }
      }
    },
    async updatePassword() {
      if (this.PWDCheck) {
        if (this.UpdatePasswordData.NewPassword == this.CheckPassword) {
          const updatePasswordResult = await User.UpdatePassword(
            this.UpdatePasswordData
          );
          if (this.$code.Success(updatePasswordResult.code)) {
            this.$msg
              .Alert(
                updatePasswordResult.message,
                "success",
                this.$t('Profile.LoginAgain')
              )
              .then(() => {
                this.changeUserStatus(false);
                VueCookies.remove("user_info");
                this.$page.GoToPage("/login");
              });
          } else {
            this.$msg.Alert(updatePasswordResult.message, "error");
          }
        } else {
          this.$swal({
            text: this.$t('Profile.PasswordSameAgin'),
            icon: "error",
            timer: 3000,
            timerProgressBar: true,
          });
        }
      }
    },
    checkPassword() {
      this.PasswordSame = this.$format.CheckSame(
        this.UpdatePasswordData.NewPassword,
        this.CheckPassword
      );
      this.PasswordCheck.EnglishWithNumber = this.$format.PasswordEnglishNumber(
        this.UpdatePasswordData.NewPassword
      );
      this.PasswordCheck.LengthEight =
        this.UpdatePasswordData.NewPassword.length >= 8 &&
        this.UpdatePasswordData.NewPassword.length <= 12;
      this.PWDCheck = this.PasswordCheck.LengthEight && this.PasswordSame;
    },
    checkUserName() {
      this.UpdateNameData.Username = this.UpdateNameData.Username.trim();
      if (
        this.UpdateNameData.Username.length <= 10 &&
        this.UpdateNameData.Username.length >= 2
      ) {
        this.UserNameLength = true;
      } else {
        this.UserNameLength = false;
      }
      if (!this.$format.UserNameSpecialSymbol(this.UpdateNameData.Username)) {
        this.UserNameSpecialSymbol = true;
      } else {
        this.UserNameSpecialSymbol = false;
      }
    },
  },
};
</script>
