<template>
  <div>
    <!-- 例として disable, readonly 属性に設定してある。この属性値は v-if 等で描画を切り替える等自由に設定して良い -->
    <input type="text" class="txt" v-model="storeData" :disabled="itemViewState.disabled" :readonly="itemViewState.readonly" />
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
