<template>
  <div id="app-vplayer-page">
    <youtube :video-id="$route.query.video" :player-vars="{autoplay: 1}"></youtube>
  </div>
</template>
<style>
  #app-vplayer-page {
    padding: 80px 20px;
    min-height: 100%;
  }
</style>
