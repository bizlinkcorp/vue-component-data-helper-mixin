import { defineComponent } from 'vue';
import { getStoreState, StateSetPayload } from '../store/StoreControl';
import { DataBinderInfo, EMPTY_DATA_BIND_INFO, resolvePath, DataBindInfoInjectedInstance } from './helper';
import { PROVIDE_DATA_BIND_INFO_NAME } from './StorePathMixin';

/**
 * store 値をバインドする mixin。
 *
 * @remarks
 *
 * ### 概要
 *
 * - Store state の参照／設定を制御する。
 * - dataPath, viewStatePath は、vue 機能の inject を利用し、上位コンポーネントから伝達する。
 *
 * ### 前提条件
 *
 * - store mutations に `setStoreState` を指定してあること（setStoreState は store state 編集を実施）。
 *
 * ### 使用方法
 *
 * - コンポーネントに mixin を組み込む。
 * - プロパティ itemId に値のキー情報を設定する。
 *
 * ### Mixin 詳細
 *
 * |  No | vue type | name           | value type     | desc                                                        | remarks                                      |
 * | --: | -------- | -------------- | -------------- | ----------------------------------------------------------- | -------------------------------------------- |
 * |   1 | props    | itemId         | string         | 項目を一意に指定する ID。Store 参照時のキーとして利用する。 |                                              |
 * |   2 | computed | parentInfo     | DataBinderInfo | 上位から引き継がれた `DataBinderInfo`。                     |
 * |   3 | computed | dataId         | string         | parentInfo.dataPath + '.' + itemId の値。                   |                                              |
 * |   4 | computed | viewStateId    | string         | parentInfo.viewStatePath + '.' + itemId の値。              |                                              |
 * |   5 | computed | storeData      | any            | dataId に一致した store の値を取得／設定。                  |                                              |
 * |   6 | computed | storeViewState | any            | viewStateId に一致した store の viewState を取得。          | 上位引継ぎは無し。viewStateId の値のみ取得。 |
 *
 * - 注意点
 *   - storeViewState では Store の自身のパスの viewState のみ取得する。`parentInfo.viewState()` を利用する場合は、計算プロパティを実装すること。
 *
 * @example
 *
 * ### 実装例
 *
 * ```vue
 * <template>
 *   <!-- 例として disable, readonly 属性に設定してある。この属性値は v-if 等で描画を切り替える等自由に設定して良い -->
 *   <input type="text" v-model="storeData" :disabled="storeViewState.disabled" :readonly="storeViewState.readonly" />
 * </template>
 * <script lang="ts">
 * import { defineComponent } from 'vue';
 * import { StoreBindMixin } from 'vue-component-data-helper-mixin';
 *
 * export default defineComponent({
 *   name: 'TextBindComp',
 *   mixins: [StoreBindMixin], // mixins で StoreBindMixin を指定する
 *   // ...
 *   computed: {
 *     // parentInfo.viewState() を意識した viewState
 *     itemViewState(): AppViewState {
 *       // 設定優先順位： 自ViewState > 親ViewState > デフォルト
 *       const ownViewState = this.storeViewState as AppViewState;
 *       const parentViewState = this.parentInfo.viewState<AppViewState>();
 *       return {
 *         disabled: ownViewState?.disabled ?? parentViewState.disabled ?? false,
 *         readonly: ownViewState?.readonly ?? parentViewState.readonly ?? false,
 *       };
 *     },
 *   },
 * });
 * </script>
 * ```
 */
export default defineComponent({
  name: 'StoreBindMixin',
  inject: {
    dataBindInfo: {
      from: PROVIDE_DATA_BIND_INFO_NAME,
      default: () => EMPTY_DATA_BIND_INFO,
    },
  },
  props: {
    itemId: {
      type: String,
      required: true,
    },
  },
  computed: {
    parentInfo(): DataBinderInfo {
      return (this as unknown as DataBindInfoInjectedInstance).dataBindInfo;
    },
    dataId(): string {
      return resolvePath(this.parentInfo.dataPath(), this.itemId);
    },
    viewStateId(): string {
      return resolvePath(this.parentInfo.viewStatePath(), this.itemId);
    },
    storeData: {
      get() {
        return getStoreState(this.$store.state, this.dataId);
      },
      set(newVal: unknown) {
        // FIXME store mutation メソッド名がリテラル
        const commitTargetName = 'setStoreState';
        this.$store.commit(commitTargetName, {
          path: this.dataId,
          value: newVal,
        } as StateSetPayload);
      },
    },
    storeViewState() {
      return getStoreState(this.$store.state, this.viewStateId);
    },
  },
});
