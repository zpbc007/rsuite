### 自定义 Placeholder
<!-- start-code -->
```js
class CustomPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: treeData,
    };
  }

  render() {
    const { data, selectedValues } = this.state;
    return (
      <div className="example-item">
        <Picker
          defaultExpandAll
          height={320}
          data={data}
          onSelect={(activeNode, layer) => {
            console.log(activeNode, layer);
          }}
          placeholder="请选择"
          renderValue={(activeNode, placeholder) => {
            if (!activeNode) {
              return placeholder;
            }
            return (
              <span>
                <i className="icon icon-user" /> {activeNode.label}
              </span>
            );
          }}
        />
      </div>
    );
  }
}

ReactDOM.render(<CustomPicker />)

```
<!-- end-code -->