<template>
  <div>
    <div>
      <span v-for="(item, index) in LiveGameData" :key="index">
        <b-button class="league-btn" block @click="showCollapse(index)">
          <b-row class="ml-2 league-btn-cont">
            <div>
              {{ item.league }}
            </div>
            <icon
              :ref="`iconDesktop_${index}`"
              icon="angle-down"
              class="fa-lg angleIcon"
            />
          </b-row>
        </b-button>
        <b-collapse :id="`collapseDesktop_${index}`" class="sp-scroll-x">
          <div
            class="data-row"
            v-for="(item2, index2) in item.gameData"
            :key="index2"
          >
            <divTable :data="item2" :index="index2" />
          </div>
        </b-collapse>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.league-btn {
  width: 100%;
  background-color: #464a4f;
  border-color: #464a4f;
}
.league-btn-cont {
  max-width: 100%;
  text-align: left;
}
.angleIcon {
  position: absolute;
  right: 40px;
  transition: all 0.5s ease;
}
.rotated {
  transform: rotate(180deg);
}
.table {
  font-size: 0.75rem;
}
.table th {
  border-top: 0.5px solid #86c231;
  // 86c231
  padding: 0.25rem !important;
}
.table td {
  border-top: unset;
  padding: 0.25rem !important;
}
.table-responsive {
  margin-bottom: unset;
}
.btn {
  border-radius: unset;
  border-block: 1px solid #303336;
}
.pageSelect {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
.inline {
  display: inline-block;
}
.split-left {
  border-right: 1px solid #ffffff80 !important;
}
.overflow {
  overflow-x: auto;
}
</style>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  computed: {
    ...mapState("Render", ["GameType", "canCloseAll", "isOpen", "Loading"]),
    ...mapState("WebSocket", ["LiveGameData"]),
  },
  components: { divTable: () => import("./divTable.vue") },
  watch: {
    canCloseAll(n, o) {
      if (n) {
        if (!this.isOpen.includes(0)) {
          this.showCollapse(0);
        }
        this.$format.DeConnection(this.isOpen).forEach((id) => {
          if (id != 0) this.showCollapse(id);
        });
        this.UpdatecanCloseAll(false);
      }
    },
    Loading() {
      if (!this.Loading) {
        if (this.LiveGameData.length != 0) {
          this.$nextTick(() => {
            this.showCollapse(0, true);
          });
        }
      }
    },
  },
  // mounted() {
  //   this.$nextTick(() => {
  //     if (this.LiveGameData.length != 0) {
  //       this.showCollapse(0, true);
  //     }
  //   });
  // },
  methods: {
    ...mapMutations("Render", ["UpdatecanCloseAll", "UpdateisOpen"]),
    showCollapse(id, created = false) {
      if (created && this.isOpen.includes(id)) {
        return;
      }
      this.UpdateisOpen(id);
      this.$root.$emit("bv::toggle::collapse", `collapseDesktop_${id}`);
      let caret = this.$refs[`iconDesktop_${id}`][0];
      caret.classList.toggle("rotated");
    },
    proccessTimeToSimple(dateTimeString) {
      dateTimeString = dateTimeString.replace(
        `${new Date().getFullYear()}-`,
        ""
      );
      dateTimeString = dateTimeString.replace(" ", "<br />");
      dateTimeString = dateTimeString.replace("-", "/");
      dateTimeString = `<span>${dateTimeString}</span>`;
      return dateTimeString;
    },
  },
};
</script>

