import { defineComponent } from 'vue';
import CustomStorePathMixin from '../mixins/CustomStorePathMixin';
import StorePath from '@/components/StorePath';

export default defineComponent({
  name: 'StorePath',
  extends: StorePath,
  mixins: [CustomStorePathMixin],
});
