<template>
  <div class="root">
    <div class="content text-dark">
      <b-spinner
        class="loading ml-5"
        label="Loading..."
      />
      <div class="loadingText">
        <h1>Loading...</h1>
      </div>
    </div>
  </div>
</template>


<style>
.root {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0%;
  left: 0%;
  background-color: #d3d3d380;
  z-index: 9998;
}
.content {
  width: 160px;
  height: 56px;
  position: absolute;
  top: 50%;
  left: 50%;
  line-height: 56px;
  padding-left: 60px;
  font-size: 15px;
  z-index: 9999;
  -moz-border-radius: 20px;
  -webkit-border-radius: 20px;
  border-radius: 20px;
  transform: translate(-70%, -50%);
  filter: progid:DXImageTransform.Microsoft.Alpha(opacity=70);
}
.loadingText {
  content: "loading";
}
.loading{
  width: 3rem; 
  height: 3rem;
}
</style>
