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
      <h2>card keyword</h2>
      <div>
        <input type="text" v-model="pathName" class="txt" />
      </div>
    </div>
    <div>
      <h2>vue-component-data-helper-mixin を利用した store 利用</h2>
      <store-path m-data="data" m-view-state="viewState">
        <div class="root-store">
          <!-- dataPath = "data.${pathName}", viewStatePath = "viewState.${pathName}" -->
          <card-template :m-data="pathName" :m-view-state="pathName" />
        </div>
        <div class="module1-store">
          <card-template m-data="module1:modData.card3" m-view-state="module1:modViewState.card3" m-not-inherit-data m-not-inherit-view-state />
        </div>
        <div>
          <h3>store状態</h3>
          <pre style="text-align: left">Store.state = ({{ allStoreState }})</pre>
        </div>
      </store-path>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { StorePath } from 'vue-component-data-helper-mixin';
import CardTemplate from './components/CardTemplate.vue';

export default defineComponent({
  name: 'App',
  components: {
    StorePath,
    CardTemplate,
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
