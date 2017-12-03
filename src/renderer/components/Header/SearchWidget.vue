<template>
  <div id="app-search">
    <input class="swish-omni" :placeholder="placeholder" v-model.trim="userQuery" @keyup.enter="submitQuery()" @focus="isFocused = true" @blur="isFocused = false"/>
    <suggestion-widget :user-query="userQuery" :isFocused="isFocused" @updateQuery="updateQuery"></suggestion-widget>
  </div>
</template>
<script>
  import SuggestionWidget from './SuggestionsWidget';

  export default {
    components: { SuggestionWidget },
    data: () => ({
      isFocused: true,
      placeholder: 'Search for music...',
      userQuery: ''
    }),
    methods: {
      updateQuery: function (newQuery) {
        this.userQuery = newQuery;
        this.submitQuery();
      },
      submitQuery: function () {
        if (this.userQuery) this.$router.push({ name: 'search-page', query: { q: this.userQuery } });
      }
    }
  };
</script>
<style>
  .swish-omni {
    border: 0;
    background-color: #DFDFDF;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 1.2em;
    width: 100%;
  }
</style>