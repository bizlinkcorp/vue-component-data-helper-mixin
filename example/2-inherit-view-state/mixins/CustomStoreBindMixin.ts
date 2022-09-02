import { defineComponent } from 'vue';
import { StoreBindMixin } from 'vue-component-data-helper-mixin';
import { AppViewState } from '../store';

export default defineComponent({
  name: 'CustomStoreBindMixin',
  mixins: [StoreBindMixin],
  computed: {
    itemViewState(): AppViewState {
      // 設定優先順位： 自ViewState > 親ViewState > デフォルト
      const ownViewState = this.storeViewState as AppViewState;
      const parentViewState = this.parentInfo.viewState<AppViewState>();
      return {
        disabled: ownViewState?.disabled ?? parentViewState.disabled ?? false,
        readonly: ownViewState?.readonly ?? parentViewState.readonly ?? false,
      };
    },
  },
});
