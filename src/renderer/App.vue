<template>
  <div id="app">
    <header-bar></header-bar>
    <div id="app-overlay" :class="{ hidden: !$store.state.Interface.overlayEnabled }"></div>
    <router-view></router-view>
    <notifications group="player" position="bottom right"/>
    <v-dialog/>
  </div>
</template>

<script>
  import HeaderBar from './components/HeaderBar';

  export default {
    name: 'swishbox',
    components: { HeaderBar }
  };
</script>

<style lang="scss">

  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,600,700');
  @import './assets/material-icons.scss';

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #app {
    background-color: rgba(255, 255, 255, 0.9);
    z-index: 1;
  }

  #app-overlay {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 98;
    background-color: rgba(0, 0, 0, 0.2);
    transition: 300ms ease;

    &.hidden { background-color: rgba(0, 0, 0, 0); visibility: hidden; transition: 300ms ease; }
  }

  .container-push { padding-top: 65px; }

  .swish-head-betitle {
    font-size: 2.4em;
    font-weight: 300;
  }

  .swish-text-title {
    font-size: 1.1em;
    font-weight: 600;
  }

  .swish-text-subtitle {
    color: rgba(0, 0, 0, 0.4);
    font-size: 0.96em;
    font-weight: 400;
  }

  .swish-text-helptext {
    color: rgba(0, 0, 0, 0.6);
    font-size: 0.8em;
  }

  .swish-text-minitext {
    color: rgba(0, 0, 0, 0.35);
    font-size: 0.8em;
    font-weight: 600;
  }

  .swish-text-button {
    color: rgba(0, 0, 0, 0.35);
    cursor: pointer;
    &:hover { color: rgba(0, 0, 0, 0.5); }
    &.disabled { cursor: default; color: rgba(0, 0, 0, 0.2); }
  }

  .swish-text-miniminitext {
    color: rgba(0, 0, 0, 0.35);
    font-size: 0.7em;
    font-weight: 600;
  }

  .swish-bubble-error {
    background-color: rgba(250, 250, 250, 0.5);
    border-radius: 4px;
    border: 1px solid #FA2254;
    color: rgba(150, 0, 0, 0.6);
    font-size: 0.8em;
    padding: 8px 12px;
    max-width: 700px;

    p {
      margin: 6px 0;
    }

    pre.fulllog {
      margin: 6px;
    }
  }

  .swish-block-padded-vert { padding: 8px 0; }

  .swish-text-center { text-align: center; }

  // TRANSITIONS
  .slip-fade-up-enter-active, .slip-fade-up-enter-active { transition: 300ms ease; }
  .slip-fade-up-enter, .slip-fade-up-leave-to { opacity: 0; transform: translateY(-20px); }

  .slip-fade-left-enter-active, .slip-fade-left-enter-active { transition: 300ms ease; }
  .slip-fade-left-enter, .slip-fade-left-leave-to { opacity: 0; transform: translate(-20px); }

  .slip-fade-right-enter-active, .slip-fade-right-enter-active { transition: 300ms ease; }
  .slip-fade-right-enter, .slip-fade-right-leave-to { opacity: 0; transform: translate(20px); }

  // FOR DIALOGS
  .swish-dialog-error { font-weight: 600; color: #fa0000; }

</style>
