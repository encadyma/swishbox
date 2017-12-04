<template>
  <div id="app-search-results">
    <div id="app-search-results-head">
      <h1 class="swish-head-betitle" style="display: inline-block;">{{$route.query.q}}</h1>
      <span class="swish-text-subtitle">{{results.length}} results</span>
    </div>
    <div id="app-search-results-body">
      <div v-for="result of results" :key="result.id" style="margin: 5px 0;">
        <search-result :result="result"></search-result>
      </div>
    </div>
  </div>
</template>

<script>
  import SearchResult from './Search/SearchResult';

  export default {
    components: { SearchResult },
    data: function () {
      return {
        results: [
          { id: 'LfephiFN76E', title: '[MV] REOL - No title', description: 'Music&Lyrics,Vocal : Reol\nTrack&Chorus : Giga\nMovie&Chorus : Okiku', author: { name: 'REOL Official', id: 'UCB6pJFaFByws3dQj4AdLdyA' }, views: 17347735 },
          { id: 'LfephiFN76E', title: '[MV] REOL - No title', description: 'Music&Lyrics,Vocal : Reol\nTrack&Chorus : Giga\nMovie&Chorus : Okiku', author: { name: 'REOL Official', id: 'UCB6pJFaFByws3dQj4AdLdyA' }, views: 17347735 },
          { id: 'LfephiFN76E', title: '[MV] REOL - No title', description: 'Music&Lyrics,Vocal : Reol\nTrack&Chorus : Giga\nMovie&Chorus : Okiku', author: { name: 'REOL Official', id: 'UCB6pJFaFByws3dQj4AdLdyA' }, views: 17347735 }
        ]
      };
    }
  };
</script>

<style lang="scss">
  #app-search-results-head {
    padding: 10px 40px;
    margin-top: 10px;

    & > * { display: inline-block; }
    .swish-text-subtitle { font-size: 1em; margin-left: 10px; }

  }

  #app-search-results-body {
    padding: 10px 40px;
    min-height: 100vh;
  }
</style>
