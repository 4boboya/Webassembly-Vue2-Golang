<template>
  <div>
    <b-navbar class="header desktop-navbar-display">
      <b-navbar-nav />
      <b-navbar-brand class="logo logoDesktop" @click="$page.GoToPage('/live')">
        Logo Img
      </b-navbar-brand>
      <b-navbar-nav />
      <b-nav>
        <Language />
      </b-nav>
    </b-navbar>
    <b-navbar class="header mobile-navbar-display">
      <b-navbar-brand class="logo" @click="$page.GoToPage('/live')">
        Logo Img
      </b-navbar-brand>
      <b-nav>
        <Language />
      </b-nav>
    </b-navbar>
  </div>
</template>

<style lang="scss" scoped>
.header {
  justify-content: space-between;
  background:linear-gradient(#577726, #628931, #577726);
  height: 70px;
}
.logo {
  color: #c4c6c8;
}
.logoDesktop {
  text-align: center;
  width: 20%;
}
.navbar-nav {
  width: 40%;
}
</style>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState('Render',["Width"]),
  },
};
</script>
