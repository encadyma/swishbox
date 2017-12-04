<template>
  <header id="app-header">
    <transition :name="($route.name === 'landing-page' ? 'slip-fade-left' : 'slip-fade-right')" mode="out-in">
      <h1 class="app-head-title" v-if="$route.name === 'landing-page'" key="Swish">Swish</h1>
      <i class="app-head-title material-icons" v-else @click="$router.push('/')" key="Back">arrow_back</i>
    </transition>
    <search-widget style="width: 50%; -webkit-app-region: no-drag;"></search-widget>
  </header>
</template>
<script>
  import SearchWidget from './Header/SearchWidget';
  export default {
    components: { SearchWidget },
  };
</script>
<style lang="scss">
  #app-header {
    background-color: rgba(250, 250, 250, 0.9);
    position: fixed;
    top: 0;
    box-sizing: border-box;
    padding: 14px 20px;
    width: 100%;
    z-index: 100;
    min-height: 70px;
    -webkit-app-region: drag;

    & > * { display: inline-block; vertical-align: middle; }

    .app-head-title { 
      cursor: pointer;
      font-weight: 300;
      margin-right: 10px;
      min-width: 80px;
      text-align: center;

      &.material-icons { font-size: 1.8em; }
    }
  }
</style>