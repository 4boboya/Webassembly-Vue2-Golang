<template>
  <div>
    <OtherNavbar class="nav-bar" />
    <div class="cont-live">
      <div>
        <router-view class="router-view-live" />
        <!-- <Footer /> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cont-live {
  width: 100%;
  height: calc(100vh - 70px);
  margin-top: 100px;
  background-color: #222629;
  transition: padding-left 0.5s ease;
  // overflow-y: overlay;
  overflow-y: scroll;
}
::-webkit-scrollbar {
  display: none;
}
.router-view-live {
  min-height: calc(100vh - 220px);
}
</style>