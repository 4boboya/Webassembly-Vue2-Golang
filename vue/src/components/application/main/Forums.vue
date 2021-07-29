<template>
  <div>
    <div class="wordpress-div">
      <Loading class="wordpress-forums loading" v-if="loading" />
      <iframe
        :src="wordpress"
        class="wordpress-forums"
        v-if="!runDestory && serviceExitis"
        :style="{
          display: signinLoading ? 'none' : 'block',
        }"
        ref="wordpress"
      />
      <div v-if="!serviceExitis" class="text-light text-center mt-5">
        Service Error!
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
iframe {
  border: unset;
}
.wordpress-div {
  width: 100%;
  height: calc(100vh - 430px);
  background-color: #222629;
  overflow: hidden;
  position: relative;
}
.wordpress-forums {
  width: 100%;
  position: absolute;
  top: 0px;
  height: calc(100vh - 430px);
}
.loading {
  background: linear-gradient(
      1turn,
      rgba(34, 38, 41, 1),
      rgba(34, 38, 41, 0.1) 0.5%
    ),
    linear-gradient(0.25turn, rgba(34, 38, 41, 1), rgba(34, 38, 41, 0.1) 0.5%),
    linear-gradient(0.5turn, rgba(34, 38, 41, 1), rgba(34, 38, 41, 0.1) 0.5%),
    linear-gradient(0.75turn, rgba(34, 38, 41, 1), rgba(34, 38, 41, 0.1) 0.5%);
}
::v-deep .text-dark {
  color: #dedede !important;
}
</style>

<script>
import VueCookies from "vue-cookies";
import WordpressMessageConfig from "@/config/components/WordpressMessage";
import * as Forums from "@/apis/forums";
import { mapState, mapMutations } from "vuex";
export default {
  props: {
    tabpage: "",
    runDestory: false,
  },
  data() {
    return {
      loading: false,
      signinLoading: false,
      iframWordpress: {},
      wordpress: "http://192.168.9.231/wordpress/",
      changeForumsCount: 0,
      serviceExitis: true,
    };
  },
  computed: {
    ...mapState("Login", ["Status", "Finger"]),
    ...mapState("Language", ["Lang"]),
    ...mapState("Root", ["ForumService"]),
  },
  watch: {
    tabpage() {
      if (this.tabpage == "forums") {
        this.wordpressLanguage();
      }
    },
    Lang() {
      this.wordpressLanguage();
    },
    Status() {
      if (!this.Status) {
        this.changeForumsCount = 0;
        this.loading = true;
        this.toWordpressData("logout", {});
        this.wordpress += "?foro=logout";
      } else {
        this.initial();
      }
    },
  },
  async created() {
    this.loading = true;
    this.signinLoading = true;
    await this.heartBeat();
    if (this.serviceExitis) {
      await this.initial();
    } else {
      this.loading = false;
      this.signinLoading = false;
    }
  },
  mounted() {
    window.addEventListener("message", this.handleMessage);
    this.iframWordpress = this.$refs.wordpress.contentWindow;
  },
  beforeDestroy() {
    this.wordpress = "https://io.aluo.work/?foro=logout";
    window.removeEventListener("message", this.handleMessage);
  },
  methods: {
    async heartBeat() {
      this.serviceExitis = await Forums.heartBeat();
    },
    async initial() {
      this.wordpress = this.ForumService;
      if (this.Status) {
        const accountInitial = await Forums.forumsRegister(
          VueCookies.get("user_info").account
        );
        if (accountInitial != undefined && accountInitial.status == true) {
          this.loading = true;
          this.wordpress += `?forumsCode=${
            VueCookies.get("user_info").account
          }`;
        }
      } else {
        if (this.$format.NotNull(sessionStorage.getItem("forumsUrl"))) {
          this.wordpress = sessionStorage.getItem("forumsUrl");
        }
      }
    },
    wordpressLanguage() {
      const langMapping = {
        zhtw: "zh-TW",
        zhcn: "zh-CN",
        enus: "en",
        jajp: "ja",
      };
      let params = {
        Language: langMapping[this.Lang],
      };
      this.toWordpressData("language", params);
    },
    handleMessage(event) {
      let wordpressConfig = WordpressMessageConfig.Message[event.data.Cmd];
      if (wordpressConfig != undefined) {
        switch (wordpressConfig.type) {
          case "changeVuePage":
            this.$page.GoToPage(wordpressConfig.event);
            break;
          case "changeForumsPage":
            let url = sessionStorage.getItem("forumsUrl");
            this.changeScheduleStyle();
            this.wordpress = this.$format.NotNull(wordpressConfig.event)
              ? this.$format.NotNull(url)
                ? url
                : wordpressConfig.event
              : event.data.Params.url;
            break;
          case "changeLanguage":
            this.changeScheduleStyle();
            this.wordpressLanguage();
            if (event.data.Params.url != undefined) {
              if (event.data.Params.url.indexOf("signin") == -1) {
                this.loading = false;
                this.signinLoading = false;
              }
              if (
                this.$format.NotNull(event.data.Params.url) &&
                this.changeForumsCount > 0
              ) {
                sessionStorage.setItem("forumsUrl", event.data.Params.url);
              }
              this.changeForumsCount++;
            }
            break;
          case "loadingStart":
            this.loading = true;
            if (event.data.Cmd == "loginLoading") {
              this.signinLoading = true;
            }
            break;
          case "loginCheck":
            if (!this.Status) {
              this.$page.GoToPage("/login");
            }
            break;
          case "destoryElement":
            this.runDestory = true;
            this.$nextTick(() => {
              if (event.data.Params.event == "login") {
                this.wordpress = this.ForumService;
                if (this.Status) {
                  this.loading = true;
                  this.wordpress += `?forumsCode=${
                    VueCookies.get("user_info").account
                  }`;
                }
              }
              this.runDestory = false;
            });
            break;
        }
      }
    },
    toWordpressData(cmd, params) {
      this.iframWordpress.postMessage(
        {
          Cmd: cmd,
          Params: params,
        },
        this.wordpress
      );
    },
    changeScheduleStyle() {
      const schedule = document.getElementsByClassName("schedule")[0];
      this.$nextTick(() => {
        setTimeout(() => {
          schedule.setAttribute("style", "margin-top:89px");
        }, 290);
        setTimeout(() => {
          schedule.setAttribute("style", "margin-top:100px");
        }, 300);
      });
    },
  },
};
</script>
