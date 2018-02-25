<template>
  <div id="app-search">
    <input class="swish-omni" :placeholder="placeholder" v-model.trim="userQuery" @keyup.enter="submitQuery()" @keydown.down.prevent="moveScrollDown()" @keydown.up.prevent="moveScrollUp()" @keydown.left.prevent="returnToLastQuery()" @keydown.right.prevent="setSearchQuery()" @focus="isFocused = true" @blur="isFocused = false" v-focus="isFocused"/>
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
      userQuery: '',
      queriesHistory: []
    }),
    methods: {
      updateQuery(newQuery) {
        // Called when the user selected something from the menu
        this.userQuery = newQuery;
        this.submitQuery();
      },
      submitQuery() {
        // Defocus the search box and navigate to the search page
        this.isFocused = false;
        if (this.userQuery) this.$router.push({ name: 'search-page', query: { q: this.userQuery } });
      },
      moveScrollDown() {
        this.$store.commit('INTERFACE_MUT_SET_SUGGESTIONS_SCROLL', this.suggestionsScroll + 1);
      },
      moveScrollUp() {
        this.$store.commit('INTERFACE_MUT_SET_SUGGESTIONS_SCROLL', this.suggestionsScroll - 1);
      },
      setSearchQuery() {
        if (
          this.suggestionsScroll > -1 && 
          this.suggestionsScroll < this.suggestionsResults.length
        ) {
          this.queriesHistory.push(this.userQuery);
          this.userQuery = this.suggestionsResults[this.suggestionsScroll].title;
        }
      },
      returnToLastQuery() {
        if (this.queriesHistory.length) {
          this.userQuery = this.queriesHistory.pop();
        }
      }
    },
    watch: {
      isFocused(val) {
        // Activate the overlay appropriately.
        if (this.$store.state.Playlist.playlistMenuOpen) {
          this.$store.commit('PLAYLIST_MUT_MENU_OPEN', false);
        }
        this.$store.commit('INTERFACE_MUT_SET_SUGGESTIONS_SCROLL', -1);
        this.$store.dispatch('INTERFACE_SET_OVERLAY', val);
      }
    },
    computed: {
      suggestionsScroll() {
        return this.$store.state.Interface.suggestionsScroll;
      },
      suggestionsResults() {
        return this.$store.state.Interface.suggestionsResults;
      }
    },
    mounted() {
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
    background-color: #EAEAEA;
    padding: 12px 12px;
    // border-radius: 6px;
    font-size: 1em;
    width: 100%;
    outline: none;
    border: 4px solid rgba(0, 0, 200, 0);
    transition: 200ms ease;
  }
  .swish-omni:focus {
    // animation: input-focus 200ms ease-out;
    // box-shadow: 0 0 16px 0 rgba(40, 0, 200, 0.2);
    // border-color: rgba(40, 0, 200, 0.2);
    background-color: #D8D8D8;
    transition: 200ms ease;
  }

  @keyframes input-focus {
    0% { box-shadow: 0 0 32px 24px rgba(40, 0, 200, 0); }
    100% { box-shadow: 0 0 16px 0 rgba(40, 0, 200, 0.2); }
  }
</style>