import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VueDataBinderTest',
  inject: {
    bindPath: {
      from: 'parentPath',
      default: undefined,
    },
    bindModule: {
      from: 'parentModule',
      default: undefined,
    },
    bindViewStateKey: {
      from: 'parentViewStateKey',
      default: undefined,
    },
    bindParentDataKey: {
      from: 'parentDataKey',
      default: undefined,
    },
  },
  provide() {
    const parentPath = (this.bindPath ? `${this.bindPath}.` : '') + this.path;
    return {
      parentPath,
      parentModule: this.module ?? this.bindModule,
      parentViewStateKey: this.viewStateKey ?? this.bindViewStateKey,
      parentDataKey: this.dataKey ?? this.bindDataKey,
    };
  },
  props: {
    path: {
      type: String,
      required: false,
      default: undefined,
    },
    module: {
      type: String,
      required: false,
      default: undefined,
    },
    viewStateKey: {
      type: String,
      required: false,
      default: undefined,
    },
    dataKey: {
      type: String,
      required: false,
      default: undefined,
    },
  },
});
