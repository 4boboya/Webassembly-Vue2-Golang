<template>
  <div>
    <div style="min-height: 10vh" />
    <b-card class="register-card">
      <!-- <template #header> LOGO IMG </template> -->
      <b-card-title style="color: #fff"> {{$t('Register.Register')}} </b-card-title>
      <b-container>
        <b-form @keypress.enter="register()">
          <b-row>
            <b-col sm="3">
              <label>{{$t('Register.UserName')}}</label>
            </b-col>
            <b-col sm="9">
              <b-form-input
                v-model="RegisterData.UserName"
                type="text"
                size="sm"
                @input="checkUserName()"
              />
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
                {{$t('Register.UserNameLong')}}
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
                {{$t('Register.UserNameLang')}}
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="3">
              <label>{{$t('Register.Email')}}</label>
            </b-col>
            <b-col sm="9">
              <b-form-input
                v-model="RegisterData.Account"
                type="email"
                size="sm"
                placeholder="insert your email"
                @input="AllDataCheck()"
              />
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="3">
              <label>{{$t('Register.Password')}}</label>
            </b-col>
            <b-col sm="9">
              <b-form-input
                v-model="RegisterData.Password"
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
                {{$t('Register.PasswordNumAndEng')}}
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
                {{$t('Register.PasswordLong')}}
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="3">
              <label>{{$t('Register.CheckPassword')}}</label>
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
          <b-col sm="9">
            <h3 v-if="!PasswordSame" class="text-danger">{{$t('Register.PasswordSame')}}</h3>
          </b-col>
          <b-col sm="3">
            <div style="text-align: right">
              <b-button
                style="max-width: 86px"
                :disabled="!DataCheck"
                @click="register()"
              >
                {{$t('Register.Register')}}
              </b-button>
            </div>
          </b-col>
        </b-row>
        <div class="have-account">
          {{$t('Register.HaveAccount')}}
          <a style="cursor: pointer" @click="$page.GoToPage('/login')">
            {{$t('Register.SignIn')}}
          </a>
        </div>
      </b-container>
    </b-card>
  </div>
</template>

<style lang="scss" scoped>
.register-card {
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
.have-account {
  color: #dbdbdb;
  margin-top: 15px;
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
      RegisterData: {
        UserName: null,
        Account: null,
        Password: null,
        Finger: null,
      },
      CheckPassword: null,
      PasswordSame: true,
      PasswordCheck: {
        EnglishWithNumber: false,
        LengthEight: false,
      },
      DataCheck: false,
      UserNameLength: false,
      UserNameSpecialSymbol: true,
    };
  },
  computed: {
    ...mapState("Login", ["Finger"]),
  },
  created() {
    this.RegisterData.Finger = this.Finger;
  },
  methods: {
    async register() {
      if (this.DataCheck) {
        const registerResult = await User.Register(this.RegisterData);
        if (this.$code.Success(registerResult.code)) {
          this.$msg.Alert(
              registerResult.message,
              "success",
              this.$t('Register.BeenSent')
            )
            .then(() => {
              this.user_name = null;
              this.Account = null;
              this.Password = null;
              this.CheckPassword = null;
              this.$page.GoToPage("/");
            });
        } else {
          this.$msg.Alert(registerResult.message, "error");
        }
      } else {
        this.$msg.Alert("WrongFormat", "error");
      }
    },
    checkPassword() {
      this.PasswordSame = this.$format.CheckSame(
        this.RegisterData.Password,
        this.CheckPassword
      );
      this.PasswordCheck.EnglishWithNumber = this.$format.PasswordEnglishNumber(
        this.RegisterData.Password
      );
      if (this.RegisterData.Password != null) {
        this.PasswordCheck.LengthEight =
          this.RegisterData.Password.length >= 8 &&
          this.RegisterData.Password.length <= 12;
      }
      this.AllDataCheck();
    },
    checkUserName() {
      this.RegisterData.UserName = this.RegisterData.UserName.trim();
      if (
        this.RegisterData.UserName.length <= 10 &&
        this.RegisterData.UserName.length >= 2
      ) {
        this.UserNameLength = true;
      } else {
        this.UserNameLength = false;
      }
      if (!this.$format.UserNameSpecialSymbol(this.RegisterData.UserName)) {
        this.UserNameSpecialSymbol = true;
      } else {
        this.UserNameSpecialSymbol = false;
      }
      this.AllDataCheck();
    },
    AllDataCheck() {
      this.DataCheck =
        this.PasswordCheck.LengthEight &&
        this.$format.NotNull(this.RegisterData.Account) &&
        this.$format.isMail(this.RegisterData.Account) &&
        this.PasswordSame &&
        this.UserNameLength &&
        this.UserNameSpecialSymbol;
    },
  },
};
</script>
