const state = {
  playlist: [],
  currentPosition: 0,
};

const mutations = {
  PLAYLIST_ADD_SONG(state, song) {
    state.playlist.push(song);
  },
  PLAYLIST_CLEAR_SONGS(state) {
    state.currentPosition = 0;
    state.playlist = [];
  },
};

const actions = {};

export default {
  state,
  mutations,
  actions,
};
