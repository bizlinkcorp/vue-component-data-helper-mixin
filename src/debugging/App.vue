<template>
  <div id="app">
    <div class="root-store">
      <store-path data-key="data" view-state-key="viewState">
        <card-template path="card1" inherit />
      </store-path>
    </div>
    <div class="module1-store">
      <card-template path="module1:card2" data-key="modData" view-state-key="modViewState" />
    </div>
    <div>
      <pre style="text-align: left">Store.state = ({{ allStoreState }})</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CardTemplate from './components/CardTemplate.vue';
import StorePath from '../components/StorePath';

export default defineComponent({
  name: 'App',
  components: {
    CardTemplate,
    StorePath,
  },
  computed: {
    allStoreState() {
      return JSON.stringify(this.$store.state, null, 2);
    },
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
