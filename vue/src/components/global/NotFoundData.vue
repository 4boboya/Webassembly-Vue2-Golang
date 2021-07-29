<template>
  <div class="text-light text-center h-50">
    <b-container v-if="!Loading">
      <picture>
        <source srcset="@/assets/nodata.webp" type="image/webp" />
        <img src="@/assets/nodata.png" class="notfound-img" />
      </picture>
      <br />
      <h2>{{ msg == undefined ? $t('NoData.NotFound') : msg }}</h2>
      <b-button @click="Reload()" class="my-2 mb-3" variant="success">
        {{$t('NoData.Reload')}}
      </b-button>
    </b-container>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: ["msg"],
  computed: {
    ...mapState("Render", ["Loading"]),
  },
  methods: {
    Reload() {
      history.go(0);
    },
  },
};
</script>

<style lang="scss" scoped>
.notfound-img {
  max-height: 400px;
  max-width: 400px;
}
@media screen and (max-width: 768px) {
  img {
    width: 100%;
  }
}
</style>
