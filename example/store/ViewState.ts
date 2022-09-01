import { ViewStateTree } from 'vue-data-binder';
export interface AppViewState {
  disabled?: boolean;
  readonly?: boolean;
}

export type AppViewStateTree = ViewStateTree<AppViewState>;
