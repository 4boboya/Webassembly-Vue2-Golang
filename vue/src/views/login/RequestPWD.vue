<template>
  <div>
    <div style="min-height: 10vh" />
    <b-card class="request-password-card">
      <template #header> logo img </template>
      <b-card-title style="color: #fff"> {{$t('RequestPWD.Forgot')}} </b-card-title>
      <b-container>
        <b-form>
          <b-row>
            <b-col sm="3">
              <label>{{$t('RequestPWD.Email')}}</label>
            </b-col>
            <b-col sm="9">
              <b-form-input
                v-model="ForgotPWDData.Account"
                type="email"
                size="sm"
              />
            </b-col>
          </b-row>
        </b-form>
        <div class="div-btn">
          <b-button class="submit-btn" @click="requestPassword()">
            {{$t('RequestPWD.Submit')}}
          </b-button>
          <b-button @click="$page.GoToPage('/login')">{{$t('RequestPWD.Back')}}</b-button>
        </div>
      </b-container>
    </b-card>
  </div>
</template>

<style lang="scss" scoped>
.request-password-card {
  max-width: 450px;
  min-height: 500px;
  margin-inline: auto;
  background-color: #464a4f;
}
.div-btn {
  width: 100%;
  text-align: right;
  margin-top: 20px;
}
.submit-btn {
  max-width: 86px;
  margin-right: 20px;
}
.nav {
  display: unset;
  padding: unset;
}
.row {
  margin-top: 20px;
}
::v-deep label {
  color: #cecece;
  font-weight: 600;
}
</style>

<script>
import { mapState } from "vuex";
import * as User from "@/apis/user";
export default {
  data() {
    return {
      ForgotPWDData: {
        Account: null,
        Finger: null,
      },
    };
  },
  computed: {
    ...mapState("Login", ["Finger"]),
  },
  created() {
    this.ForgotPWDData.Finger = this.Finger;
  },
  methods: {
    async requestPassword() {
      if (
        this.$format.NotNull(this.ForgotPWDData.Account) &&
        this.$format.isMail(this.ForgotPWDData.Account)
      ) {
        const requestPasswordResult = await User.RequestPassword(this.ForgotPWDData);
        if (this.$code.Success(requestPasswordResult.code)) {
          this.$msg.Alert(
              requestPasswordResult.message,
              "success",
              this.$t('RequestPWD.BeenSent')
            )
            .then(() => {
              this.$page.GoToPage("/login");
            });
        } else {
          this.$msg.Alert(requestPasswordResult.message, "error");
        }
      } else {
        this.$msg.Alert("WrongFormat", "error");
      }
    },
  },
};
</script>
