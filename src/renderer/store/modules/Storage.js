//
// Note: METADATA is read-only.
// PREFERENCES should be written through
// IPC.
//

const state = {
  preferences: {},
  saved: [],
  ids: [],
  songs: {}
};

const mutations = {
  STORAGE_VUEX_UPDATE_PREFERENCES(state, payload) {
    state.preferences = payload;
  },
  STORAGE_VUEX_UPDATE_METADATA(state, metadata) {
    state.ids = metadata.ids;
    state.saved = metadata.saved;
    state.songs = metadata.songs;
  }
};

const actions = {};

export default {
  state,
  mutations,
  actions
};
