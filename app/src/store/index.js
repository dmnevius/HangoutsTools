/* eslint no-param-reassign: ["off"] */

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    analysis: {},
  },
  mutations: {
    setAnalysis(state, analysis) {
      state.analysis = analysis;
    },
  },
});
