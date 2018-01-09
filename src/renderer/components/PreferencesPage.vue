<template>
  <div id="app-preferences">
    <div class="swish-grid-prefslead">
      <h2>About</h2>
      <p class="swish-text-subtitle">About Swishbox</p>
    </div>
    <div class="swish-grid-prefsbody">
      <div style="display: flex; align-items: center;">
        <img src="../assets/logo.png" height="80"/>
        <div style="margin-left: 20px;">
          <h4>Swishbox Nightly</h4>
          <span class="swish-text-subtitle">Version {{version}}</span>
        </div>
      </div>
    </div>
    <div class="swish-grid-prefslead">
      <h2>Cache</h2>
      <p class="swish-text-subtitle">Manage all offline songs</p>
    </div>
    <div class="swish-grid-prefsbody">
      <div v-if="hasBegunToClearCache">
        <div>
          <button class="swish-button-border red" @click="cleanCache()">Yes, Clean Cache</button>
          <button class="swish-button-border" @click="hasBegunToClearCache = false">No, Cancel</button>
          <span class="swish-text-helptext" style="margin-left: 20px;">Folder size: {{cacheSize}}MB</span>
        </div>
        <div class="swish-text-minitext swish-max-paragraph" style="margin-top: 10px; color: #FA2254;">
          WARNING: Clearing your cache will STOP the current song, CLEAR your playlist, and DELETE all offline songs.
          Continue?
        </div>
      </div>
      <div v-else>
        <div>
          <button class="swish-button-border" @click="hasBegunToClearCache = true">Clean Cache</button>
          <span class="swish-text-helptext" style="margin-left: 20px;">Folder size: {{cacheSize}}MB</span>
        </div>
        <div class="swish-text-minitext swish-max-paragraph" style="margin-top: 10px">
          Swishbox downloads and stores a copy of played songs into a local cache folder to make
          repeat listening simpler, even when offline.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'home-page',
    data() {
      return {
        version: process.env.SWISHBOX_VERSION,
        cacheSize: 0,
        hasBegunToClearCache: false
      };
    },
    mounted() {
      this.$electron.ipcRenderer.on('STORAGE_CACHE_UPDATE_SIZE', (event, size) => {
        this.cacheSize = size;
      });
      this.$electron.ipcRenderer.send('STORAGE_CACHE_GET_SIZE');
    },
    methods: {
      cleanCache() {
        this.$store.dispatch('PLAYLIST_CLEAR_SONGS');
        this.$electron.ipcRenderer.send('STORAGE_CACHE_PURGE');
        this.hasBegunToClearCache = false;
      }
    }
  };
</script>

<style>
#app-preferences {
  display: grid;
  padding: 20vh 10vw;
  grid-template-columns: 1fr 3fr;
  grid-gap: 40px;
  grid-auto-rows: min-content;
  min-height: 100vh;
}
</style>
