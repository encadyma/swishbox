<template>
  <div id="app-electron-traffic-lights">
    <div class="swish-electron-traffic-light" @click="openPlaylist" :class="playlistClasses"><i class="material-icons" style="margin-left: 2px;">playlist_play</i></div>
    <div class="swish-electron-traffic-light" @click="openSettings" :class="settingsClasses"><i class="material-icons swish-mi-smaller">settings</i></div>
  </div>
</template>
<script>
  export default {
    methods: {
      openSettings() {
        if (this.$route.name === 'preferences-page') this.$router.go(-1);
        else this.$router.push({ name: 'preferences-page' });
      },
      openPlaylist() {
        this.$emit('togglePlaylist');
      }
    },
    computed: {
      playlistClasses() {
        return {
          enabled: this.$store.state.Playlist.playlist.length > 0,
          visiting: this.$store.state.Playlist.playlistMenuOpen
        };
      },
      settingsClasses() {
        return { visiting: this.$route.name === 'preferences-page' };
      }
    }
  };
</script>
<style lang="scss">
  #app-electron-traffic-lights {
    display: flex;
    vertical-align: middle;
    -webkit-user-select: none;
  }
  .swish-electron-traffic-light {
    display: inline-block;
    cursor: pointer;
    width: 36px;
    height: 50px;
    padding: 12px 6px;
    // border-radius: 3px;
    color: rgba(100, 100, 100, 0.6);
    overflow: hidden;
    // margin: 0 2px;
    border-bottom: 2px solid transparent;
    transition: 200ms ease;

    & .material-icons { font-size: 24px; }
    & .swish-mi-smaller { font-size: 18px; padding: 3px 4px; }

    &:hover {
      background-color: rgba(100, 100, 100, 0.2);
      color: rgba(100, 100, 100, 0.8);
    }

    &:active {
      background-color: rgba(100, 100, 100, 0.3);
    }

    &.visiting {
      background-color: #EFEFEF;
      border-color: #6823AE;
      color: #6823AE;

      &:hover { background-color: rgba(100, 100, 100, 0.2); }
    }

    &.enabled {
      color: #6823AE;
    }
  }
</style>