import { defineComponent } from 'vue';
import StorePathMixin from '../../mixins/StorePathMixin';

export default defineComponent({
  name: 'CustomStorePathMixin',
  mixins: [StorePathMixin],
  methods: {
    provideViewState() {
      const current = this.currentStoreViewState;
      const parent = this.parentStoreViewState;
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
