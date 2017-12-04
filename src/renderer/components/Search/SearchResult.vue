<template>
  <div class="swish-search-result">
    <div class="swish-search-result-cover"></div>
    <div class="swish-search-result-text">
      <h3>{{result.title}}</h3>
      <div class="swish-search-subtitle swish-text-subtitle"><span>{{result.author.name}}</span><span>??M plays</span></div>
      <div class="swish-text-helptext">{{result.description}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['result']
  };
</script>
<style lang="scss">
  .swish-search-result {
    cursor: pointer;
    border-radius: 6px;
    padding: 8px;
    width: 80%;
    transition: box-shadow 150ms ease;
    &:hover { box-shadow: 0px 2px 32px 8px rgba(200, 200, 200, 0.2); transition: box-shadow 150ms ease; }
    &:hover .swish-search-result-cover { border-color: rgba(200, 200, 200, 0.4); }
    & > * { vertical-align: middle; }
  }
  .swish-search-result-cover {
    background: url(~@/assets/logo.png) #0A0A0A;
    background-size: auto 100%;
    background-position: center;
    background-repeat: no-repeat;
    display: inline-block;
    height: 90px;
    width: 140px;
    border: 4px solid rgba(200, 200, 200, 0);
    border-radius: 8px;
  }
  .swish-search-result-text {
    display: inline-block;
    margin-left: 20px;
  }
  .swish-search-subtitle span {
    display: inline-block;
    margin: 2px 0;
    margin-right: 10px;
  }
</style>