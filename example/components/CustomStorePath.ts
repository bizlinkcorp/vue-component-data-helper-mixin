import { defineComponent } from 'vue';
import { StorePath } from 'vue-data-binder';
import CustomStorePathMixin from '../mixins/CustomStorePathMixin';

export default defineComponent({
  name: 'StorePath',
  extends: StorePath,
  mixins: [CustomStorePathMixin],
});
