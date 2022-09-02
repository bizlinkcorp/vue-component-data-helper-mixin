# 2-inherit-view-state

ViewState の値を継承する例を実装

## point

- [mixins/CustomStoreBindMixin](./mixins/CustomStoreBindMixin.ts)
  - computed itemViewState メソッドにて、parentViewState を確認し、返却する値に組み込んでいる。
- [mixins/CustomStorePathMixin](./mixins/CustomStorePathMixin.ts)
  - 拡張ポイントの getProvideViewState を実装し、下位のコンポーネントに引き渡す。
