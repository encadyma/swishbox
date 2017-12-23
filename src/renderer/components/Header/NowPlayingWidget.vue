<template>
  <div style="position: relative;">
    <canvas id="app-head-now-playing" width="480" height="80" ref="appHeadCanvas"></canvas>
    <div id="app-head-now-playing-overlay" v-if="currentPosition !== -1">
      <div style="margin: 0 auto; text-align: center;">
        <i class="material-icons swish-mi-sec" @click="sendPlaylistBackwards" :class="{disabled: currentPosition === 0}">skip_previous</i>
        <i class="material-icons swish-mi-prime" v-if="!isPlaying" @click="togglePlay()">play_arrow</i>
        <i class="material-icons swish-mi-prime" v-if="isPlaying" @click="togglePlay()">pause</i>
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
      currentDuration: 0
    };
  },
  mounted: function () {
    this.canvas = this.$refs.appHeadCanvas;
    this.ctx = this.canvas.getContext('2d');

    setInterval(() => {
      this.frame += 1;
      this.updateCanvas();
      if (this.isPlaying) this.currentDuration += 0.1;
    }, 100);

    this.$watch('$store.state.Playlist.currentPosition', function () {
      this.currentDuration = 0;
      this.isPlaying = false;
      this.frame = 0;
    });

    this.$electron.ipcRenderer.on('YT_DOWNLOAD_PROGRESS', (event, progressObj) => {
      this.$store.commit('PLAYLIST_MUT_UPDATE_SONG_PROGRESS', progressObj);
    });
  },
  methods: {
    togglePlay: function () {
      this.isPlaying = !this.isPlaying;
    },
    sendPlaylistBackwards: function () {
      if (this.currentPosition !== 0) this.$store.dispatch('PLAYLIST_CHANGE_SONG', this.currentPosition - 1);
    },
    sendPlaylistForwards: function () {
      if (this.currentPosition !== this.currentPlaylist.length - 1) this.$store.dispatch('PLAYLIST_CHANGE_SONG', this.currentPosition + 1);
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
      } else {
        this.drawPlayingAnimation();
      }
    },
    drawLoading: function (progress, helpText) {
      progress = (progress >= 100 ? 100 : progress);
      this.ctx.fillRect(10, 14, 4.6 * progress, 24);

      this.ctx.globalCompositeOperation = 'color-dodge';
      this.ctx.textAlign = 'center';
      this.ctx.font = '18px Source Sans Pro';
      this.ctx.fillText(`${Math.round(progress)}%${helpText ? ` (${helpText})` : ''}`, 240, 32);
      this.resetSettings();
    },
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