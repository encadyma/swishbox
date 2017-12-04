const state = {
  overlayEnabled: false,
  hideHeader: false
};

const mutations = {
  INTERFACE_MUT_SET_OVERLAY_STATE(state, payload) {
    state.overlayEnabled = payload;
  },
  INTERFACE_MUT_SET_HEADER_STATE(state, payload) {
    state.hideHeader = payload;
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
