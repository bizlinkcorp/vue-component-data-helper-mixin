import Vue from 'vue';
import Vuex from 'vuex';
import { setStoreState } from 'vue-data-binder';

Vue.use(Vuex);

export default new Vuex.Store({
  state: () => ({
    // -- 1 -- data.card1 データを設定
    data: {
      card1: 'card1Value',
    },
  }),
  mutations: {
    // -- 2 --
    setStoreState,
  },
});
