### 默认

<!--start-code-->
```js
class SimpleExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data,
      value: '虹口区'
    };
  }
  render() {
    return (
      <div className="example-item">
        <Cascader
          data={this.state.data}
          valueKey="name"
          labelKey="name"
          placeholder="请选择"
          value={this.state.value}
          onSelect={(node, itemPaths) => {
            console.log(node, 'onSelect');
          }}
          onChange={(value, event) => {
            console.log(value, 'onChange');
            this.setState({
              value
            });
          }}
        />
      </div>
    );
  }
}

ReactDOM.render(<SimpleExample />);

```
<!--end-code-->


```html
<Cascader
  data={data}
  placeholder="请选择"
/>
```
- 初始化一个 `<Cascader>` 组件, 需要设置一个 `data` 属性， 需要注意的 [data](https://github.com/rsuite/rsuite-cascader/blob/master/docs/data/province.js) 是一个树结构的数组;

```js
  [{
    label:'显示的内容',
    value:'值'
    children:[{}]
  }]
```
- 在 `<Cascader>` 组件中可以通过 `labelKey`, `valueKey`, `childrenKey` 来修改`data`对应的数据。

