### 自定义 tree node 图标
<!-- start-code -->
```js
class CustomPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: treeData,
    };
  }

    setExpand(activeNode) {
    const { data } = this.state;
    const nextTreeData = _.cloneDeep(data);
    const loop = (nodes) => {
      nodes.forEach((node) => {
        if (node.value === activeNode.value) {
          node.expand = activeNode.expand;
        }
        if (node.children) {
          loop(node.children);
        }
      });
    };

    loop(nextTreeData);
    this.setState({
      data: nextTreeData
    });
  }

  handleOnChange = (values) => {
    this.setState((preveState) => {
      return {
        selectedValues: values
      };
    });
  }

  handleOnExpand = (activeNode, layer) => {
    if (activeNode.children.length) {
      this.setExpand(activeNode);
    }
  }

  renderTreeIcon = (nodeData) => {
    if (nodeData.expand) {
      return (
        <i className="icon-minus-square-o icon " />
      );
    }
    return (
      <i className="icon-plus-square-o icon " />
    );
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
          onExpand={this.handleOnExpand}
          onChange={this.handleOnChange}
          renderTreeIcon={this.renderTreeIcon}
        />
      </div>
    );
  }
}

ReactDOM.render(<CustomPicker />)

```
<!-- end-code -->