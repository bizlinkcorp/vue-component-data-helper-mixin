import { defineComponent } from 'vue';
import StorePathMixin from '@/mixins/StorePathMixin';

export default defineComponent({
  name: 'VueStorePathTest',
  mixins: [StorePathMixin],
});
