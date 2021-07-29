<template>
  <div
    class="footer"
    :style="{ 'padding-inline': Width < BreakPoint.md ? '15px' : ' 50px ' }"
  >
    <b-row class="information">
      <b-col xs>
        <span @click="$page.GoToPage('/docs/Help_and_FAQ')">
          {{ $t("Footer.HelpCenter") }}
        </span>
      </b-col>
      <b-col xs>
        <span @click="$page.GoToPage('/docs/Help_and_FAQ')">
          {{ $t("Footer.Feedback") }}
        </span>
      </b-col>
      <b-col xs>
        <span @click="$page.GoToPage('/docs/Promotions')">
          {{ $t("Footer.Promotions") }}
        </span>
      </b-col>
      <b-col xs>
        <span @click="$page.GoToPage('/docs/Policy_&_Agreements')">
          {{ $t("Footer.PolicyAgreement") }}
        </span>
      </b-col>
      <b-col xs>
        <span @click="$page.GoToPage('/docs/About_Us')">
          {{ $t("Footer.AboutUs") }}
        </span>
      </b-col>
    </b-row>
    <div class="copyRight">Copy Right © 2021 zbdigital</div>
  </div>
</template>

<style lang="scss" scoped>
.footer {
  height: 140px;
  padding-inline: 50px;
  background-color: #151719;
}
.information {
  color: #a6aaaf;
  padding-top: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  text-align: center;
}
.col {
  padding: unset;
}
.copyRight {
  color: #a6aaaf;
  padding-top: 20px;
  text-align: center;
  font-weight: 900;
}
span {
  cursor: pointer;
}
</style>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState("Render", ["Width", "BreakPoint"]),
  },
};
</script>