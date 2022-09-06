import { defineComponent, h, VNode } from 'vue';
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
 * ### Component 詳細
 *
 * |  No | vue type | name          | value type | desc                 | remarks                                               |
 * | --: | -------- | ------------- | ---------- | -------------------- | ----------------------------------------------------- |
 * |   1 | props    | childNodeOnly | boolean    | 子ノードのみ描画する | true に設定された場合、属性値(class 等)は引き継がない |
 *
 * @example
 *
 * ### コンポーネント利用方法
 *
 * ```html
 * <template>
 *   <div class="comp-root">
 *     <store-path m-data="data.path.to" m-view-state="viewState.path.to" class="store-path" :child-node-only="false">
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
 * ### 描画結果(childNodeOnly = false)
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
 *
 * ### 描画結果(childNodeOnly = true)
 *
 * ```html
 * <div class="comp-root">
 *   <div class="child1">...</div>
 *   <div class="child2">...</div>
 * </div>
 * ``` */
export default defineComponent({
  name: 'StorePath',
  mixins: [StorePathMixin],
  props: {
    childNodeOnly: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  render(): VNode | VNode[] {
    const children = (this.$slots.default ? this.$slots.default({}) : []) || [];
    if (this.childNodeOnly) {
      // プロパティが設定されていた場合は、子ノードを返却する
      return children;
    }
    return h('div', this.$attrs, children);
  },
});
