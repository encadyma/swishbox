<template>
  <header id="app-header">
    <transition :name="($route.name === 'landing-page' ? 'slip-fade-left' : 'slip-fade-right')" mode="out-in">
      <h1 class="app-head-title" v-if="$route.name === 'landing-page'" key="Swish">Swish</h1>
      <i class="app-head-title material-icons" v-else @click="$router.push('/')" key="Back">arrow_back</i>
    </transition>
    <search-widget style="width: 50%; -webkit-app-region: no-drag;"></search-widget>
    <div class="flack-spacing"></div>
    <traffic-lights></traffic-lights>
  </header>
</template>
<script>
  import SearchWidget from './Header/SearchWidget';
  import TrafficLights from './Header/TrafficLights';

  export default {
    components: { SearchWidget, TrafficLights },
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

    .app-head-title { 
      cursor: pointer;
      font-weight: 300;
      margin: 0 10px;
      min-width: 80px;
      text-align: center;

      &.material-icons { font-size: 1.8em; }
    }
  }

  .flack-spacing { width: 20%; }
</style>