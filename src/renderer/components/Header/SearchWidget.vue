<template>
  <div id="app-search">
    <input class="swish-omni" :placeholder="placeholder" v-model.trim="userQuery" @keyup.enter="submitQuery()" @focus="isFocused = true" @blur="isFocused = false" v-focus="isFocused"/>
    <suggestion-widget :user-query="userQuery" :isFocused="isFocused" @updateQuery="updateQuery"></suggestion-widget>
  </div>
</template>
<script>
  import { focus } from 'vue-focus';
  import SuggestionWidget from './SuggestionsWidget';

  export default {
    components: { SuggestionWidget },
    directives: { focus: focus },
    data: () => ({
      isFocused: false,
      placeholder: 'Search for music...',
      userQuery: ''
    }),
    methods: {
      updateQuery: function (newQuery) {
        // Called when the user selected something from the menu
        this.userQuery = newQuery;
        this.submitQuery();
      },
      submitQuery: function () {
        // Defocus the search box and navigate to the search page
        this.isFocused = false;
        if (this.userQuery) this.$router.push({ name: 'search-page', query: { q: this.userQuery } });
      }
    },
    watch: {
      isFocused: function (val) {
        // Activate the overlay appropriately.
        this.$store.dispatch('INTERFACE_SET_OVERLAY', val);
      }
    },
    mounted: function () {
      // Clear out the search query when navigating to the home page
      this.$watch('$route.name', function (newVal, oldVal) {
        if (oldVal !== newVal && newVal === 'home-page') this.userQuery = '';
      });
    }
  };
</script>
<style lang="scss">
  .swish-omni {
    border: 0;
    background-color: #DFDFDF;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 1.2em;
    width: 100%;
    outline: none;
    border: 4px solid rgba(0, 0, 200, 0);
    transition: 200ms ease;
  }
  .swish-omni:focus {
    animation: input-focus 200ms ease-out;
    box-shadow: 0 0 16px 0 rgba(40, 0, 200, 0.2);
    border-color: rgba(40, 0, 200, 0.2);
    transition: 200ms ease;
  }

  @keyframes input-focus {
    0% { box-shadow: 0 0 32px 24px rgba(40, 0, 200, 0); }
    100% { box-shadow: 0 0 16px 0 rgba(40, 0, 200, 0.2); }
  }
</style>