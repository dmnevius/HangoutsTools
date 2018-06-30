import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { getStoreBuilder } from 'vuex-typex';
import RootState from './state';
import './project';

Vue.use(Vuex);

const store: Store<RootState> = getStoreBuilder<RootState>().vuexStore();

export default store;
