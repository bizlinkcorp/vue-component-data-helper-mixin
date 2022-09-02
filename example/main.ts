import Vue from 'vue';

import App from './1-getting-started/App.vue';
import store from './1-getting-started/store';

// import App from './2-inherit-view-state/App.vue';
// import store from './2-inherit-view-state/store';

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
