<template>
  <div id="app-subheader">
    <div class="app-subheader-title-main">Swishbox</div>
    <div class="app-subheader-traffic-lights">
      <div class="app-subheader-traffic-light" @click="minimizeApp"><i class="material-icons">remove</i></div>
      <div class="app-subheader-traffic-light" @click="closeApp"><i class="material-icons">close</i></div>
    </div>
  </div>
</template>
<style lang="scss">
#app-subheader {
  background-color: #333;
  color: #fff;
  cursor: default;
  display: flex;
  position: fixed;
  width: 100%;
  height: 30px;
  font-size: 14px;
  max-height: 30px;
  justify-content: space-between;
  -webkit-app-region: drag;
  z-index: 9999;
  transition: 150ms ease;

  .app-subheader-title-main {
    padding: 6px 16px;
  }

  &:active {
    background-color: #2C2C2C;
  }

  .app-subheader-traffic-lights {
    display: flex;

    .app-subheader-traffic-light {
      padding: 6px 8px;
      .material-icons {
        font-size: 18px;
      }
      &:hover {
        background-color: rgba(0, 0, 0, .2);
      }
      &:active {
        background-color: rgba(0, 0, 0, .4);
      }
    }
  }
}
</style>
<script>
export default {
  methods: {
    closeApp() {
      this.$modal.show('dialog', {
        title: 'Confirm Quit',
        text: 'Are you sure you want to quit Swishbox?',
        buttons: [
          { title: 'CANCEL', default: true, },
          {
            title: '<span class="swish-dialog-error">YES, QUIT</span>', 
            handler: () => { this.$electron.ipcRenderer.send('APP_CLOSE'); }
          }
        ]
      });
    },
    minimizeApp() {
      this.$electron.ipcRenderer.send('APP_MINIMIZE');
    },
  }
};
</script>
