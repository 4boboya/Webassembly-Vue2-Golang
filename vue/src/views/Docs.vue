<template>
  <div>
    <OtherNavbar class="nav-bar" />
    <div class="cont-docs">
      <smooth-scrollbar>
        <div>
          <router-view class="router-view-docs" />
          <Footer />
        </div>
      </smooth-scrollbar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cont-docs {
    width: 100%;
    height: calc(100vh - 70px);
    margin-top: 100px;
    background-color: #222629;
    transition: padding-left 0.5s ease;
    overflow-y: overlay;
}
.router-view-docs{
    min-height: calc(100vh - 220px);
}
</style>