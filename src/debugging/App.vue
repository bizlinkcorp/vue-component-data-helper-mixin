<template>
  <div id="app">
    <div>
      <h2>凡例</h2>
      <div>
        <input type="text" class="txt" value="入力可能" />
        <input type="text" class="txt" value="disabled" disabled />
        <input type="text" class="txt" value="readonly" readonly />
      </div>
    </div>
    <div>
      <h2>card名</h2>
      <div>
        <input type="text" v-model="pathName" class="txt" />
      </div>
    </div>
    <div>
      <h2>vue-data-binder を利用した store 利用</h2>
      <div class="root-store">
        <custom-store-path data-path="data" view-state-path="viewState">
          <card-template :data-path="pathName" :view-state-path="pathName" inherit />
        </custom-store-path>
      </div>
      <div class="module1-store">
        <card-template data-path="module1:modData.card11" view-state-path="module1:modViewState.card11" />
      </div>
      <div>
        <h3>store状態</h3>
        <pre style="text-align: left">Store.state = ({{ allStoreState }})</pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CardTemplate from './components/CardTemplate.vue';
import CustomStorePath from './components/CustomStorePath';

export default defineComponent({
  name: 'App',
  components: {
    CardTemplate,
    CustomStorePath,
  },
  data() {
    return {
      pathName: 'card1',
    };
  },
  computed: {
    allStoreState() {
      return JSON.stringify(this.$store.state, null, 2);
    },
  },
});
</script>

<style>
.txt:read-only {
  background-color: lime;
}
.txt:disabled {
  background-color: #464646;
  color: #dddddd;
}
</style>
