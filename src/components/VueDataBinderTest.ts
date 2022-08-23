import { defineComponent } from 'vue';
import StorePathMixin from '@/mixins/StorePathMixin';

export default defineComponent({
  name: 'VueDataBinderTest',
  mixins: [StorePathMixin],
});
