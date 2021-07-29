<template>
  <div>
    <b-nav-item-dropdown right class="dropdwonItem">
      <template #button-content>
        <icon :icon="['fas', 'globe-africa']" class="fa-lg" />
      </template>
      <b-dropdown-item
        v-for="(item, index) in lang_list"
        :key="index"
        @click="LangSet(item.key)"
        left
      >
        <img
          v-if="item.key == 'enus'"
          style="max-width: 0.98rem"
          src="@/assets/countryIcon/USA.png"
        />
        <img
          v-else-if="item.key == 'jajp'"
          style="max-width: 0.98rem"
          src="@/assets/countryIcon/Japan.png"
        />
        <img
          v-else-if="item.key == 'zhtw'"
          style="max-width: 0.98rem"
          src="@/assets/countryIcon/Taiwan.png"
        />
        <img
          v-else-if="item.key == 'zhcn'"
          style="max-width: 0.98rem"
          src="@/assets/countryIcon/China.png"
        />
        <span class="dropText">
          {{ item.text }}
        </span>
      </b-dropdown-item>
    </b-nav-item-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.dropdwonItem > ::after {
  display: none;
}
::v-deep .dropdown-menu {
  background-color: #222629;
  opacity: 0.95;
}
::v-deep .nav-link {
  color: #c4c6c8 !important;
  padding: 0.5rem 0.4rem;
}
::v-deep .dropdown-item {
  font-size: 0.84rem;
  color: #cecece;
}
::v-deep .dropdown-item:hover {
  color: #222629 !important;
}
::v-deep .dropdown-item:active {
  background-color: #cecece;
  color: #222629 !important;
}
</style>

<script>
import {mapMutations } from "vuex";
import Languages from "@/config/global/Languages";
import lazyload from "@/i18n";

export default {
  computed: {
    lang_list() {
      return Languages.languages;
    },
  },
  methods: {
    ...mapMutations("Language", ["setLanguage"]),
    LangSet(lang) {
      lazyload(lang);
      this.setLanguage(lang)
    },
  },
};
</script>
