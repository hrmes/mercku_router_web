import { mount } from 'vue-test-utils';
import navBar from '../../../../src/app/component/nav-bar.vue';

describe('nav-bar.vue', () => {
  // const wrapper = mount(navBar);
  // const vm = wrapper.vm;
  // wrapper.setProps({
  //   onLeftClick: () => {
  //     console.log('back');
  //   },
  //   onRightClick: () => {
  //     console.log('handle');
  //   },
  //   option: {
  //     left: {
  //       icon: 'test'
  //     },
  //     center: {
  //       text: 'test'
  //     },
  //     right: {
  //       text: 'test'
  //     }
  //   }
  // });
  // it('has back button and click', () => {
  //   expect(vm.option.left.icon).to.be.a('string');
  //   expect(vm.onLeftClick).to.be.a('function');
  // });
  // it('has center text', () => {
  //   expect(vm.option.center.text).to.be.a('string');
  // });
  // it('has right button and click', () => {
  //   expect(vm.option.right.text).to.be.a('string');
  //   expect(vm.onRightClick).to.be.a('function');
  // });
  let wrapper;

  // default
  it('check default props', () => {
    wrapper = mount(navBar);
    expect(wrapper.vm.$el.querySelector('.left').children[0].textContent).eql(
      ''
    );
    expect(wrapper.vm.$el.querySelector('.center').children[0].textContent).eql(
      ''
    );
    expect(wrapper.vm.$el.querySelector('.right').children[0].textContent).eql(
      ''
    );
    expect(wrapper.vm.$el.querySelector('.left').click()).to.be.undefined;
    expect(wrapper.vm.$el.querySelector('.center').click()).to.be.undefined;
    expect(wrapper.vm.$el.querySelector('.right').click()).to.be.undefined;
  });

  // left
  it('check left icon', () => {
    wrapper = mount(navBar, {
      propsData: {
        option: {
          left: {
            icon: true,
            text: 'test-class'
          }
        }
      }
    });
    expect(
      wrapper.vm.$el.querySelector('.left').children[0].getAttribute('name')
    ).eql('test-class');
  });

  it('check left text', () => {
    wrapper = mount(navBar, {
      propsData: {
        option: {
          left: {
            icon: false,
            text: 'test text'
          }
        }
      }
    });
    expect(wrapper.vm.$el.querySelector('.left').children[0].textContent).eql(
      'test text'
    );
  });

  it('check left click default', () => {
    wrapper = mount(navBar, {
      propsData: {
        option: {
          left: {
            icon: false,
            text: 'test text'
          }
        }
      }
    });

    expect(wrapper.vm.leftClick()).to.be.undefined;
  });

  it('check left click', () => {
    const option = {
      left: {
        icon: false,
        text: 'test text',
        click() {
          return true;
        }
      }
    };

    wrapper = mount(navBar, {
      propsData: {
        option
      }
    });
    console.log(wrapper.vm.leftClick);

    expect(wrapper.vm.leftClick()).to.be.true;
  });

  // center
  it('check center icon', () => {
    wrapper = mount(navBar, {
      propsData: {
        option: {
          center: {
            icon: true,
            text: 'test-class'
          }
        }
      }
    });
    expect(
      wrapper.vm.$el.querySelector('.center').children[0].getAttribute('name')
    ).eql('test-class');
  });

  it('check center text', () => {
    wrapper = mount(navBar, {
      propsData: {
        option: {
          center: {
            icon: false,
            text: 'test text'
          }
        }
      }
    });
    expect(wrapper.vm.$el.querySelector('.center').children[0].textContent).eql(
      'test text'
    );
  });

  it('check center click default', () => {
    wrapper = mount(navBar, {
      propsData: {
        option: {
          center: {
            icon: false,
            text: 'test text'
          }
        }
      }
    });
    expect(wrapper.vm.centerClick()).to.be.undefined;
  });

  it('check center click', () => {
    const option = {
      center: {
        icon: false,
        text: 'test text',
        click() {
          return true;
        }
      }
    };

    wrapper = mount(navBar, {
      propsData: {
        option
      }
    });
    console.log(wrapper.vm.centerClick);

    expect(wrapper.vm.centerClick()).to.be.true;
  });

  // right
  it('check right icon', () => {
    wrapper = mount(navBar, {
      propsData: {
        option: {
          right: {
            icon: true,
            text: 'test-class'
          }
        }
      }
    });
    expect(
      wrapper.vm.$el.querySelector('.right').children[0].getAttribute('name')
    ).eql('test-class');
  });

  it('check right text', () => {
    wrapper = mount(navBar, {
      propsData: {
        option: {
          right: {
            icon: false,
            text: 'test text'
          }
        }
      }
    });
    expect(wrapper.vm.$el.querySelector('.right').children[0].textContent).eql(
      'test text'
    );
  });

  it('check center click default', () => {
    wrapper = mount(navBar, {
      propsData: {
        option: {
          right: {
            icon: false,
            text: 'test text'
          }
        }
      }
    });
    expect(wrapper.vm.rightClick()).to.be.undefined;
  });

  it('check right click', () => {
    const option = {
      right: {
        icon: false,
        text: 'test text',
        click() {
          return true;
        }
      }
    };

    wrapper = mount(navBar, {
      propsData: {
        option
      }
    });
    console.log(wrapper.vm.rightClick);

    expect(wrapper.vm.rightClick()).to.be.true;
  });
});
