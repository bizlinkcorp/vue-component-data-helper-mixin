<template>
  <div class="hello">
    <vue-store-path-test path="">
      viewState, viewState2にステート値が設定されている
      <vue-store-binder-test item-id="viewStateName" />
    </vue-store-path-test>
    <!-- ルート位置 -->
    <vue-store-path-test :view-state-key="viewStateName" path="aaaa.bbbb">
      <store-path path="cccc" inherit hoge huga>
        <!-- <vue-store-path-test path="cccc" inherit> -->
        <vue-store-binder-test item-id="id1" />
        <vue-store-binder-test item-id="id2" />
        <!-- </vue-store-path-test> -->
      </store-path>
      <!-- moduleTest から読み込むルート位置 -->
      <vue-store-path-test :view-state-key="viewStateName" path="moduleTest:aaaa.xxxx">
        <vue-store-path-test path="yyyy" inherit>
          <vue-store-binder-test item-id="ida" />
        </vue-store-path-test>
        <vue-store-path-test path="zzzz" inherit>
          <vue-store-binder-test item-id="idb" />
        </vue-store-path-test>
      </vue-store-path-test>
    </vue-store-path-test>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VueStorePathTest from './VueStorePathTest.vue';
import VueStoreBinderTest from './VueStoreBinderTest.vue';
import StorePath from '../../components/StorePath';

export default defineComponent({
  name: 'HelloWorld',
  components: {
    VueStorePathTest,
    VueStoreBinderTest,
    StorePath,
  },
  props: {
    msg: String,
  },
  computed: {
    viewStateName(): string {
      return this.$store.state.viewStateName;
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
