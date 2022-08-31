import { shallowMount } from '@vue/test-utils';
import StorePath from '@/components/StorePath';

// const localVue = createLocalVue();
// localVue.use(Vuex);

describe('HelloWorld.vue', () => {
  // let store: Store<any>;
  // beforeEach(() => {
  //   store = new Vuex.Store({
  //     state: {},
  //     actions: {},
  //     mutations: {},
  //   });
  // });
  it('renders props.msg when passed', () => {
    const wrapper = shallowMount(StorePath, {
      propsData: { dataPath: 'path.to' },
      // store,
    });
    console.log(wrapper.html(), wrapper.props());
    console.log({ wrapper });
    // expect(wrapper.text()).toMatch(msg);
  });
});
