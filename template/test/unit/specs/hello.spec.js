import Hello from '../../../src/pages/Hello.vue';
import { mount } from '@vue/test-utils';
import { expect } from 'chai';

// 测试用例套集
describe('Hello 组件', () => {
  const wrapper = mount(Hello);
  const vm = wrapper.vm;

  // 检查原始组件选项
  it('has a created hook', () => {
    expect(Hello.created).to.be.a('function')
  });

  // 评估原始组件选项中函数的结果
  it('sets the correct default data', () => {
    expect(Hello.data).to.be.a('function');
    const defaultData = Hello.data();
    expect(defaultData.msg).to.equal('Follow your instincts.');
  });

  // 检查 mount 中的组件实例
  it('correctly sets the message when created', () => {
    // const vm = new Vue(Hello).$mount(); // 手动挂载实例
    expect(vm.msg).to.equal('Follow your instincts.');
  });

  // 创建一个实例并检查渲染输出
  it('renders the correct message', () => {
    // const Constructor = Vue.extend(Hello);
    // const vm = new Constructor().$mount();
    // expect(vm.$el.querySelector('p').textContent).to.equal('Hello test.');
    expect(wrapper.find('h2').text()).to.equal('Follow your instincts.')
  });

  // 设置组件的 data
  it('correctly sets the message', () => {
    wrapper.setData({ msg: 'Hello vue-test-unit .' });
    expect(vm.msg).to.equal('Hello vue-test-unit .');
  })
})
