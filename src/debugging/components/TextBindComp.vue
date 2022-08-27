<template>
  <div>
    <input type="text" class="txt" v-model="storeData" :disabled="storeViewState.disabled" :readonly="storeViewState.readonly" />
    = {{ dataId }} ( {{ viewStateId }} )
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import CustomStoreBindMixin from '../mixins/CustomStoreBindMixin';

export default defineComponent({
  name: 'TextBindComp',
  mixins: [CustomStoreBindMixin],
});
</script>
