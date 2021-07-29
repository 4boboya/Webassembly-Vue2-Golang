<template>
  <div>
    <div style="min-height: 10vh" />
    <b-card class="forget-password-card">
      <template #header> LOGO IMG </template>
      <b-card-title style="color: #fff"> {{$t('ForgetPWD.Forgot')}} </b-card-title>
      <b-container>
        <b-form @keypress.enter="forgetPassword()">
          <b-row>
            <b-col sm="3">
              <label>{{$t('ForgetPWD.Password')}}</label>
            </b-col>
            <b-col sm="9">
              <b-form-input
                v-model="ForgetPassword.Password"
                type="password"
                size="sm"
                @input="checkPassword()"
              />
              <div
                :class="
                  PasswordCheck.EnglishWithNumber
                    ? 'text-success'
                    : 'text-warning'
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
                {{$t('ForgetPWD.PasswordNumAndEng')}}
              </div>
              <div
                :class="
                  PasswordCheck.LengthEight ? 'text-success' : 'text-danger'
                "
                class="data-check"
              >
                <icon
                  :icon="
                    PasswordCheck.LengthEight
                      ? ['far', 'check-circle']
                      : ['fas', 'exclamation-circle']
                  "
                />
                {{$t('ForgetPWD.PasswordLong')}}
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="3">
              <label>{{$t('ForgetPWD.CheckPassword')}}</label>
            </b-col>
            <b-col sm="9">
              <b-form-input
                v-model="CheckPassword"
                type="password"
                size="sm"
                @input="checkPassword()"
              />
            </b-col>
          </b-row>
        </b-form>
        <b-row>
          <b-col sm="7">
            <h3 v-if="!PasswordSame" class="text-danger">{{$t('ForgetPWD.PasswordSame')}}</h3>
          </b-col>
          <b-col sm="5">
            <div style="text-align: right">
              <b-button
                class="submit-btn"
                :disabled="!DataCheck"
                @click="forgetPassword()"
              >
                {{$t('ForgetPWD.Submit')}}
              </b-button>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </b-card>
  </div>
</template>

<style lang="scss" scoped>
.forget-password-card {
  max-width: 450px;
  min-height: 500px;
  margin-inline: auto;
  background-color: #464a4f;
}
.submit-btn {
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
      ForgetPassword: {
        Password: null,
        Finger: null,
        AuthKey: null,
        Account: null,
      },
      CheckPassword: null,
      PasswordSame: true,
      PasswordCheck: {
        EnglishWithNumber: false,
        LengthEight: false,
      },
      DataCheck: false,
    };
  },
  computed: {
    ...mapState("Login", ["Finger"]),
  },
  mounted() {
    this.ForgetPassword.Finger = this.Finger;
    this.ForgetPassword.Account = this.$route.query.iemail;
    this.ForgetPassword.AuthKey = this.$route.query.itoken;
  },
  methods: {
    async forgetPassword() {
      if (
        this.$format.NotNull(this.ForgetPassword.Password) &&
        this.$format.NotNull(this.CheckPassword) &&
        this.ForgetPassword.Password == this.CheckPassword
      ) {
        const forgetPasswordResult = await User.ForgetPassword(this.ForgetPassword);
        if (this.$code.Success(forgetPasswordResult.code)) {
          this.$msg.Alert(
              forgetPasswordResult.message,
              "success",
              this.$t("ForgetPWD.LoginAgain")
            )
            .then(() => {
              this.$page.GoToPage("/login");
            });
        } else {
          this.$msg.Alert(forgetPasswordResult.message, "error");
        }
        // this.$request
        //   .Post(this.ForgetPassword, "auth", "forgetpassword")
        //   .then(({ data }) => {
        //     if (this.$code.Success(data.code)) {
        //       this.$msg
        //         .Alert(data.message, "success", "Please log in again")
        //         .then(() => {
        //           this.$page.GoToPage("/login");
        //         });
        //     } else {
        //       this.$msg.Alert(data.message, "error");
        //     }
        //   })
        //   .catch(() => {
        //     this.$msg.Alert("SystemError", "error");
        //   });
      } else {
        this.$swal({
          text: this.$t('ForgetPWD.PasswordEmpty'),
          icon: "error",
        });
      }
    },
    checkPassword() {
      this.PasswordSame = this.$format.CheckSame(
        this.ForgetPassword.Password,
        this.CheckPassword
      );
      this.PasswordCheck.EnglishWithNumber = this.$format.PasswordEnglishNumber(
        this.ForgetPassword.Password
      );
      if (this.ForgetPassword.Password != null) {
        this.PasswordCheck.LengthEight =
          this.ForgetPassword.Password.length >= 8 &&
          this.ForgetPassword.Password.length <= 12;
      }
      this.DataCheck = this.PasswordCheck.LengthEight && this.PasswordSame;
    },
  },
};
</script>
