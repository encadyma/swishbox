<template>
  <header id="app-header">
    <h1 class="app-head-title">Swish</h1>
    <search-widget style="width: 50%"></search-widget>
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
    background-color: #FAFAFA;
    position: fixed;
    top: 0;
    box-sizing: border-box;
    padding: 14px 20px;
    width: 100%;
    z-index: 100;

    & > * { display: inline-block; vertical-align: middle; }

    .app-head-title { font-weight: 300; margin-right: 10px; }
  }
</style>