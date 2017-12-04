const state = {
  playlist: [],
  currentPosition: -1,
};

const mutations = {
  PLAYLIST_MUT_ADD_SONG(state, song) {
    state.playlist.push(song);
  },
  PLAYLIST_MUT_CLEAR_PLAYLIST(state) {
    state.playlist = [];
  },
  PLAYLIST_MUT_SET_CURRENT_POSITION(state, position) {
    state.currentPosition = position;
  },
};

const actions = {
  PLAYLIST_CLEAR_SONGS({ commit }) {
    commit('PLAYLIST_MUT_SET_CURRENT_POSITION', -1);
    commit('PLAYLIST_MUT_CLEAR_PLAYLIST');
  },
  PLAYLIST_ADD_SONG({ state, commit }, song) {
    commit('PLAYLIST_MUT_ADD_SONG', song);
    if (state.currentPosition === -1) commit('PLAYLIST_MUT_SET_CURRENT_POSITION', 0);
  },
  PLAYLIST_CHANGE_SONG({ commit }, songPosition) {
    commit('PLAYLIST_MUT_SET_CURRENT_POSITION', songPosition);
  }
};

export default {
  state,
  mutations,
  actions,
};
