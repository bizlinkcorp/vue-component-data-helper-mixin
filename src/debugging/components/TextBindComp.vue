<template>
  <input type="text" v-model="storeData" :disabled="storeViewState.disabled" :readonly="storeViewState.readonly" />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import StoreBindMixin from '../../mixins/StoreBindMixin';

export default defineComponent({
  name: 'TextBindComp',
  mixins: [StoreBindMixin],
});
</script>
