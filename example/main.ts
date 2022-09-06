import { createApp } from 'vue';

import App from './1-getting-started/App.vue';
import store from './1-getting-started/store';

// import App from './2-inherit-view-state/App.vue';
// import store from './2-inherit-view-state/store';

const app = createApp(App);

app.use(store);

app.mount('#app');
