import { defineComponent } from 'vue';
import StoreBindMixin from '../../mixins/StoreBindMixin';
import { ItemViewState } from '../../store/StoreViewState';

export default defineComponent({
  name: 'CustomStoreBindMixin',
  mixins: [StoreBindMixin],
  computed: {
    storeViewState(): ItemViewState {
      // 設定優先順位： 自ViewState > 親ViewState > デフォルト
      // TODO any化？
      const itemViewState = this.itemViewState as ItemViewState;
      return {
        disabled: itemViewState?.disabled ?? this.parentInfo.viewState?.disabled ?? false,
        readonly: itemViewState?.readonly ?? this.parentInfo.viewState?.readonly ?? false,
      };
    },
  },
});
