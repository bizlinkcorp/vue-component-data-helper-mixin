<template>
  <div class="card-template">
    <text-bind-comp m-id="no" />
    <text-bind-comp m-id="detail" />
    <text-bind-comp m-id="amount" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import CustomStorePathMixin from '../mixins/CustomStorePathMixin';
import TextBindComp from './TextBindComp.vue';

export default defineComponent({
  name: 'CardTemplate',
  mixins: [CustomStorePathMixin], // mixins で StorePathMixin を指定する
  components: {
    TextBindComp,
  },
});
</script>
