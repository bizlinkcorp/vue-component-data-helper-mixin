<template>
  <div class="card-template">
    <text-bind-comp item-id="no" />
    <text-bind-comp item-id="detail" />
    <text-bind-comp item-id="amount" />
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
