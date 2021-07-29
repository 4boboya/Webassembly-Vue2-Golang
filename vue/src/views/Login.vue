<template>
  <div>
    <LoginNavbar class="nav-bar" />
    <div class="cont-login">
      <smooth-scrollbar>
        <div>
          <router-view class="router-view-login" />
          <Footer />
        </div>
      </smooth-scrollbar>
    </div>
  </div>
</template>

