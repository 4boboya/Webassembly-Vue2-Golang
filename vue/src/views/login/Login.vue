<template>
  <div style="user-select: none">
    <Loading v-if="loading" />
    <div style="min-height: 10vh" />
    <b-card class="login-card">
      <b-card-title style="color: #fff"> {{$t('Login.Login')}} </b-card-title>
      <b-container>
        <b-form style="margin-inline: 15px" @keypress.enter="login()">
          <b-row>
            <label>{{$t("Login.Email")}}</label>
            <b-form-input
              v-model="LoginData.Account"
              :placeholder="$t('Login.EnterEmail')"
              type="email"
              size="sm"
            />
          </b-row>
          <b-row>
            <label>{{$t("Login.Password")}}</label>
            <b-form-input
              v-model="LoginData.Password"
              :placeholder="$t('Login.EnterPassword')"
              type="password"
              size="sm"
            />
          </b-row>
        </b-form>
        <div style="margin-top: 20px">
          <b-button class="login-btn" @click="login()"> {{$t("Login.Login")}} </b-button>
        </div>
        <b-row class="register-forget-password">
          <b-col style="max-width: 20%">
            <a style="cursor: pointer" @click="$page.GoToPage('/register')">
              {{$t("Login.Register")}}
            </a>
          </b-col>
          <b-col>
            <a
              style="cursor: pointer"
              @click="$page.GoToPage('/requestPassword')"
            >
              {{$t("Login.Forgot")}}
            </a>
          </b-col>
        </b-row>
        <div style="text-align: right">
          <b-button @click="$page.GoToPage('/')">{{$t("Login.Back")}}</b-button>
        </div>
        <div style="border-top: 1.5px solid #acb2b9; margin-top: 15px">
          <b-row style="margin: unset; margin-top: 10px">
            <div style="margin-top: 10px; margin-right: 5px" @click="loginClick()">
              <g-signin-button
                :params="googleSignInParams"
                @success="googleSignInSuccess"
                @error="SignInError"
              >
                <icon :icon="['fab', 'google']" class="fa-lg" /> Google
              </g-signin-button>
            </div>
            <div
              style="margin-top: 10px; margin-right: 5px"
              @click="loginClick()"
            >
              <fb-signin-button
                :params="fbSignInParams"
                @success="FBSignInSuccess"
                @error="SignInError"
              >
                <icon :icon="['fab', 'facebook-square']" class="fa-lg" />
                Facebook
              </fb-signin-button>
            </div>
            <div style="margin-top: 10px; margin-right: 5px">
              <b-button class="twitter-signin-button" @click="twitterLogin()">
                <icon :icon="['fab', 'twitter-square']" class="fa-lg" /> Twitter
              </b-button>
            </div>
            <div style="margin-top: 10px">
              <b-button class="discord-signin-button" @click="$page.RedirectUrl(discordLoginPath)">
                <icon :icon="['fab', 'discord']" class="fa-lg" /> Discord
              </b-button>
            </div>
          </b-row>
        </div>
      </b-container>
    </b-card>
  </div>
</template>

<style lang="scss" scoped>
.login-card {
  max-width: 450px;
  min-height: 500px;
  margin-inline: auto;
  background-color: #464a4f;
}
.nav {
  display: unset;
  padding: unset;
}
.row {
  margin-top: 20px;
}
.login-btn {
  // max-width: 70px;
  background-color: #9cbfb6;
  margin-right: 20px;
  font-weight: 600;
  width: 100%;
  color: #383838;
}
.register-forget-password {
  color: #dbdbdb;
  margin-top: 10px;
  text-align: left;
  font-size: 15px;
}
.container,
.container-fluid,
.container-sm,
.container-md,
.container-lg,
.container-xl {
  padding: unset;
}
::v-deep label {
  color: #cecece;
  font-weight: 600;
}
.fb-signin-button {
  min-width: 110px;
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #4267b2;
  color: #fff;
  box-shadow: 0 3px 0 #395793;
  cursor: pointer;
}
.g-signin-button {
  min-width: 110px;
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #c94130;
  color: #fff;
  box-shadow: 0 3px 0 #ab392b;
  cursor: pointer;
}
.twitter-signin-button {
  min-width: 110px;
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #1da1f2;
  color: #fff;
  box-shadow: 0 3px 0 #0d82c9;
  cursor: pointer;
  border: unset;
}
.discord-signin-button {
  min-width: 110px;
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #5865f2;
  color: #fff;
  box-shadow: 0 3px 0 #4856ef;
  cursor: pointer;
  border: unset;
}
</style>

<script>
import { mapState, mapMutations } from "vuex";
import * as User from "@/apis/user";
import ThirdPartyLogin from '@/mixins/ThirdPartyLogin';
import FBSignInButton from 'vue-facebook-signin-button';
import GSignInButton from 'vue-google-signin-button';
import Vue from 'vue';
Vue.use(FBSignInButton);
Vue.use(GSignInButton);

export default {
  data() {
    return {
      loading: false,
      LoginData: {
        Account: null,
        Password: null,
        Finger: null,
        Site: null,
        UserName: null,
      },
    };
  },
  mixins: [ThirdPartyLogin],
  computed: {
    ...mapState("Login", ["Finger", "User"]),
  },

  mounted() {
    this.checkDiscordLogin();
  },

  methods: {
    ...mapMutations("Login", ["setUserInfo"]),
    loginClick() {
      this.loading = true;
    },
    SignInError(error) {
      this.loading = false;
      this.$swal({
        icon: "error",
        text: this.$t('Login.VerificationFailed'),
        timer: 2000,
        timerProgressBar: true,
      }).then(() => {
        this.$router.push({ query: {} });
      });
    },
    async login() {
      if (
        this.$format.NotNull(this.LoginData.Account) &&
        this.$format.NotNull(this.LoginData.Password) &&
        this.$format.isMail(this.LoginData.Account)
      ) {
        this.loading = true;
        this.LoginData.Finger = this.Finger;
        const loginResult = await User.Login(this.LoginData);
        this.loginCheck(loginResult);
      } else {
        this.$msg.Alert("WrongFormat", "error");
      }
    },
    loginCheck(loginResult) {
      if (this.$code.Success(loginResult.code)) {
        this.setUserInfo(loginResult);
        this.$msg.Alert(loginResult.message, "success").then(() => {
          this.$page.GoToPage("/");
        });
      } else {
        this.$msg.Alert(loginResult.message, "error");
      }
      this.loading = false;
    },
    async loginForSite(account, username, site) {
      this.LoginData.Account = account;
      this.LoginData.UserName = username;
      this.LoginData.Site = site;
      this.LoginData.Finger = this.Finger;
      const loginResult = await User.loginForSite(this.LoginData);
      if (this.$format.NotNull(loginResult.code)) {
        this.loginCheck(loginResult);
      } else {
        this.$msg.Error().then(() => {
          this.loading = false;
          this.$router.push({ query: {} });
        });
      }
    },
  },
};
</script>
