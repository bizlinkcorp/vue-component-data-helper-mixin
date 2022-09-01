import Vue from 'vue';
import App from './1-getting-start/App.vue';
import store from './1-getting-start/store';

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
