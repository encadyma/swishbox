<template>
  <div id="app-electron-traffic-lights">
    <div class="swish-electron-traffic-light" @click="openPlaylist" :class="{ enabled: $store.state.Playlist.playlist.length > 0 }"><i class="material-icons" style="margin-left: 2px;">playlist_play</i></div>
    <div class="swish-electron-traffic-light" @click="minimizeApp"><i class="material-icons">remove</i></div>
    <div class="swish-electron-traffic-light" @click="closeApp"><i class="material-icons">close</i></div>
  </div>
</template>
<script>
  export default {
    methods: {
      closeApp: function () {
        this.$modal.show('dialog', {
          title: 'Confirm Quit',
          text: 'Are you sure you want to quit Swishbox?',
          buttons: [
            { title: 'CANCEL', default: true, },
            { title: '<span class="swish-dialog-error">YES, QUIT</span>', handler: () => { this.$electron.ipcRenderer.send('APP_CLOSE'); } }
          ]
        });
      },
      minimizeApp: function () {
        this.$electron.ipcRenderer.send('APP_MINIMIZE');
      },
      openPlaylist: function () {
        this.$emit('togglePlaylist');
      }
    }
  };
</script>
<style lang="scss">
  #app-electron-traffic-lights {
    display: inline-block;
    vertical-align: middle;
    -webkit-user-select: none;
  }
  .swish-electron-traffic-light {
    display: inline-block;
    cursor: pointer;
    width: 30px;
    height: 30px;
    padding: 3px;
    border-radius: 3px;
    color: rgba(100, 100, 100, 0.6);
    overflow: hidden;
    margin: 0 2px;

    & .material-icons { font-size: 24px; }

    &:hover {
      background-color: rgba(100, 100, 100, 0.2);
      color: rgba(100, 100, 100, 0.8);
    }

    &:active {
      background-color: rgba(100, 100, 100, 0.3);
    }

    &.enabled { color: #6823AE; }
  }
</style>