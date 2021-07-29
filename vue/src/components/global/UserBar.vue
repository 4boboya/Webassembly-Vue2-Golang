<template>
  <div class="userbar shadow">
    <perfect-scrollbar>
      <div>
        <b-nav v-if="Status">
          <b-button class="colBtn" block @click="showCollapse('User', false)">
            {{ User.Name }}
            <b ref="caret_User" class="caret" />
          </b-button>
          <b-collapse class="colMain" id="User">
            <b-nav-item
              v-for="(item, index) in UserList"
              :key="index"
              @click="
                UpdateUserBarStatus(false);
                $auth.UserCtrl(item.path);
              "
            >
              <icon :icon="item.icon" class="fa-lg" />
              <span class="colText">
                {{ $t(item.text) }}
              </span>
            </b-nav-item>
          </b-collapse>
        </b-nav>
        <b-nav v-else>
          <b-button
            class="colBtn"
            @click="
              UpdateUserBarStatus(false);
              $page.GoToPage('/login');
            "
          >
            {{$t('Header.SingIn')}}
          </b-button>
        </b-nav>
        <b-nav>
          <b-button class="colBtn" @click="UpdateUserBarStatus(false)">
            {{$t('Header.Promotions')}}
          </b-button>
        </b-nav>
        <b-nav v-for="(item, index) in UserBar" :key="index">
          <b-button class="colBtn" block @click="showCollapse(item.side)">
            {{$t(item.text)}}
            <b :ref="`caret_${item.side}`" class="caret" />
          </b-button>
          <b-collapse class="colMain" :id="item.side">
            <b-nav-item
              v-for="(item2, index2) in item.value"
              :key="index2"
              @click="UpdateUserBarStatus(false);$page.GoToPage(`${item2.path}`)"
            >
              <icon :icon="item2.icon" class="fa-lg" />
              <span class="colText">
                {{$t(item2.text)}}
              </span>
            </b-nav-item>
          </b-collapse>
        </b-nav>
        <b-nav v-for="(item, index) in Languages" :key="index + 20">
          <b-button class="colBtn" block @click="showCollapse(item.side)">
            {{ item.text }}
            <b :ref="`caret_${item.side}`" class="caret" />
          </b-button>
          <b-collapse class="colMain" :id="item.side">
            <b-nav-item
              v-for="(item2, index2) in item.value"
              :key="index2"
              @click="LangSet(item2.key)"
            >
              <img
                v-if="item2.key == 'enus'"
                style="max-width: 0.98rem"
                src="@/assets/countryIcon/USA.png"
              />
              <img
                v-else-if="item2.key == 'jajp'"
                style="max-width: 0.98rem"
                src="@/assets/countryIcon/Japan.png"
              />
              <img
                v-else-if="item2.key == 'zhtw'"
                style="max-width: 0.98rem"
                src="@/assets/countryIcon/Taiwan.png"
              />
              <img
                v-else-if="item2.key == 'zhcn'"
                style="max-width: 0.98rem"
                src="@/assets/countryIcon/China.png"
              />
              <span class="colText">
                {{ item2.text }}
              </span>
            </b-nav-item>
          </b-collapse>
        </b-nav>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.userbar {
  background-color: #33373a;
  height: calc(100vh - 100px);
  width: 250px;
  padding-top: 20px;
  position: fixed;
}
.colBtn {
  color: #fff;
  width: 100%;
  padding: 0.7rem 0.75rem;
  background-color: #00000000;
  border: unset;
  text-align: left;
  padding-left: 10px;
}
.colMain {
  width: 100%;
  background-color: #00000000;
  border: unset;
  border-radius: unset;
  text-align: left;
  font-size: 0.8rem;
}
.colText {
  padding-left: 8px;
}
.nav {
  padding: unset;
  padding-inline-start: unset;
}
.btn {
  color: #86c231;
  font-weight: bold;
}
.nav-item {
  padding-left: 10px;
}
.nav-item:hover {
  transition: all 0.2s ease-in;
  background-color: #282c2f;
}
</style>

<script>
import { mapState, mapMutations } from "vuex";
import Customer from "@/config/components/GlobalHeader";
import Languages from "@/config/global/Languages";
import lazyload from "@/i18n";

export default {
  computed: {
    ...mapState("Render", ["Width"]),
    ...mapState("Login", ["Status", "User"]),
    UserBar() {
      return Customer.UserBar();
    },
    UserList() {
      return Customer.User_list();
    },
    Languages() {
      return Languages.LanguagesBar();
    },
  },
  methods: {
    ...mapMutations("Render", ["UpdateUserBarStatus"]),
    ...mapMutations("Language", ["setLanguage"]),
    showCollapse(id, vfor = true) {
      this.$root.$emit("bv::toggle::collapse", id);
      let caret = vfor
        ? this.$refs[`caret_${id}`][0]
        : this.$refs[`caret_${id}`];
      caret.classList.toggle("rotated");
    },
    LangSet(lang) {
      lazyload(lang);
      this.UpdateUserBarStatus(false);
      this.setLanguage(lang)
    },
  },
};
</script>
