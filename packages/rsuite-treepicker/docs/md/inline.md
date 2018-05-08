### inline 模式
设置了 `inline` 属性后，就可以单纯使用 tree。
<!-- start-code -->
```js
class Tree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: cityData,
      selectedValues: 'Master'
    };
  }

  handleOnChange = value => {
    console.log(value)
  }

  render() {
    const { data, selectedValues } = this.state;
    return (
      <div className="">
        <Picker
          defaultExpandAll
          height={320}
          data={data}
          inline
          value={selectedValues}
          onSelect={(activeNode, layer) => {
            console.log(activeNode, layer);
          }}
          onExpand={(activeNode) => {
            console.log(activeNode)
          }}
          onChange={this.handleOnChange}
        />
      </div>
    );
  }
}
ReactDOM.render(<Tree />);
```
<!-- end-code -->
