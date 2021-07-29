import Vue from "vue";
import VueSweetalert2 from 'vue-sweetalert2';
import { i18n } from '@/i18n'
Vue.use(VueSweetalert2);
Vue.use(i18n)
const Live = {
  data() {
    return {
      loading: false,
      images: [],
      imgCount: 0,
    }
  },
  watch: {
    imgCount() {
      if (this.imgCount == 4) {
        this.$swal.close()
        if (this.loading) {
          this.show()
        }
        this.imgCount = 0
      }
    }
  },
  methods: {
    show() {
      if (this.images.length == 0) {
        this.$swal({
          title: i18n.t('MsgCode.ImgNoData'),
          icon: 'info'
        }).then(() => {
          this.$nextTick(() => {
            this.resetSchedule()
          })
        })
        // console.clear()
      } else {
        this.$viewerApi({
          images: this.images,
        });
        this.$nextTick(() => {
          this.resetSchedule()
        })
      }
      this.loading = false;
    },
    resetSchedule() {
      const schedule = document.getElementsByClassName('schedule')[0];
      this.$nextTick(() => {
        setTimeout(() => {
          schedule.setAttribute('style', 'margin-top:89px')
        }, 200)
        setTimeout(() => {
          schedule.setAttribute('style', 'margin-top:100px')
        }, 300)
      })
    },
    checkImg(data) {
      this.loading = true;
      this.$swal({
        title: i18n.t('MsgCode.ImgLoading'),
        didOpen: () => {
          this.$swal.showLoading()
        },
      }).then(() => {
        this.loading = false;
      })
      this.images = [];
      let date = data.time.substr(0, 10);
      date = date.split("-");
      date = date.join("");
      const oddType = [
        "Handicap",
        "OverUnder",
        "RunBallHandicap",
        "RunBallOverUnder",
      ];
      oddType.forEach(async (item, index) => {
        var img = new Image();
        // img.src = `https://www.zbdigital.net/nas/20210702/BS/GizejgJXvEy_${item}.png`;
        img.src = `/nas/${date}/${this.GameType}/${data.mainGameID}_${item}.png`;
        img.onerror = () => {
          this.imgCount += 1
        }
        img.onload = () => {
          if (img.width > 0 && img.height > 0) {
            this.images[index] = img.src;
          }
          this.imgCount += 1
        };
      });
    },
  },
};
export default Live;
