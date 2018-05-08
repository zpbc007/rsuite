import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { findDOMNode } from 'react-dom';
import { namespace } from 'rsuite-utils/lib/Picker/constants';

import DropdownMenu from '../src/DropdownMenu';
import Dropdown from '../src/Dropdown';


const classPrefix = `${namespace}-cascader-menu-items`;
const itemClassName = `.${namespace}-cascader-menu-item`;

const items = [{
  value: 'abc',
  label: 'abc'
}, {
  value: 'abcd',
  label: 'abcd'
}, {
  value: 'abcde',
  label: 'abcde',
  children: [{
    value: 'vv-abc',
    label: 'vv-abc'
  }, {
    value: 'vv-abcd',
    label: 'vv-abcd'
  }]
}];


describe('DropdownMenu', () => {

  it('Should output a `cascader-menu-items` ', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <DropdownMenu />
    );
    const instanceDom = findDOMNode(instance);
    assert.ok(instanceDom.className.match(/\bcascader-menu-items\b/));
  });

  it('Should output 3 `menu-item` ', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <Dropdown defaultOpen data={items} />
    );

    const instanceDom = findDOMNode(instance.menuContainer);
    assert.equal(instanceDom.querySelectorAll('li').length, 3);
  });

  it('Should have a menuWidth', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <Dropdown
        defaultOpen
        data={items}
        menuWidth={100}
      />
    );

    const columnMenu = findDOMNode(instance.menuContainer).querySelector(`.${classPrefix}-column-menu`);
    assert.ok(columnMenu.style.width, '100px');
  });

  it('Should output 3 `menu-item` ', () => {

    const data = [{
      myValue: 'abc',
      myLabel: 'abc'
    }, {
      myValue: 'abcd',
      myLabel: 'abcd'
    }, {
      myLabel: 'vvv',
      items: [{
        myValue: 'vv-abc',
        myLabel: 'vv-abc'
      }, {
        myValue: 'vv-abcd',
        myLabel: 'vv-abcd'
      }]
    }];

    const instance = ReactTestUtils.renderIntoDocument(
      <Dropdown
        defaultOpen
        labelKey="myLabel"
        valueKey="myValue"
        childrenKey="items"
        data={data}
      />
    );
    const instanceDom = findDOMNode(instance.menuContainer);
    assert.equal(instanceDom.querySelectorAll('li').length, 3);
  });


  it('Should call onSelect callback ', (done) => {

    const doneOp = (node) => {
      if (node.value === 'abcd') {
        done();
      }
    };

    const instance = ReactTestUtils.renderIntoDocument(
      <Dropdown
        defaultOpen
        data={items}
        onSelect={doneOp}
      />
    );
    const instanceDom = findDOMNode(instance.menuContainer);
    ReactTestUtils.Simulate.click(instanceDom.querySelectorAll(itemClassName)[1]);
  });


  it('Should call onSelect callback 2 count', () => {

    const onSelectSpy = sinon.spy();
    const instance = ReactTestUtils.renderIntoDocument(
      <Dropdown
        defaultOpen
        data={items}
        disabledItemValues={['abcd']}
        onSelect={onSelectSpy}
      />
    );
    const instanceDom = findDOMNode(instance.menuContainer);
    setTimeout(() => {
      ReactTestUtils.Simulate.click(instanceDom.querySelectorAll(itemClassName)[0]);
      ReactTestUtils.Simulate.click(instanceDom.querySelectorAll(itemClassName)[2]);
      assert.equal(onSelectSpy.callCount, 2);
    }, 1);

  });

  it('Should not call onSelect callback on disabled item', () => {

    const onSelectSpy = sinon.spy();
    const instance = ReactTestUtils.renderIntoDocument(
      <Dropdown
        defaultOpen
        data={items}
        disabledItemValues={['abcd']}
        onSelect={onSelectSpy}
      />
    );
    const instanceDom = findDOMNode(instance.menuContainer);
    ReactTestUtils.Simulate.click(instanceDom.querySelectorAll(itemClassName)[1]);
    assert.ok(onSelectSpy.notCalled);
  });

  it('Should call renderMenuItem callback ', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <Dropdown
        defaultOpen
        data={items}
        renderMenuItem={item => <i>{item}</i>}
      />
    );
    const instanceDom = findDOMNode(instance.menuContainer);
    assert.equal(instanceDom.querySelectorAll(`${itemClassName} i`).length, 3);
  });

  it('Should be disabled item ', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <Dropdown
        defaultOpen
        data={items}
        disabledItemValues={['abcd', 'abcde']}
      />
    );
    const instanceDom = findDOMNode(instance.menuContainer);
    assert.ok(instanceDom.querySelectorAll(itemClassName)[1].className.match(/\bdisabled\b/));
    assert.ok(instanceDom.querySelectorAll(itemClassName)[2].className.match(/\bdisabled\b/));


  });

  it('Should have a custom className', () => {
    const instance = ReactTestUtils.renderIntoDocument(
      <DropdownMenu className="custom" />
    );
    assert.ok(findDOMNode(instance).className.match(/\bcustom\b/));
  });

  it('Should have a custom style', () => {
    const fontSize = '12px';
    const instance = ReactTestUtils.renderIntoDocument(
      <DropdownMenu style={{ fontSize }} />
    );
    assert.equal(findDOMNode(instance).style.fontSize, fontSize);
  });

});
