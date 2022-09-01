import { defineComponent } from 'vue';
import { StorePathMixin } from 'vue-data-binder';
import { AppViewState } from '../store/ViewState';

export default defineComponent({
  name: 'CustomStorePathMixin',
  mixins: [StorePathMixin],
  methods: {
    getProvideViewState() {
      const current = this.currentViewState<AppViewState>();
      const parent = this.parentViewState<AppViewState>();

      return {
        // 設定優先順位： 自ViewState > 親ViewState
        // disabled プロパティ
        disabled: current?.disabled ?? parent?.disabled,
        // readonly プロパティ
        readonly: current?.readonly ?? parent?.readonly,
      };
    },
  },
});
