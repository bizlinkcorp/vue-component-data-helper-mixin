import { CreateElement, defineComponent, VNode } from 'vue';
import StorePathMixin from '@/mixins/StorePathMixin';

/**
 * store path コンポーネント。
 *
 * @remarks
 *
 * ### 概要
 *
 * - StorePathMixin を適用したコンポーネント。
 * - 本ライブラリを利用する際に、パスコンポーネントの組み込みが不要な場合に利用する。
 * - StorePathMixin の詳細は、{@link StorePathMixin} を参照。
 *
 * ### 使用方法
 *
 * - StorePath をコンポーネントとして取り込む。
 *
 * ### 描画結果
 *
 * - div 要素を配置する。
 * - 属性値(class 等)は div に引継ぐ。
 *
 * @example
 *
 * ### コンポーネント利用方法
 *
 * ```html
 * <template>
 *   <div class="comp-root">
 *     <store-path data-path="data.path.to" view-state-path="viewState.path.to" class="store-path">
 *       <div class="child1">...</div>
 *       <div class="child2">...</div>
 *     </store-path>
 *   </div>
 * </template>
 * <script lang="ts">
 *   import { defineComponent } from 'vue';
 *   import { StorePath } from 'vue-component-data-helper-mixin';
 *
 *   export default defineComponent({
 *     name: 'MyComp',
 *     components: {
 *       StorePath,
 *     },
 *     ...
 *   });
 * </script>
 * ```
 *
 * ### 描画結果
 *
 * ```html
 * <div class="comp-root">
 *   <div class="store-path">
 *     <!-- store-path 要素は、div として描画する。class は引き継がれる -->
 *     <div class="child1">...</div>
 *     <div class="child2">...</div>
 *   </div>
 * </div>
 * ```
 */
export default defineComponent({
  name: 'StorePath',
  mixins: [StorePathMixin],
  render(h: CreateElement): VNode {
    const children = (this.$scopedSlots.default ? this.$scopedSlots.default({}) : []) || [];
    // FIXME タグ抜きで定義できれば実施したい。調査する。
    return h('div', this.$attrs, children);
  },
});
