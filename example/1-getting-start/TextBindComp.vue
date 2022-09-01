<template>
  <!-- 2 -->
  <input type="text" class="txt" v-model="storeData" />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { StoreBindMixin } from 'vue-data-binder';

export default defineComponent({
  name: 'TextBindComp',
  // -- 1 --
  mixins: [StoreBindMixin],
});
</script>
