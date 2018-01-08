<template>
  <transition name="slip-fade-up">
    <div id="app-header-playlist" v-if="isPlaylistToggled">

      <!-- Top bar with Title + Clear button -->
      <div>
        <div class="swish-text-minitext" style="float: left;">CURRENT PLAYLIST</div>
        <div class="swish-text-minitext swish-text-button" :class="{ disabled: Playlist.playlist.length === 0 }" style="float: right;" @click="clearPlaylist">CLEAR</div>
      </div>

      <!-- Container for playlist songs. Overflow if needed. -->
      <div style="max-height: 360px; overflow: scroll; clear: both;">
        <div class="swish-playlist-item" v-for="(song, index) of Playlist.playlist" :key="song.title" v-show="Playlist.playlist.length" @click="selectSong(index)" @dblclick="switchSongs(index)"  :class="{ selected: selectedSong === index, playing: Playlist.currentPosition === index }">
          <div class="swish-playlist-item-title">
            <i class="material-icons" v-if="Playlist.currentPosition === index">play_arrow</i>
            <span class="swish-text-title">{{ song.title }}</span>
            <span class="swish-text-subtitle" v-if="song.author.name">{{ song.author.name }}</span>
          </div>
        </div>
      </div>

      <!-- Playlist Counter -->
      <div v-if="Playlist.playlist.length" class="swish-text-miniminitext swish-playlist-counter">THERE ARE {{Playlist.playlist.length}} SONGS IN YOUR PLAYLIST</div>
      
      <!-- Show when there are no songs in the playlist -->
      <div v-if="!Playlist.playlist.length" style="text-align: center; padding: 40px;">
        <p style="line-height: 1.5; max-width: 60%; margin: 0 auto;">There are no songs in the playlist yet. Why not search for a bit and add some?</p>
      </div>
    </div>
  </transition>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    props: ['isPlaylistToggled'],
    data() {
      return { selectedSong: -1 };
    },
    computed: {
      ...mapState(['Playlist'])
    },
    methods: {
      clearPlaylist() {
        if (this.Playlist.playlist.length > 0) {
          this.$modal.show('dialog', {
            title: 'Confirm Clear Playlist',
            text: 'Are you sure you want to clear your playlist?',
            buttons: [
              { title: 'CANCEL' },
              { title: '<span class="swish-dialog-error">YES, CLEAR</span>', default: true, handler: () => { this.selectedSong = -1; this.$store.dispatch('PLAYLIST_CLEAR_SONGS'); this.$modal.hide('dialog'); } }
            ]
          });
        }
      },
      selectSong(index) {
        this.selectedSong = index;
      },
      switchSongs(index) {
        this.$store.dispatch('PLAYLIST_CHANGE_SONG', index);
      }
    },
    watch: {
      isPlaylistToggled(val) {
        // Deselect any selected songs once the playlist is hidden
        if (!val) this.selectedSong = -1;
      }
    }
  };
</script>

<style lang="scss">
  #app-header-playlist {
    position: fixed;
    top: 80px;
    right: 90px;
    border: 1px solid #EFEFEF;
    background-color: rgba(250, 250, 250, 0.9);
    border-radius: 6px;
    width: 40%;
    box-shadow: 0px 2px 16px 8px rgba(100, 100, 100, 0.1);
    transition: all 300ms ease;
    -webkit-user-select: none;
    cursor: default;

    .swish-text-minitext { padding: 8px 12px; }
  }

  .swish-playlist-item {
    box-sizing: border-box;
    padding: 8px 12px;
    width: 100%;
    
    .swish-text-subtitle { margin-left: 8px; }
    .swish-playlist-item-title > * { vertical-align: middle; }

    &.selected {
      background-color: rgba(100, 100, 100, 0.1);
    }

    &.playing {
      background: #6823AE;
      color: rgba(250, 250, 250, 0.9);

      .swish-text-subtitle { color: rgba(250, 250, 250, 0.4); }
    }
  }

  .swish-playlist-counter {
    text-align: center;
    padding: 8px 0;
  }
</style>