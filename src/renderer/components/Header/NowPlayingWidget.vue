<template>
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
</template>
<script>

export default {
  data: function () {
    return {
      frame: 0,
      canvas: null,
      ctx: null,
      isPlaying: false,
      currentDuration: 0,
      audioContext: null,
      currentSongSource: null,
      currentSongAudio: null,
      currentObjectAudio: null
    };
  },
  mounted: function () {
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
  },
  beforeDestroy: function () {
    this.audioContext.close();
  },
  methods: {
    startPlay: function () {
      this.loadSong().then((response) => {
        if (response) this.currentSongAudio.play();
        this.isPlaying = response;
      });
    },
    stopPlay: function () {
      if (this.currentSongSource === null) return false;
      this.currentSongAudio.pause();
      this.isPlaying = false;
      return true;
    },
    resetAudio: function () {
      if (this.currentObjectAudio) URL.revokeObjectURL(this.currentObjectAudio);
      this.currentDuration = 0;
      this.currentSongAudio = null;
      this.currentSongSource = null;
      this.currentObjectAudio = null;
    },
    loadSong: function () {
      if (this.currentSongSource !== null) return Promise.resolve(true);
      if (this.currentPosition === -1) return Promise.resolve(false);
      if (this.isLoading) return Promise.resolve(false);

      const fileSystem = this.$electron.remote.require('fs');

      return new Promise((resolve) => {
        fileSystem.readFile(this.currentSongInQueue.path, (err, b) => {
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
    sendPlaylistBackwards: function () {
      if (this.currentPosition === 0) return false;
      this.$store.dispatch('PLAYLIST_CHANGE_SONG', this.currentPosition - 1);
      this.startPlay();
      return true;
    },
    sendPlaylistForwards: function () {
      if (this.currentPosition === this.currentPlaylist.length - 1) return false;
      this.$store.dispatch('PLAYLIST_CHANGE_SONG', this.currentPosition + 1);
      this.startPlay();
      return true;
    },
    updateCanvas: function () {
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

      if (this.isLoading) {
        this.drawLoading(this.currentProgress, `${this.currentDownloadSpeed}kbps`);
      } else if (this.currentPosition !== -1) {
        this.drawPlayingAnimation();
      }
    },
    // Drawing the loading bars for download progress
    drawLoading: function (progress, helpText) {
      progress = (progress >= 100 ? 100 : progress);
      this.ctx.fillRect(10, 14, 4.6 * progress, 24);

      this.ctx.globalCompositeOperation = 'color-dodge';
      this.ctx.textAlign = 'center';
      this.ctx.font = '18px Source Sans Pro';
      this.ctx.fillText(`${Math.round(progress)}%${helpText ? ` (${helpText})` : ''}`, 240, 32);
      this.resetSettings();
    },
    // Drawing the song playing bar
    drawPlayingAnimation: function () {
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
    resetSettings: function () {
      this.ctx.fillStyle = '#AAAAAA';
      this.ctx.font = '20px Source Sans Pro';
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.textAlign = 'start';
    },
    genStrDuration: function (duration) {
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
    currentPlaylist: function () {
      return this.$store.state.Playlist.playlist;
    },
    currentPosition: function () {
      return this.$store.state.Playlist.currentPosition;
    },
    currentSong: function () {
      return this.currentPlaylist[this.currentPosition];
    },
    isLoading: function () {
      // MEANING: Finished downloading
      if (this.currentPosition === -1) return false;
      return !this.currentQueue[this.currentPlaylist[this.currentPosition].id].hasFinished;
    },
    currentQueue: function () {
      return this.$store.state.Playlist.masterQueue;
    },
    currentSongInQueue: function () {
      if (this.currentPosition === -1) return undefined;
      return this.currentQueue[this.currentPlaylist[this.currentPosition].id];
    },
    currentProgress: function () {
      if (this.currentPosition === -1) return 0;
      return this.currentQueue[this.currentPlaylist[this.currentPosition].id].loading;
    },
    currentDownloadSpeed: function () {
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
</style>