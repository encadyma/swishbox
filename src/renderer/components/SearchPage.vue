<template>
  <div id="app-search-results" class="container-push">
    <div id="app-search-results-head">
      <h1 class="swish-head-betitle" style="display: inline-block;">{{$route.query.q}}</h1>
      <span class="swish-text-subtitle" v-if="!loading && !error">{{results.length}} results</span>
    </div>
    <div id="app-search-results-body">
      <div class="swish-bubble-error" v-if="error">
        <p><b>An error occurred.</b> Unfortunately, it looks like something has gone wrong. This may be because of
        a poor network connection or a server error on our side. Try using the search tool on a different term to see if this error occurs again.</p>
        <p>If this error persists, please make full note of the situation and file a Github Issue in this project's repository <u style="cursor: pointer;" @click="$electron.shell.openExternal('https://github.com/encadyma/swishbox/issues')">here</u>.</p>
        <p>Last Error Log: <pre class="fulllog">{{lastError}}</pre></p>
      </div>
      <div v-if="!error">
        <div v-for="result of results" :key="result.id" style="margin: 5px 0;" @click="addSongToPlaylist(result)">
          <search-result :result="result" :loading="loading"></search-result>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
  import API from '../../api';
  import SearchResult from './Search/SearchResult';

  export default {
    components: { SearchResult },
    data() {
      return {
        loading: true,
        results: API.sampleVideos,
        error: false,
        lastError: null
      };
    },
    methods: {
      addSongToPlaylist(song) {
        if (this.loading) return;
        this.$store.dispatch('PLAYLIST_ADD_SONG', song);
        // this.goToVideo(song.id);
        this.$electron.ipcRenderer.send('YT_DOWNLOAD', song.id);
        this.$notify({
          group: 'player',
          title: `${song.title}`,
          text: 'has been added to the playlist.'
        });
      },
      loadSearch() {
        this.loading = true;
        this.error = false;
        API.getVideosWithQuery(this.$route.query.q).then((results) => {
          this.results = results;
          this.loading = false;
        }).catch((err) => {
          this.error = true;
          this.lastError = err;
          this.loading = false;
        });
      },
      goToVideo(videoId) {
        this.$router.push({ name: 'video-page', query: { video: videoId } });
      }
    },
    mounted() {
      this.loadSearch();
      this.$watch('$route.query.q', this.loadSearch);
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
