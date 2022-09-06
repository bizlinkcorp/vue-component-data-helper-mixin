import { createStore } from 'vuex';
import { setStoreState } from 'vue-component-data-helper-mixin';

export default createStore({
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
