<template>
  <div class="advbar shadow">
    <perfect-scrollbar>
      <div v-if="advData != undefined && advData.length > 0" class="nav">
        <b-nav-item
          v-for="(adv, index) in advData"
          :key="index"
          @click="advPage(adv.url, adv.createdBy)"
        >
          <img
            style="width: 170px; height: 170px"
            :src="isPRD() ? `${ImageBaseUrl}${adv.path}` : ''"
            :title="adv.title"
            :alt="adv.title"
          />
        </b-nav-item>
      </div>
      <div v-else class="nav">
        <b-nav-item>
          <picture>
            <source
              style="width: 170px; height: 170px"
              srcset="@/assets/error.webp"
              type="image/webp"
              title="error"
              alt="error"
            />
            <img
              style="width: 170px; height: 170px"
              src="@/assets/error.png"
              title="error"
              alt="error"
            />
          </picture>
        </b-nav-item>
        <b-nav-item>
          <picture>
            <source
              style="width: 170px; height: 170px"
              srcset="@/assets/nodata.webp"
              type="image/webp"
              title="nodata"
              alt="nodata"
            />
            <img
              style="width: 170px; height: 170px"
              src="@/assets/nodata.png"
              title="nodata"
              alt="nodata"
            />
          </picture>
        </b-nav-item>
        <b-nav-item>
          <picture>
            <source
              style="width: 170px; height: 170px"
              srcset="@/assets/error.webp"
              type="image/webp"
              title="error"
              alt="error"
            />
            <img
              style="width: 170px; height: 170px"
              src="@/assets/error.png"
              title="error"
              alt="error"
            />
          </picture>
        </b-nav-item>
        <b-nav-item>
          <picture>
            <source
              style="width: 170px; height: 170px"
              srcset="@/assets/error.webp"
              type="image/webp"
              title="error"
              alt="error"
            />
            <img
              style="width: 170px; height: 170px"
              src="@/assets/error.png"
              title="error"
              alt="error"
            />
          </picture>
        </b-nav-item>
        <b-nav-item>
          <picture>
            <source
              style="width: 170px; height: 170px"
              srcset="@/assets/error.webp"
              type="image/webp"
              title="error"
              alt="error"
            />
            <img
              style="width: 170px; height: 170px"
              src="@/assets/error.png"
              title="error"
              alt="error"
            />
          </picture>
        </b-nav-item>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.advbar {
  background-color: #33373a;
  height: calc(100vh - 200px);
  width: 200px;
  position: fixed;
}
</style>

<script>
import * as AdvApi from "@/apis/adv";
import {mapState} from 'vuex';
export default {
  data() {
    return {
      advData: [],
      ImageBaseUrl: null,
    };
  },
  computed: {
    ...mapState("Root", ["DevType"])
  },
  async created() {
    await this.switchImageUrl();
    await this.getAdvImage();
  },
  methods: {
    advPage(url, createdBy) {
      if (createdBy == "promotion") {
        location.assign(url);
      } else if (createdBy == "advertising") {
        window.open(url);
      }
    },
    async switchImageUrl() {
      this.ImageBaseUrl = this.isPRD() ? "/nas/" : "";
    },
    async getAdvImage() {
      this.advData = await AdvApi.AdvData({});
    },
    isPRD() {
      return this.DevType == "PRD";
    }
  },
};
</script>