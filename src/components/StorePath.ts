import { CreateElement, defineComponent, VNode } from 'vue';
import StorePathMixin from '@/mixins/StorePathMixin';

/**
 * store path 設定コンポーネント
 * @remarks
 * FIXME 説明を記載する
 * - 使い方
 * - rendering 結果
 *
 * @example
 * FIXME 使用方法を記載する
 */
export default defineComponent({
  name: 'StorePath',
  mixins: [StorePathMixin],
  render(h: CreateElement): VNode {
    const children = (this.$scopedSlots.default ? this.$scopedSlots.default({}) : []) || [];
    return h('div', this.$attrs, children);
  },
});
