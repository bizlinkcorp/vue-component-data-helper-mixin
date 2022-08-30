import { defineComponent } from 'vue';
import StoreBindMixin from '@/mixins/StoreBindMixin';
import { AppViewState } from '../store/ViewState';

export default defineComponent({
  name: 'CustomStoreBindMixin',
  mixins: [StoreBindMixin],
  computed: {
    itemViewState(): AppViewState {
      // 設定優先順位： 自ViewState > 親ViewState > デフォルト
      // TODO any化？
      const itemViewState = this.storeViewState as AppViewState;
      const parentViewState = this.parentInfo.viewState<AppViewState>();
      return {
        disabled: itemViewState?.disabled ?? parentViewState.disabled ?? false,
        readonly: itemViewState?.readonly ?? parentViewState.readonly ?? false,
      };
    },
  },
});
