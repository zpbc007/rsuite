# rsuite-cascader


`rsuite-cascader` 是一个级联选择器组件。


版本与状态

[![npm][npm-badge]][npm]

[![Travis][build-badge]][build]

## 快速开始

### 安装

```
npm i rsuite-cascader --save
```
### 样式

在 `less` 文件中引入:

```css
@import '~rsuite-cascader/lib/less/index.less';
```


### 示例代码

```jsx
import Cascader from 'rsuite-cascader';

const data = [{
  name: '上海',
  id: 1,
  children: [{
    name: '区',
    id: 2,
    children: [ {
      name: '虹口区',
      id: 3
    }]
},{...}];

<Cascader
  data={data}
  defaultValue={3}
  valueKey="id"       // `data` 数组中作为值的 `key`
  labelKey="name"     // `data` 数组中作为显示文本的 `key`
/>
```



[npm-badge]: https://img.shields.io/npm/v/rsuite-cascader/version2.x.svg?style=flat-square
[npm]: https://www.npmjs.com/package/rsuite-cascader


[npm-beta-badge]: https://img.shields.io/npm/v/rsuite-cascader/beta.svg?style=flat-square
[npm-beta]: https://www.npmjs.com/package/rsuite-cascader

[build-badge]: https://img.shields.io/badge/build-passing-green.svg?style=flat-square
[build]: https://travis-ci.org/rsuite/rsuite-cascader

[coverage-badge]: https://img.shields.io/coveralls/rsuite/rsuite-cascader.svg?style=flat-square
[coverage]: https://coveralls.io/github/rsuite/rsuite-cascader
