import { defineComponent } from 'vue';
import StoreRecieveMixin from '@/mixins/StoreRecieveMixin';

export default defineComponent({
  name: 'VueDataRecieverTest',
  mixins: [StoreRecieveMixin],
});
