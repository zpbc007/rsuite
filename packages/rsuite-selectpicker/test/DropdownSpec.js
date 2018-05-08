import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { findDOMNode } from 'react-dom';
import { namespace } from 'rsuite-utils/lib/Picker/constants';

import Dropdown from '../src/Dropdown';

const classPrefix = `${namespace}-select`;
const groupClassName = `.${classPrefix}-menu-group`;
const itemClassName = `.${classPrefix}-menu-item`;
const itemFocusClassName = `.${classPrefix}-menu-item-focus`;
const itemActiveClassName = `.${classPrefix}-menu-item-active`;
const cleanClassName = `.${namespace}-toggle-clean`;
const placeholderClassName = `.${namespace}-toggle-placeholder`;
const valueClassName = `.${namespace}-toggle-value`;
const searchInputClassName = `.${namespace}-search-bar-input`;

const data = [
  {
    label: 'Eugenia',
    value: 'Eugenia',
    role: 'Master'
  },
  {
    label: <span>Kariane</span>,
    value: 'Kariane',
    role: 'Master'
  },
  {
    label: 'Louisa',
    value: 'Louisa',
    role: 'Master'
  }
];

describe('Dropdown', () => {
  it('Should clean selected default value', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <Dropdown defaultOpen data={data} defaultValue={'Eugenia'} />
    );
    const instanceDOM = findDOMNode(instance);
    ReactTestUtils.Simulate.click(instanceDOM.querySelector(cleanClassName));
    expect(instanceDOM.querySelector(placeholderClassName).innerText).to.equal('Select');
  });

  it('Should not clean selected value', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <Dropdown defaultOpen data={data} value={'Eugenia'} />
    );
    const instanceDOM = findDOMNode(instance);
    ReactTestUtils.Simulate.click(instanceDOM.querySelector(cleanClassName));
    expect(instanceDOM.querySelector(valueClassName).innerText).to.equal('Eugenia');
  });

  it('Should output a dropdown', () => {
    const Title = 'Title';
    const instance = ReactTestUtils.renderIntoDocument(<Dropdown>{Title}</Dropdown>);
    const instanceDom = findDOMNode(instance);
    assert.ok(instanceDom.className.match(/\bpicker-select\b/));
  });

  it('Should be disabled', () => {
    const instance = ReactTestUtils.renderIntoDocument(<Dropdown disabled />);
    const instanceDom = findDOMNode(instance);
    assert.ok(instanceDom.className.match(/\bdisabled\b/));
  });

  it('Should active item by `value`', () => {
    const value = 'Louisa';
    const instance = ReactTestUtils.renderIntoDocument(
      <Dropdown defaultOpen data={data} value={value} />
    );
    const instanceDom = findDOMNode(instance);
    const menuDom = findDOMNode(instance.menuContainer);

    assert.equal(instanceDom.querySelector(valueClassName).innerText, value);
    assert.equal(menuDom.querySelector(itemActiveClassName).innerText, value);
  });

  it('Should active item by `defaultValue`', () => {
    const value = 'Louisa';
    const instance = ReactTestUtils.renderIntoDocument(
      <Dropdown defaultOpen data={data} defaultValue={value} />
    );
    const instanceDom = findDOMNode(instance);
    const menuDom = findDOMNode(instance.menuContainer);

    assert.equal(instanceDom.querySelector(valueClassName).innerText, value);
    assert.equal(menuDom.querySelector(itemActiveClassName).innerText, value);
  });

  it('Should render a group', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <Dropdown defaultOpen groupBy="role" data={data} />
    );
    const instanceDom = findDOMNode(instance.menuContainer);
    assert.ok(instanceDom.querySelector(groupClassName));
  });

  it('Should have a placeholder', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <Dropdown className="custom" placeholder="test" />
    );
    const instanceDom = findDOMNode(instance);
    assert.equal(instanceDom.querySelector(placeholderClassName).innerText, 'test');
  });

  it('Should render value by `renderValue`', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <Dropdown
        className="custom"
        placeholder="test"
        data={[{ label: 'foo', value: 'bar' }]}
        value={'bar'}
        renderValue={(label, item) => `${label}-${item.value}`}
      />
    );
    const instanceDom = findDOMNode(instance);
    assert.equal(instanceDom.querySelector(valueClassName).innerText, 'foo-bar');
  });

  it('Should call `onChange` callback', done => {
    const doneOp = data => {
      if (data === 'Eugenia') {
        done();
      }
    };
    const instance = ReactTestUtils.renderIntoDocument(
      <Dropdown defaultOpen onChange={doneOp} data={data} />
    );
    const instanceDOM = findDOMNode(instance.menuContainer);

    ReactTestUtils.Simulate.click(instanceDOM.querySelector(itemClassName));
  });

  it('Should not output a search bar', () => {
    const instance = ReactTestUtils.renderIntoDocument(<Dropdown searchable={false} defaultOpen />);
    const instanceDOM = findDOMNode(instance.menuContainer);

    assert.ok(!instanceDOM.querySelector(searchInputClassName));
  });

  it('Should output a clean button', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <Dropdown data={data} defaultValue={'Louisa'} />
    );
    assert.ok(findDOMNode(instance).querySelector(cleanClassName));
  });

  it('Should not output a clean button', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <Dropdown cleanable={false} data={data} defaultValue={'Louisa'} />
    );
    assert.ok(!findDOMNode(instance.searchBarContainer));
  });

  it('Should call `onSearch` callback', done => {
    const doneOp = key => {
      if (key === 'a') {
        done();
      }
    };
    const instance = ReactTestUtils.renderIntoDocument(<Dropdown defaultOpen onSearch={doneOp} />);
    const instanceDOM = findDOMNode(instance.searchBarContainer);
    const input = instanceDOM.querySelector(searchInputClassName);
    input.value = 'a';

    ReactTestUtils.Simulate.change(input);
  });

  it('Should focus item by keyCode=40 ', done => {
    const instance = ReactTestUtils.renderIntoDocument(
      <Dropdown defaultOpen data={data} defaultValue={'Eugenia'} />
    );
    const instanceDOM = findDOMNode(instance);
    const menuDOM = findDOMNode(instance.menuContainer);
    ReactTestUtils.Simulate.keyDown(instanceDOM, { keyCode: 40 });

    setTimeout(() => {
      if (menuDOM.querySelector(itemFocusClassName).innerText === 'Kariane') {
        done();
      }
    }, 10);
  });

  it('Should focus item by keyCode=38 ', done => {
    const instance = ReactTestUtils.renderIntoDocument(
      <Dropdown defaultOpen data={data} defaultValue={'Kariane'} />
    );
    const instanceDOM = findDOMNode(instance);
    const menuDOM = findDOMNode(instance.menuContainer);
    ReactTestUtils.Simulate.keyDown(instanceDOM, { keyCode: 38 });

    setTimeout(() => {
      if (menuDOM.querySelector(itemFocusClassName).innerText === 'Eugenia') {
        done();
      }
    }, 10);
  });

  it('Should call `onChange` by keyCode=13 ', done => {
    const doneOp = key => {
      done();
    };
    const instance = ReactTestUtils.renderIntoDocument(
      <Dropdown defaultOpen data={data} onChange={doneOp} defaultValue={'Kariane'} />
    );
    const instanceDOM = findDOMNode(instance);
    ReactTestUtils.Simulate.keyDown(instanceDOM, { keyCode: 13 });
  });

  it('Should have a custom className', () => {
    const instance = ReactTestUtils.renderIntoDocument(<Dropdown className="custom" />);
    assert.ok(findDOMNode(instance).className.match(/\bcustom\b/));
  });

  it('Should have a custom style', () => {
    const fontSize = '12px';
    const instance = ReactTestUtils.renderIntoDocument(<Dropdown style={{ fontSize }} />);
    assert.equal(findDOMNode(instance).style.fontSize, fontSize);
  });
});
