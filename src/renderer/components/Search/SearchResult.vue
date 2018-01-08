<template>
  <div class="swish-search-result" :class="{ isLoading: loading }">
    <div class="swish-search-result-cover" :style="{ backgroundImage: `url(${result.thumbnails.medium.url})` }">
      <div class="swish-search-result-duration">{{strDuration}}</div>
    </div>
    <div class="swish-search-result-text">
      <h3>{{result.title}}</h3>
      <div class="swish-search-subtitle swish-text-subtitle"><span>{{result.author.name}}</span><span>{{truncPlays}} plays</span></div>
      <div class="swish-text-helptext swish-search-description">{{description}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['result', 'loading'],
    computed: {
      description() {
        return this.result.description.length > 70 ? `${this.result.description.substr(0, 70)}...` : this.result.description;
      },
      truncPlays() {
        const level = Math.log(this.result.views) / Math.log(10);
        if (isNaN(level)) return '0';
        else if (Math.floor(level) >= 9) return `${Math.trunc(this.result.views / 1000000000)}B`;
        else if (Math.floor(level) >= 6) return `${Math.trunc(this.result.views / 1000000)}M`;
        else if (Math.floor(level) >= 3) return `${Math.trunc(this.result.views / 1000)}K`;
        return `${this.result.views}`;
      },
      strDuration() {
        let dur = [];

        // Add hours only if necessary
        if (this.result.duration >= 3600) {
          dur.push(Math.trunc(this.result.duration / 3600).toString());
        }

        dur.push(`${this.result.duration ? '00' : ''}${Math.trunc((this.result.duration % 3600) / 60)}`);
        dur.push(`00${this.result.duration % 60}`);

        dur = dur.map(str => str.substr(-2, 2));

        return dur.join(':');
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
    & > * { vertical-align: middle; }
  }
  .swish-search-result-cover {
    background: url(~@/assets/placeholder.png) #0A0A0A;
    background-size: auto 100%;
    background-position: center;
    background-repeat: no-repeat;
    display: inline-block;
    height: 90px;
    width: 140px;
    // border: 4px solid rgba(200, 200, 200, 0);
    border-radius: 8px;
    overflow: hidden;
    position: relative;

    &:after {
      content: 'play_arrow';
      font-family: 'Material Icons';
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(200, 200, 200, 0);
      color: rgba(200, 200, 200, 0);
      transition: 150ms ease;
      text-align: center;
      font-weight: 700;
      font-size: 48px;
      padding: 20px 0;
    }

    & .swish-search-result-duration {
      display: inline-block;
      font-size: 12px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 2px;
      color: rgba(250, 250, 250, 1);
      background-color: rgba(0, 0, 0, 0.6);
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
  }

  .swish-search-result:hover .swish-search-result-cover:after {
    background-color: rgba(200, 200, 200, 0.6);
    color: rgba(20, 20, 20, 1);
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

  // .isLoading
  .swish-search-result.isLoading {
    .swish-search-result-cover {
      background: #6A6A6A !important;
      border: none;

      &:after, &:before { display: none; }
      .swish-search-result-duration { visibility: hidden; }
    }
    .swish-search-result-text {
      h3 { 
        width: 80%;
        height: 20px;
        margin: 4px 0;
        background: lighten(#8A8A8A, 8%);
        border-radius: 12px;
        font-size: 0;
        animation: is-loading-pulsating infinite 1000ms;
      }
      .swish-search-subtitle span { 
        display: inline-block;
        width: 30%;
        height: 12px;
        background: lighten(#8A8A8A, 20%);
        border-radius: 12px;
        font-size: 0;
        vertical-align: middle;
        animation: is-loading-pulsating infinite 1000ms;
      }
      .swish-search-description { visibility: hidden; }
    }
  }

  @keyframes is-loading-pulsating {
    0% { opacity: 1; }
    50% { opacity: 0.6; }
    100% { opacity: 1; }
  }
</style>