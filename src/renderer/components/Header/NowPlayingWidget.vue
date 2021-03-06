<template>
  <div style="display: flex;">
    <div style="position: relative;">
      <canvas id="app-head-now-playing" width="480" height="80" ref="appHeadCanvas"></canvas>
      <div id="app-head-now-playing-overlay" v-if="currentPosition !== -1">
        <div style="margin: 0 auto; text-align: center;">
          <i class="material-icons swish-mi-sec" @click="sendPlaylistBackwards" :class="{disabled: currentPosition === 0}">skip_previous</i>
          <i class="material-icons swish-mi-prime" v-if="!isPlaying" @click="startPlay()">play_arrow</i>
          <i class="material-icons swish-mi-prime" v-if="isPlaying" @click="stopPlay()">pause</i>
          <i class="material-icons swish-mi-sec" @click="sendPlaylistForwards" :class="{disabled: currentPosition === currentPlaylist.length - 1}">skip_next</i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      frame: 0,
      canvas: null,
      ctx: null,
      isPlaying: false,
      hasError: null,
      currentDuration: 0,
      audioContext: null,
      currentSongSource: null,
      currentSongAudio: null,
      currentObjectAudio: null
    };
  },
  mounted() {
    // Initialize audio context
    const WindowAudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new WindowAudioContext();

    this.canvas = this.$refs.appHeadCanvas;
    this.ctx = this.canvas.getContext('2d');

    // Frame update code
    setInterval(() => {
      this.frame += 1;
      this.updateCanvas();
      if (this.currentPosition !== -1 && this.currentSongAudio !== null) {
        if (this.currentDuration >= this.currentSong.duration || this.currentSongAudio.ended) {
          if (!this.sendPlaylistForwards()) {
            this.stopPlay();
            this.currentDuration = 0;
          }
        }

        if (this.isPlaying) this.currentDuration = this.currentSongAudio.currentTime;
      }
    }, 100);

    // When the user switches positions in the playlist,
    // reset to start at beginning.
    this.$watch('$store.state.Playlist.currentPosition', function () {
      this.stopPlay();
      this.resetAudio();
      this.frame = 0;
      this.startPlay();
    });

    // Watch for when to load + play the song
    this.$watch('currentSongInQueue', function (newVal, oldVal) {
      if (oldVal === undefined || newVal === undefined) return;
      if (oldVal.id === newVal.id && newVal.canPlay && !oldVal.canPlay) {
        this.startPlay();
      }
    });

    this.$electron.ipcRenderer.on('YT_DOWNLOAD_PROGRESS', (event, progressObj) => {
      this.$store.commit('PLAYLIST_MUT_UPDATE_SONG_PROGRESS', progressObj);
    });

    this.$electron.ipcRenderer.on('PLAYER_TOGGLE_PLAY', () => {
      if (this.isPlaying) {
        this.stopPlay();
      } else {
        this.startPlay();
      }
    });
    this.$electron.ipcRenderer.on('PLAYER_PREVIOUS_SONG', this.sendPlaylistBackwards);
    this.$electron.ipcRenderer.on('PLAYER_NEXT_SONG', this.sendPlaylistForwards);
  },
  beforeDestroy() {
    this.audioContext.close();
  },
  methods: {
    startPlay() {
      this.loadSong().then((response) => {
        if (response) {
          this.$electron.ipcRenderer.send('PLAYER_MUSIC_NOTIFICATION', this.currentSong);
          this.currentSongAudio.play();
        }
        this.isPlaying = response;
      });
    },
    stopPlay() {
      if (this.currentSongSource === null) return false;
      this.currentSongAudio.pause();
      this.isPlaying = false;
      return true;
    },
    resetAudio() {
      if (this.currentObjectAudio) URL.revokeObjectURL(this.currentObjectAudio);
      this.currentDuration = 0;
      this.currentSongAudio = null;
      this.currentSongSource = null;
      this.currentObjectAudio = null;
      this.hasError = null;
    },
    loadSong() {
      if (this.currentSongSource !== null) return Promise.resolve(true);
      if (this.currentPosition === -1) return Promise.resolve(false);
      if (this.isLoading) return Promise.resolve(false);

      const fileSystem = this.$electron.remote.require('fs');

      return new Promise((resolve) => {
        fileSystem.readFile(this.currentSongInQueue.path, (err, b) => {
          if (err) {
            this.hasError = err;
            return;
          }

          this.hasError = null;

          const ab = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);

          const blob = new Blob([ab]);
          this.currentObjectAudio = URL.createObjectURL(blob);

          this.currentSongAudio = new Audio(this.currentObjectAudio);
          this.currentSongAudio.controls = true;
          this.currentSongAudio.autoplay = false;
          this.currentSongAudio.loop = false;

          this.currentSongSource = this.audioContext.createMediaElementSource(this.currentSongAudio);

          this.currentSongSource.connect(this.audioContext.destination);
          resolve(true);
        });
      });
    },
    sendPlaylistBackwards() {
      if (this.currentPosition === 0) return false;
      this.stopPlay();
      this.$store.dispatch('PLAYLIST_CHANGE_SONG', this.currentPosition - 1);
      this.startPlay();
      return true;
    },
    sendPlaylistForwards() {
      if (this.currentPosition === this.currentPlaylist.length - 1) return false;
      this.stopPlay();
      this.$store.dispatch('PLAYLIST_CHANGE_SONG', this.currentPosition + 1);
      this.startPlay();
      return true;
    },
    updateCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.resetSettings();

      const statusText = this.currentPosition === -1 ?
        'NO SONGS PLAYLING' :
        this.currentPlaylist[this.currentPosition].title;

      const statusTextMeasure = this.ctx.measureText(statusText);
      const scrollPosition = ((this.frame * 6) % (480 + (statusTextMeasure.width))) - statusTextMeasure.width;

      this.ctx.fillText(statusText,
        this.currentPosition !== -1 ? scrollPosition : 160,
        this.currentPosition !== -1 ? 70 : 50);

      if (this.hasError) {
        this.drawErrorAnimation();
      } else if (this.isLoading) {
        this.drawLoading(this.currentProgress, `${this.currentDownloadSpeed}kbps`);
      } else if (this.currentPosition !== -1) {
        this.drawPlayingAnimation();
      }
    },
    // Drawing the loading bars for download progress
    drawLoading(progress, helpText) {
      progress = (progress >= 100 ? 100 : progress);
      this.ctx.fillRect(10, 14, 4.6 * progress, 24);

      this.ctx.globalCompositeOperation = 'color-dodge';
      this.ctx.textAlign = 'center';
      this.ctx.font = '18px Source Sans Pro';
      this.ctx.fillText(`${Math.round(progress)}%${helpText ? ` (${helpText})` : ''}`, 240, 32);
      this.resetSettings();
    },
    // Drawing the song playing bar
    drawPlayingAnimation() {
      const startDur = this.genStrDuration(this.currentDuration);
      const endDur = this.genStrDuration(this.currentSong.duration);

      this.ctx.font = '18px Source Sans Pro';
      this.ctx.textAlign = 'left';
      this.ctx.fillText(startDur, 20, 28);

      this.ctx.textAlign = 'right';
      this.ctx.fillText(endDur, 460, 28);

      const totalLen = (400 - this.ctx.measureText(endDur).width) - this.ctx.measureText(startDur).width;

      this.ctx.fillStyle = '#DDDDDD';
      this.ctx.fillRect(40 + this.ctx.measureText(startDur).width, 20, totalLen, 4);

      const playedLen = (this.currentDuration * totalLen) / this.currentSong.duration;

      this.ctx.fillStyle = '#BBBBBB';
      this.ctx.fillRect(40 + this.ctx.measureText(startDur).width, 20, playedLen <= totalLen ? playedLen : totalLen, 4);

      this.resetSettings();
    },
    drawErrorAnimation() {
      this.ctx.font = '36px Material Icons';
      this.ctx.textAlign = 'left';
      if (this.frame % 12 <= 6) this.ctx.fillText('warning', 100, 42);
      this.ctx.font = '18px Source Sans Pro';
      this.ctx.textAlign = 'right';
      if (this.frame % 12 <= 6) this.ctx.fillText('Could not locate the music file.', 380, 28);
      this.resetSettings();
    },
    resetSettings() {
      this.ctx.fillStyle = '#AAAAAA';
      this.ctx.font = '20px Source Sans Pro';
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.textAlign = 'start';
    },
    genStrDuration(duration) {
      let dur = [];

      duration = Math.round(duration);

      // Add hours only if necessary
      if (duration >= 3600) {
        dur.push(Math.trunc(duration / 3600).toString());
      }

      dur.push(`${duration ? '00' : '0'}${Math.trunc((duration % 3600) / 60)}`);
      dur.push(`00${duration % 60}`);

      dur = dur.map(str => str.substr(-2, 2));

      return dur.join(':');
    }
  },
  computed: {
    currentPlaylist() {
      return this.$store.state.Playlist.playlist;
    },
    currentPosition() {
      return this.$store.state.Playlist.currentPosition;
    },
    currentSong() {
      return this.currentPlaylist[this.currentPosition];
    },
    isLoading() {
      // MEANING: Finished downloading
      if (this.currentPosition === -1) return false;
      return !this.currentQueue[this.currentPlaylist[this.currentPosition].id].hasFinished;
    },
    currentQueue() {
      return this.$store.state.Playlist.masterQueue;
    },
    currentSongInQueue() {
      if (this.currentPosition === -1) return undefined;
      return this.currentQueue[this.currentPlaylist[this.currentPosition].id];
    },
    currentProgress() {
      if (this.currentPosition === -1) return 0;
      return this.currentQueue[this.currentPlaylist[this.currentPosition].id].loading;
    },
    currentDownloadSpeed() {
      if (!this.isLoading) return 0;
      return this.currentQueue[this.currentPlaylist[this.currentPosition].id].dlSpeed;
    }
  }
};

