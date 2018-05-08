
import React from 'react';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { constants } from 'rsuite-utils/lib/Picker';
import Picker from '../src';
import treeData from '../docs/data/treeData';

Enzyme.configure({ adapter: new Adapter() });

const { namespace } = constants;
const setup = () => {
  const props = {
    data: treeData
  };

  const wrapper = shallow(<Picker {...props} />);
  const fullRender = mount(<Picker {...props} />);
  const staticRender = render(<Picker {...props} />);
  return {
    wrapper,
    fullRender,
    staticRender
  };
};
const classPrefix = `.${namespace}-tree`;
const placeholderClass = `.${namespace}-toggle-placeholder`;
const menuClass = `${classPrefix}-menu`;
const toggleClass = `.${namespace}-toggle`;
const searchInputClass = `.${namespace}-search-bar-input`;
const disabledClass = `${classPrefix}-disabled`;

describe('rsutie-trepicker test suite', () => {
  const { wrapper, fullRender, staticRender } = setup();

  it('picker should be render, there are class .rsuite-treepicker-dropdown', () => {
    expect(wrapper.find(classPrefix).length).toBe(1);
  });

  it('Picker placeholder text should be Please Select', () => {
    const text = staticRender.find(`${placeholderClass} > span`).text();
    expect(text).toBe('Please Select');
  });

  it('Picker placeholder text should be Master', async () => {
    const props = {
      data: treeData,
      value: 'Master'
    };
    const picker = mount(<Picker {...props} />);
    expect(picker.state().activeNode.label).toBe('Master');
  });


  it('when dropdown clicked, Tree Component should be render', () => {
    fullRender.find(toggleClass).simulate('click');
    expect(document.querySelectorAll(menuClass).length).toBe(1);
  });


  it('when disabled is true, Dropdown should be disabled.', () => {
    const props = {
      data: treeData,
      value: 'Master',
      disabled: true
    };
    const picker = mount(<Picker {...props} />);
    expect(picker.find(disabledClass).length).toBe(1);
  });
});

