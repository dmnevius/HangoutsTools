/* eslint no-param-reassign: ["off"] */

import Vue from 'vue';
import Vuex from 'vuex';
import Analysis from '../classes/analysis';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    analysis: new Analysis(),
  },
  mutations: {
    setAnalysis(state, analysis) {
      state.analysis = analysis;
    },
  },
});
