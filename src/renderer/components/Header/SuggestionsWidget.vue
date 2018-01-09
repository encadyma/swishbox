<template>
  <transition name="slip-fade-up">
    <div id="app-search-suggestions" v-if="isFocused">
      
      <div class="swish-text-minitext" v-if="userQuery">SEARCHING FOR {{userQuery}}</div>

      <!-- BEGIN SUGGESTIONS -->
      <div class="swish-search-suggestion" v-for="result of queryResults" :key="result.title" v-show="userQuery" @click="$emit('updateQuery', result.title)">
        <div class="swish-search-suggestion-title">
          <span class="swish-text-title">{{ result.title }}</span>
          <span class="swish-text-subtitle" v-if="result.subtitle">{{ result.subtitle }}</span>
        </div>
        <div class="swish-text-helptext" v-if="result.helptext">{{ result.helptext }}</div>
      </div>
      <!--  END SUGGESTIONS  -->

      <!-- Show when there is nothing searched for -->
      <div v-if="!userQuery" style="text-align: center; padding: 40px;">
        <p style="line-height: 1.5; max-width: 60%; margin: 0 auto;">Input a song title, genre, keyword, etc. and let the results flow...</p>
      </div>

    </div>
  </transition>
</template>
<script>
  import API from '../../../api';

  export default {
    props: ['userQuery', 'isFocused'],
    data() {
      return {
        loading: true,
        queryResults: []
      };
    },
    watch: {
      userQuery() {
        // Give suggestions based on query results
        this.loading = true;
        API.getSearchSuggestions(this.userQuery).then((suggestions) => {
          this.loading = false;
          this.queryResults = suggestions;
        });
      }
    }
  };
</script>
<style lang="scss">
  #app-search-suggestions {
    position: fixed;
    top: 80px;
    border: 1px solid #EFEFEF;
    background-color: rgba(250, 250, 250, 0.9);
    border-radius: 6px;
    width: 60%;
    box-shadow: 0px 2px 16px 8px rgba(100, 100, 100, 0.1);
    transition: all 300ms ease;
    cursor: default;
    -webkit-user-select: none;

    .swish-text-minitext { padding: 8px 12px; }
  }
  .swish-search-suggestion {
    box-sizing: border-box;
    padding: 8px 12px;
    width: 100%;
    
    .swish-text-subtitle { margin-left: 8px; }

    &:hover {
      background-color: rgba(100, 100, 100, 0.1);
      cursor: pointer;
    }
  }
</style>