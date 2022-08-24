import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import HelloWorld from '@/debugging/components/HelloWorld.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

// FIXME テストが動作しないので修正すること
// エラー：TypeError: Cannot read properties of undefined (reading 'state')

describe('HelloWorld.vue', () => {
  let store: Store<any>;
  beforeEach(() => {
    store = new Vuex.Store({
      state: {},
      actions: {},
      mutations: {},
    });
  });
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg },
      store,
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
