<template>
  <div class="hello">
    <vue-data-binder-test path="">
      viewState, viewState2にステート値が設定されている
      <vue-data-reciever-test item-id="viewStateName" />
    </vue-data-binder-test>
    <!-- ルート位置 -->
    <vue-data-binder-test :view-state-key="viewStateName" path="aaaa.bbbb">
      <vue-data-binder-test path="cccc" inherit>
        <vue-data-reciever-test item-id="id1" />
        <vue-data-reciever-test item-id="id2" />
      </vue-data-binder-test>
      <!-- moduleTest から読み込むルート位置 -->
      <vue-data-binder-test view-state-key="viewState" path="moduleTest:aaaa.xxxx">
        <vue-data-binder-test path="yyyy" inherit>
          <vue-data-reciever-test item-id="ida" />
        </vue-data-binder-test>
        <vue-data-binder-test path="zzzz" inherit>
          <vue-data-reciever-test item-id="idb" />
        </vue-data-binder-test>
      </vue-data-binder-test>
    </vue-data-binder-test>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VueDataBinderTest from './VueDataBinderTest.vue';
import VueDataRecieverTest from './VueDataRecieverTest.vue';

export default defineComponent({
  name: 'HelloWorld',
  components: {
    VueDataBinderTest,
    VueDataRecieverTest,
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
