<template>
  <div>
    <b-container class="text-center mt-5">
      <picture>
        <source srcset="@/assets/error.webp" type="image/webp" />
        <img src="@/assets/error.png" class="notfound-img" />
      </picture>
      <br />
      <hr />
      <h1><icon icon="exclamation-triangle" class="text-danger" /></h1>
      <h1 class="text-danger">ERROR</h1>
      <h2 class="text-danger">
        <span>{{ Loading ? "Server Error" : "Page is not found！" }}</span>
      </h2>
      <b-button
        v-if="!Loading"
        variant="outline-success"
        @click="$page.GoToPage('/')"
        class="mt-3"
      >
        Back go home
      </b-button>
    </b-container>
  </div>
</template>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  img {
    width: 100%;
  }
}
</style>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState("Render", ["Loading"]),
  },
};
</script>
