<template>
  <div class="validata">
    <b-card class="validata-card">
      <span class="validata-msg">{{ Msg }}</span>
      <b-row style="margin-top: 50px">
        <b-col xs>
          <b-button @click="$page.GoToPage('/login')">{{$t("Validate.GoToLogin")}}</b-button>
        </b-col>
        <b-col xs>
          <b-button @click="$page.GoToPage('/')">{{$t("Validate.GoToHome")}}</b-button>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<style lang="scss" scoped>
.validata{
  text-align: center; 
  margin-top: 100px
}
.validata-card {
  max-width: 450px;
  min-height: 200px;
  margin-inline: auto;
  background-color: #464a4f;
}
.validata-msg {
  color: #ffffff;
  font-weight: 600;
  font-size: 30px;
}
</style>

<script>
import { mapState } from "vuex";
import * as User from "@/apis/user";
export default {
  data() {
    return {
      Msg: this.$t('Validate.Verifying'),
      Validate: {
        Account: null,
        Finger: null,
        AuthKey: null,
      },
      Action: false,
    };
  },

  computed: {
    ...mapState("Login", ["Finger"]),
  },
  watch: {
    Finger() {
      if (this.Action) {
        this.validateData();
      }
    },
  },
  created() {
    this.Validate.AuthKey = this.$route.query.itoken;
    this.Validate.Account = this.$route.query.iemail;
    this.Action = true;
  },
  methods: {
    async validateData() {
      this.Validate.Finger = this.Finger;
      const validateResult = await User.Validate(this.Validate);
      this.Msg = this.$t(`MsgCode.${validateResult.message}`);
      // this.$request
      //   .Post(this.Validate, "auth", "validate")
      //   .then(({ data }) => {
      //     this.Msg = this.$t(`MsgCode.${data.message}`);
      //   })
      //   .catch(() => {
      //     this.$msg.Alert("SystemError", "error");
      //   });
    },
  },
};
</script>
