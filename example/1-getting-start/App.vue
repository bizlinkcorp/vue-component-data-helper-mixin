<template>
  <div>
    <!-- 3 -->
    <store-path data-path="data">
      <!-- 4 -- TextBindComp では data.card1 の値を参照する -->
      <text-bind-comp item-id="card1" />
    </store-path>
    <div>
      <h3>store状態</h3>
      <pre style="text-align: left">Store.state = ({{ allStoreState }})</pre>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { StorePath } from 'vue-data-binder';
import TextBindComp from './TextBindComp.vue';

export default defineComponent({
  name: 'App',
  components: {
    // -- 1 --
    StorePath,
    // -- 2 --
    TextBindComp,
  },
  computed: {
    allStoreState() {
      return JSON.stringify(this.$store.state, null, 2);
    },
  },
});
</script>
