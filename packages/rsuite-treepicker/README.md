[![Travis](https://img.shields.io/travis/rsuite/rsuite-treepicker.svg)](https://travis-ci.org/rsuite/rsuite-treepicker)
[![npm](https://img.shields.io/npm/v/rsuite-treepicker/version2.x.svg)](https://www.npmjs.com/package/rsuite-treepicker)
[![Coverage Status](https://coveralls.io/repos/github/rsuite/rsuite-treepicker/badge.svg?branch=master)](https://coveralls.io/github/rsuite/rsuite-treepicker?branch=master)
# rsuite-treepicker

## 快速开始
### 安装

```bash
npm install rsuite-treepicker --save
```

### 引入样式文件

```
@import "~rsuite-treepicker/lib/less/index";
```
### 示例
```jsx
    <RsuiteTreePicker
        defaultExpandAll
        height={320}
        data={data}
        onSelect={(activeNode, layer) => {
          console.log(activeNode, layer);
        }}
        onChange={this.handleOnChange}
      />
```
