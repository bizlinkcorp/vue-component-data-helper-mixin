import { defineComponent } from 'vue';
import StoreBindMixin from '@/mixins/StoreBindMixin';

export default defineComponent({
  name: 'VueDataBinderTest',
  mixins: [StoreBindMixin],
});
