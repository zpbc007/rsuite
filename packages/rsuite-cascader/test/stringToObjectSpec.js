import _ from 'lodash';

import stringToObject from '../src/utils/stringToObject';


describe('stringToObject', () => {

  it('Should return value', () => {
    const obj = stringToObject({ key: 'test', value: 'test' });
    assert.ok(_.isEqual(obj, { key: 'test', value: 'test' }));
  });

  it('Should output a new object', () => {
    const obj = stringToObject('test', 'key', 'value');
    assert.ok(_.isEqual(obj, { key: 'test', value: 'test' }));
  });

});
