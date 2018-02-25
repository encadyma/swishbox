const state = {
  overlayEnabled: false,
  hideHeader: false,
  compressHeader: false,
  suggestionsScroll: -1,
  suggestionsResults: []
};

const mutations = {
  INTERFACE_MUT_SET_OVERLAY_STATE(state, payload) {
    state.overlayEnabled = payload;
  },
  INTERFACE_MUT_SET_HEADER_STATE(state, payload) {
    state.hideHeader = payload;
  },
  INTERFACE_MUT_SET_SUGGESTIONS_SCROLL(state, position) {
    if (position < -1) state.suggestionsScroll = -1;
    else if (position >= state.suggestionsResults.length) state.suggestionsScroll = state.suggestionsResults.length - 1;
    else state.suggestionsScroll = position;
  }
};

const actions = {
  INTERFACE_SET_OVERLAY({ commit }, payload) {
    commit('INTERFACE_MUT_SET_OVERLAY_STATE', payload);
  },
  INTERFACE_SET_HEADER_HIDING({ commit }, payload) {
    commit('INTERFACE_MUT_SET_OVERLAY_STATE', payload);
  },
};

export default {
  state,
  mutations,
  actions,
};
