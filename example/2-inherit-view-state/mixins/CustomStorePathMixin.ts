import { defineComponent } from 'vue';
import { StorePathMixin } from 'vue-component-data-helper-mixin';
import { AppViewState } from '../store';

export default defineComponent({
  name: 'CustomStorePathMixin',
  mixins: [StorePathMixin],
  methods: {
    // 上位のViewStateを鑑みて、下位コンポーネントに継承するViewStateを設定する
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
