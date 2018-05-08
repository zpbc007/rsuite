import React from 'react';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Tree from '../src';
import treeData from '../docs/data/treeData';
import {
  treeViewCls,
  treeNodeActiveCls,
  treeNodeDisabledCls,
  nodeChildrenOpenCls,
} from './utils';

Enzyme.configure({ adapter: new Adapter() });

const setup = () => {
  const state = {};
  const props = {
    data: treeData,
    height: 300,
    inline: true,
    defaultExpandAll: true,
    defaultValue: 'Dave',
    disabledItemValues: ['disabled'],
  };
  const wrapper = shallow(<Tree {...props} />);
  const staticRender = render(<Tree {...props} />);
  const fullRender = mount(<Tree {...props} />);
  return {
    state,
    props,
    wrapper,
    staticRender,
    fullRender,
  };
};

function getChildren(tree) {
  let times = 0;
  const loop = (nodes) => {
    nodes.forEach((node) => {
      if (node.children && node.children.length) {
        times += 1;
        loop(node.children);
      }
    });
  };
  loop(tree);
  return times;
}

describe('Tree Component test suite', () => {
  const { wrapper, fullRender, staticRender } = setup();

  it('Tree component should be render', () => {
    expect(wrapper.find(`.${treeViewCls}`).length).toBe(1);
  });

  it('Dave tree node should be active', () => {
    expect(staticRender.find(`.${treeNodeActiveCls}`).length).toBe(1);
  });

  it('Disabled Node should be disabled', () => {
    expect(staticRender.find(`.${treeNodeDisabledCls}`).length).toBe(1);
  });

  it('Default expand all is true', () => {
    expect(staticRender.find(`.${nodeChildrenOpenCls}`).length).toBe(
      getChildren(treeData),
    );
  });

  // test expand node
  /*   it('when Maya Node click expand icon, it is children node should be expand', async () => {
    expect(fullRender.exists('.open > div[data-key="0-0-1-1"]')).toBe(true);

    fullRender.find('div[data-key="0-0-1-1"] > .expand-icon-wrapper > .expand-icon').simulate('click');
    expect(fullRender.find(treeViewClass).render().find('.open > div[data-key="0-0-1-1"]').length).toBe(0);

    fullRender.find('div[data-key="0-0-1-1"] > .expand-icon-wrapper > .expand-icon').simulate('click');
    expect(fullRender.find(treeViewClass).render().find('.open > div[data-key="0-0-1-1"]').length).toBe(1);
  }); */

  // test keyup event
  it('when keyup press, activeElement shoule be equal to div[data-key="0-0-1-0"]', () => {
    const mockEvent = {
      keyCode: 38,
    };

    fullRender.find('span[data-key="0-0-1-1"]').simulate('click');
    expect(
      fullRender.find('span[data-key="0-0-1-1"]').getElement() ===
        document.activeElement,
    );

    fullRender.find('span[data-key="0-0-1-1"]').simulate('keydown', mockEvent);
    expect(
      fullRender.find('span[data-key="0-0-1-0"]').getElement() ===
        document.activeElement,
    );
  });

  // test keydown event
  it('when keydown press, activeElement shoule be equal to div[data-key="0-0-1-0"]', () => {
    const downEvent = {
      keyCode: 40,
    };

    const upEvent = {
      keyCode: 38,
    };

    fullRender.find('span[data-key="0-0-1-1"]').simulate('click');
    expect(
      fullRender.find('span[data-key="0-0-1-1"]').getElement() ===
        document.activeElement,
    );

    fullRender.find('span[data-key="0-0-1-1"]').simulate('keydown', downEvent);
    expect(
      fullRender.find('span[data-key="0-0-1-1-0"]').getElement() ===
        document.activeElement,
    );

    fullRender.find('span[data-key="0-0-1-1"]').simulate('keydown', upEvent);
    expect(
      fullRender.find('span[data-key="0-0-1-1"]').getElement() ===
        document.activeElement,
    );
  });
});
