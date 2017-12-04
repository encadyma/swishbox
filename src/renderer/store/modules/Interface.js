const state = {
  overlayEnabled: false
};

const mutations = {
  INTERFACE_MUT_SET_OVERLAY_STATE(state, payload) {
    state.overlayEnabled = payload;
  }
};

const actions = {
  INTERFACE_SET_OVERLAY({ commit }, payload) {
    commit('INTERFACE_MUT_SET_OVERLAY_STATE', payload);
  },
};

export default {
  state,
  mutations,
  actions,
};
