<template>
  <div style="padding-block: 20px">
    <b-card class="docs-card">
      <b-card-title>
        <div style="display: flex; justify-content: space-between">
          <div>
            <h2>{{ $t(`Docs.${docsRouter}`) }}</h2>
          </div>
          <div>
            <icon
              style="cursor: pointer"
              :icon="['fas', 'home']"
              class="fa-sm"
              @click="$page.GoToPage('/')"
            />
          </div>
        </div>
      </b-card-title>
      <b-card-text>
        <div v-if="$format.NotNull(docsHtml)" v-html="docsHtml" />
      </b-card-text>
    </b-card>
  </div>
</template>

<style lang="scss" scoped>
.docs-card {
  margin-inline: 40px;
  background-color: #2f3437;
}
.card-title {
  text-align: left;
  color: #fff;
}
iframe {
  border: unset;
  width: 100%;
  height: auto;
}
.card-text {
  margin-inline: 20px;
  margin-top: 20px;
  color: #fff;
  min-height: calc(100vh - 343px);
  text-align: left;
}
</style>

<script>
import Docs from "@/config/global/Docs";
import { mapState } from "vuex";
import axios from "axios";
export default {
  data() {
    return {
      docsRouter: "",
      docsHtml: null,
    };
  },
  computed: {
    ...mapState("Language", ["Lang"]),
    docsData() {
      return Docs.DocsValue(this.docsRouter);
    },
    router() {
      return this.$route.params.docspage;
    },
  },
  watch: {
    router() {
      this.getDocsData();
    },
    Lang() {
      this.getDocsData();
    },
  },
  created() {
    this.getDocsData();
  },
  methods: {
    getDocsData() {
      this.docsRouter = this.$route.params.docspage;
      axios.get(`/docs/${this.Lang}/${this.docsData}.html`).then((res) => {
        this.docsHtml = res.data;
      });
    },
  },
};
</script>
