import Vue from 'vue';

const state = {
  playlist: [],
  currentPosition: -1,
  masterQueue: {}
};

const mutations = {
  PLAYLIST_MUT_ADD_SONG(state, song) {
    state.playlist.push(song);
    Vue.set(state.masterQueue, song.id, {
      id: song.id,
      loading: 0,
      dlSpeed: 0,
      canPlay: false,
      hasFinished: false,
      path: null
    });
  },
  PLAYLIST_MUT_SET_PLAYLIST(state, playlist) {
    state.playlist = playlist;
  },
  PLAYLIST_MUT_CLEAR_PLAYLIST(state) {
    state.playlist = [];
  },
  PLAYLIST_MUT_CLEAR_MASTER_QUEUE(state) {
    state.masterQueue = {};
  },
  PLAYLIST_MUT_SET_CURRENT_POSITION(state, position) {
    state.currentPosition = position;
  },
  PLAYLIST_MUT_UPDATE_SONG_PROGRESS(state, progressObj) {
    Vue.set(state.masterQueue, progressObj.id, progressObj);
  }
};

const actions = {
  PLAYLIST_CLEAR_SONGS({ commit }) {
    commit('PLAYLIST_MUT_SET_CURRENT_POSITION', -1);
    commit('PLAYLIST_MUT_CLEAR_PLAYLIST');
    commit('PLAYLIST_MUT_CLEAR_MASTER_QUEUE');
  },
  PLAYLIST_ADD_SONG({ state, commit }, song) {
    commit('PLAYLIST_MUT_ADD_SONG', song);
    if (state.currentPosition === -1) commit('PLAYLIST_MUT_SET_CURRENT_POSITION', 0);
  },
  PLAYLIST_CHANGE_SONG({ commit }, songPosition) {
    commit('PLAYLIST_MUT_SET_CURRENT_POSITION', songPosition);
  },
  PLAYLIST_REMOVE_SONG({ state, commit }, deletedSongPosition) {
    // Stop playback if the canceled song is the
    // current song + last index of the playlist.
    // Otherwise, shift the current position downwards
    // if the deleted song is underneath in our stack.
    if (deletedSongPosition === state.currentPosition && deletedSongPosition === state.playlist.length - 1) {
      commit('PLAYLIST_MUT_SET_CURRENT_POSITION', -1);
    } else if (deletedSongPosition < state.currentPosition) {
      commit('PLAYLIST_MUT_SET_CURRENT_POSITION', state.currentPosition - 1);
    } else {
      // Temporary solution is to stop playing
      commit('PLAYLIST_MUT_SET_CURRENT_POSITION', -1);
    }

    const newPlaylist = state.playlist.filter((v, i) => i !== deletedSongPosition);
    commit('PLAYLIST_MUT_SET_PLAYLIST', newPlaylist);
  }
};

export default {
  state,
  mutations,
  actions,
};