</script>

<style lang="scss">
#app-head-now-playing {
  width: 240px;
  height: 40px;
}
#app-head-now-playing-overlay {
  width: 240px;
  height: 40px;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  background-color: rgba(250, 250, 250, 0.6);
  cursor: default;

  .material-icons {
    display: inline-block;
    vertical-align: middle;
    color: #333;
    
    &:active {
      color: #222;
    }

    &.disabled {
      color: #888 !important;
    }
  }

  &:hover {
    opacity: 1;
  }
}

.swish-mi-prime {
  font-size: 36px;
}

.swish-now-playing-action-btn {
  display: inline-block;
  cursor: pointer;
  width: 50px;
  height: 50px;
  padding: 12px 16px;
  // border-radius: 3px;
  color: rgba(100, 100, 100, 0.6);
  overflow: hidden;
  // margin: 0 2px;
  border-bottom: 2px solid transparent;
  transition: 200ms ease;

  & .material-icons { font-size: 24px; }
  & .swish-mi-smaller { font-size: 18px; padding: 3px 4px; }

  &:hover {
    background-color: rgba(100, 100, 100, 0.2);
    color: rgba(100, 100, 100, 0.8);
  }

  &:active {
    background-color: rgba(100, 100, 100, 0.3);
  }

  &.visiting {
    background-color: #EFEFEF;
    border-color: #6823AE;
    color: #6823AE;

    &:hover { background-color: rgba(100, 100, 100, 0.2); }
  }

  &.enabled {
    color: #6823AE;
  }
}
</style>