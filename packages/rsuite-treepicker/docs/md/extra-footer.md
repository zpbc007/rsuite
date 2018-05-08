### 自定义页脚内容

<!-- start-code -->

```js
const footerStyles = {
  padding: 10,
  textAlign: 'right',
  background: '#f5f5f5',
  marginBottom: -10,
};
class ExtraFooterPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: treeData,
    };
  }

  render() {
    const { data } = this.state;
    return (
      <div className="example-item">
        <Picker
          defaultExpandAll
          height={320}
          data={data}
          ref={ref => {
            this.picker = ref;
          }}
          onSelect={(activeNode, layer) => {
            console.log(activeNode, layer);
          }}
          renderExtraFooter={() => (
            <div style={footerStyles}>
              <Button
                shape="default"
                onClick={() => {
                  this.picker.trigger.hide();
                }}
              >
                确定
              </Button>
            </div>
          )}
        />
      </div>
    );
  }
}

ReactDOM.render(<ExtraFooterPicker />);
```

<!-- end-code -->

在某些情况下，需要支持全选功能，或者需要在页脚放一个按钮，可以通过 `renderExtraFooter` 属性配置页脚渲染的内容。
