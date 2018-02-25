<template>
  <header id="app-header" :class="{ hidden: $store.state.Interface.hideHeader, compressed: shouldCompress }">
    <transition :name="($route.name === 'home-page' ? 'slip-fade-left' : 'slip-fade-right')" mode="out-in">
      <h1 class="app-head-title" style="cursor: default;" v-if="$route.name === 'home-page'" key="Swish">Swish</h1>
      <i class="app-head-title material-icons" v-else @click="goBack()" key="Back">arrow_back</i>
    </transition>
    <search-widget style="width: 45%; -webkit-app-region: no-drag;" :class="{ disabled: $store.state.Interface.hideHeader }"></search-widget>
    <now-playing-widget style="width: 25%;"></now-playing-widget>
    <traffic-lights @togglePlaylist="togglePlaylist()"></traffic-lights>
    <playlist-widget :isPlaylistToggled="enablePlaylist"></playlist-widget>
  </header>
</template>
<script>
  import SearchWidget from './Header/SearchWidget';
  import TrafficLights from './Header/TrafficLights';
  import PlaylistWidget from './Header/PlaylistWidget';
  import NowPlayingWidget from './Header/NowPlayingWidget';

  export default {
    components: { SearchWidget, TrafficLights, PlaylistWidget, NowPlayingWidget },
    methods: {
      goBack() {
        document.body.scrollTop = 0;
        if (this.$route.name === 'search-page') return this.$router.push('/');
        return this.$router.go(-1);
      },
      togglePlaylist() {
        this.$store.commit('PLAYLIST_MUT_MENU_OPEN', !this.$store.state.Playlist.playlistMenuOpen);
      }
    },
    computed: {
      shouldCompress() {
        return this.$store.state.compressHeader;
      },
      enablePlaylist() {
        return this.$store.state.Playlist.playlistMenuOpen;
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
    padding: 0 20px;
    width: 100%;
    z-index: 100;
    min-height: 48px;
    -webkit-app-region: drag;

    align-items: center;
    justify-content: space-between;

    &.hidden { background-color: rgba(250, 250, 250, 0); }
    & > *.disabled { visibility: hidden; }

    .app-head-title { 
      cursor: pointer;
      font-weight: 300;
      margin: 0;
      min-width: 80px;
      text-align: center;
      -webkit-user-select: none;
      transition: 250ms ease;
      font-size: 1.6em;

      &.material-icons { font-size: 1.8em; color: rgba(0, 0, 0, 0.6); }
      &.material-icons:hover { color: rgba(0, 0, 0, 0.8); }
    }

    &.compressed {
      .app-head-title {
        font-size: 1.4em;
      }
      #app-search {
        .swish-omni {
          font-size: 0.75em;
          padding: 6px 10px;
          border-width: 3px;
        }
      }
    }
  }
</style>