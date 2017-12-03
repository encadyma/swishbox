<template>
  <div id="app">
    <header-bar></header-bar>
    <div style="padding-top: 70px;"><router-view></router-view></div>
  </div>
</template>

<script>
  import HeaderBar from './components/HeaderBar';

  export default {
    name: 'swishbox',
    components: { HeaderBar },
  };
</script>

<style lang="scss">

  #app {
    z-index: 1;
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

  // TRANSITIONS
  .slip-fade-up-enter-active, .slip-fade-up-enter-active { transition: 300ms ease; }
  .slip-fade-up-enter, .slip-fade-up-leave-to { opacity: 0; transform: translateY(-20px); }

</style>
