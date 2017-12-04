<template>
  <div class="swish-search-result">
    <div class="swish-search-result-cover"></div>
    <div class="swish-search-result-text">
      <h3>{{result.title}}</h3>
      <div class="swish-search-subtitle swish-text-subtitle"><span>{{result.author.name}}</span><span>{{truncPlays}} plays</span></div>
      <div class="swish-text-helptext">{{description}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['result'],
    computed: {
      description: function () {
        return this.result.description.length > 70 ? `${this.result.description.substr(0, 70)}...` : this.result.description;
      },
      truncPlays: function () {
        const level = Math.log(this.result.views) / Math.log(10);
        if (isNaN(level)) return '0';
        else if (Math.floor(level) >= 9) return `${Math.trunc(this.result.views / 1000000000)}B`;
        else if (Math.floor(level) >= 6) return `${Math.trunc(this.result.views / 1000000)}M`;
        else if (Math.floor(level) >= 3) return `${Math.trunc(this.result.views / 1000)}K`;
        return `${this.result.views}`;
      }
    }
  };
</script>
<style lang="scss">
  .swish-search-result {
    cursor: pointer;
    border-radius: 6px;
    padding: 8px;
    width: 80%;
    -webkit-user-select: none;
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
    max-width: calc(80% - 160px);
  }
  .swish-search-subtitle span {
    display: inline-block;
    margin: 2px 0;
    margin-right: 10px;
  }
</style>