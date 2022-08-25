# vue-data-binder

## TODOs

1. store の定義方法を決定する
2. StoreBindMixin.ts の storeData set 時の mutation の名称
   1. pinia では mutation は無く、action で対応する。

## install

```shell
npm install vue-data-binder
```

## 公開するライブラリ

| No  | 公開名         | タイプ        | 説明                                                           | 備考                                                          |
| --- | -------------- | ------------- | -------------------------------------------------------------- | ------------------------------------------------------------- |
| 1   | StoreBindMixin | Vue mixin     | Store state と入力項目を結びつけるコンポーネント mixin         | 入力単一項目コンポーネントに設定することを想定                |
| 2   | StorePathMixin | Vue mixin     | StoreBindMixin で参照する項目の Store state パスを設定する     | StoreBindMixin を束ねるコンポーネントに設定することを想定する |
| 3   | StorePath      | Vue Component | StorePathMixin をカスタム利用しない場合の単一コンポーネントい  |                                                               |
| 4   | setStoreState  | method        | StoreBindMixin の storeData 設定時に設定する mutation メソッド | root store の mutation に設定する。                           |

## 使用方法

## これより下は、デフォルト記載

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your unit tests

```
npm run test:unit
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
