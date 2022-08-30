import { ViewStateTree } from '@/store/ViewStateTree';
export interface AppViewState {
  disabled?: boolean;
  readonly?: boolean;
}

export type AppViewStateTree = ViewStateTree<AppViewState>;
