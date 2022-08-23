import { CreateElement, defineComponent, VNode } from 'vue';
import StorePathMixin from '@/mixins/StorePathMixin';
export default defineComponent({
  name: 'StorePath',
  mixins: [StorePathMixin],
  render(h: CreateElement): VNode {
    const children = (this.$scopedSlots.default ? this.$scopedSlots.default({}) : []) || [];
    return h('div', this.$attrs, children);
  },
});
