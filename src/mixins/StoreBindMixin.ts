import { defineComponent } from 'vue';
import { getStoreState, StateSetPayload } from '../store/StoreControl';
import { DataBinderInfo, EMPTY_DATA_BIND_INFO, resolvePath } from './helper';
import { PROVIDE_DATA_BIND_INFO_NAME } from './StorePathMixin';

/**
 * store value bind mixin
 *
 * @remarks
 *
 * ##### 概要
 *
 * - Store state の参照／設定を制御する
 * - dataPath, viewStatePath は、vue 機能の inject を利用し、上位コンポーネントから伝達する
 *
 * ##### 前提条件
 *
 * - store mutations に `setStoreState` を指定してあること（setStoreState は store state 編集を実施）
 *
 * ##### 使用方法
 *
 * - コンポーネントに mixin を組み込む
 * - プロパティ itemId に値のキー情報を設定する
 *
 * ##### Mixin 詳細
 *
 * |  No | vue type | name           | value type     | desc                                                      | remarks                                    |
 * | --: | -------- | -------------- | -------------- | --------------------------------------------------------- | ------------------------------------------ |
 * |   1 | props    | itemId         | string         | 項目を一意に指定する ID。Store 参照時のキーとして利用する |                                            |
 * |   2 | computed | parentInfo     | DataBinderInfo | 上位から引き継がれた `DataBinderInfo`                     |
 * |   3 | computed | dataId         | string         | parentInfo.dataPath + '.' + itemId の値                   |                                            |
 * |   4 | computed | viewStateId    | string         | parentInfo.viewStatePath + '.' + itemId の値              |                                            |
 * |   5 | computed | storeData      | any            | dataId に一致した store の値を取得／設定                  |                                            |
 * |   6 | computed | storeViewState | any            | viewStateId に一致した store の viewState を取得          | 上位引継ぎは無し。viewStateId の値のみ取得 |
 *
 * - 注意点
 *   - StorePathMixin の `parentInfo.viewState()` を利用する場合は、計算プロパティを個別実装すること。
 *
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
    parentInfo() {
      return this.dataBindInfo as DataBinderInfo;
    },
    dataId() {
      return resolvePath(this.parentInfo.dataPath(), this.itemId);
    },
    viewStateId() {
      return resolvePath(this.parentInfo.viewStatePath(), this.itemId);
    },
    storeData: {
      get() {
        // TODO any化？
        return getStoreState((this.$store as any).state, this.dataId);
      },
      set(newVal: unknown) {
        // FIXME store mutation メソッド名がリテラル
        const commitTargetName = 'setStoreState';
        // TODO any化？
        (this.$store as any).commit(commitTargetName, {
          path: this.dataId,
          value: newVal,
        } as StateSetPayload);
      },
    },
    storeViewState() {
      // TODO any化
      return getStoreState((this.$store as any).state, this.viewStateId);
    },
  },
});
