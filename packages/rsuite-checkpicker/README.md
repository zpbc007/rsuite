# rsuite-checkpicker


`rsuite-checkpicker` 是一个选择器组件，可以替代原生 `select` 控件。同时还具有一些特性：
- 支持搜索
- 支持自定选项
- 支持分组

> `rsuite-checkpicker` 只支持多选，如果只需要单选，可以使用 [`rsuite-selectpicker`](https://rsuitejs.com/rsuite-selectpicker)

版本与状态

[![npm][npm-badge]][npm]

[![Travis][build-badge]][build]

## 快速开始

### 安装

```
npm i rsuite-checkpicker --save
```
### 样式

在 `less` 文件中引入:

```css
@import '~rsuite-checkpicker/lib/less/index.less';
```


### 示例代码

```jsx
import Picker from 'rsuite-checkpicker';

const data = [{
  label: 'Pearlie',
  value: 2,
  role: 'Master',
},...];

<Picker
  data={data}
  defaultValue={[2]}
  valueKey="value"     // `data` 数组中作为值的 `key`
  labelKey="label"     // `data` 数组中作为显示文本的 `key`
  groupBy="role"       // `data` 数组中作为分组显示的 `key`  如果不设置就不分组
/>
```




[npm-badge]: https://img.shields.io/npm/v/rsuite-checkpicker/version2.x.svg?style=flat-square
[npm]: https://www.npmjs.com/package/rsuite-checkpicker


[npm-beta-badge]: https://img.shields.io/npm/v/rsuite-checkpicker/beta.svg?style=flat-square
[npm-beta]: https://www.npmjs.com/package/rsuite-checkpicker

[build-badge]: https://img.shields.io/badge/build-passing-green.svg?style=flat-square
[build]: https://travis-ci.org/rsuite/rsuite-checkpicker

[coverage-badge]: https://img.shields.io/coveralls/rsuite/rsuite-checkpicker.svg?style=flat-square
[coverage]: https://coveralls.io/github/rsuite/rsuite-checkpicker
