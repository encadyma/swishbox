<template>
  <header id="app-header" :class="{ hidden: $store.state.Interface.hideHeader }">
    <transition :name="($route.name === 'landing-page' ? 'slip-fade-left' : 'slip-fade-right')" mode="out-in">
      <h1 class="app-head-title" style="cursor: default;" v-if="$route.name === 'landing-page'" key="Swish">Swish</h1>
      <i class="app-head-title material-icons" v-else @click="goBack()" key="Back">arrow_back</i>
    </transition>
    <search-widget style="width: 50%; -webkit-app-region: no-drag;" :class="{ disabled: $store.state.Interface.hideHeader }"></search-widget>
    <now-playing-widget style="width: 25%;"></now-playing-widget>
    <traffic-lights @togglePlaylist="enablePlaylist = !enablePlaylist"></traffic-lights>
    <playlist-widget :isPlaylistToggled="enablePlaylist"></playlist-widget>
  </header>
</template>
<script>
  import SearchWidget from './Header/SearchWidget';
  import TrafficLights from './Header/TrafficLights';
  import PlaylistWidget from './Header/PlaylistWidget';
  import NowPlayingWidget from './Header/NowPlayingWidget';

  export default {
    data: function () {
      return { enablePlaylist: false };
    },
    components: { SearchWidget, TrafficLights, PlaylistWidget, NowPlayingWidget },
    methods: {
      goBack: function () {
        if (this.$route.name === 'search-page') return this.$router.push('/');
        return this.$router.go(-1);
      }
    }
  };
</script>
<style lang="scss">
  #app-header {
    display: flex;
    background-color: rgba(250, 250, 250, 0.9);
    position: fixed;
    top: 0;
    box-sizing: border-box;
    padding: 14px 20px;
    width: 100%;
    z-index: 100;
    min-height: 70px;
    -webkit-app-region: drag;

    align-items: center;
    justify-content: space-between;

    &.hidden { background-color: rgba(250, 250, 250, 0); }
    & > *.disabled { visibility: hidden; }

    .app-head-title { 
      cursor: pointer;
      font-weight: 300;
      margin: 0 10px;
      min-width: 80px;
      text-align: center;
      -webkit-user-select: none;
      transition: 250ms ease;

      &.material-icons { font-size: 1.8em; color: rgba(0, 0, 0, 0.6); }
      &.material-icons:hover { color: rgba(0, 0, 0, 0.8); }
    }
  }
</style>