### 额外的页脚


<!--start-code-->
```js
const footerStyles = {
  padding: 10,
  textAlign: 'right',
  background: '#f5f5f5',
  marginBottom:-10
};

class ExtraFooterExample extends React.Component {
  constructor() {
    super();
    this.state = {
      value: []
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(value) {
    this.setState({ value });
  }
  render() {
    return (
      <div className="example-item">
        <CheckPicker
          data={data}
          placeholder="请选择"
          ref={(ref) => {
            this.picker = ref;
          }}
          value={this.state.value}
          onChange={this.handleChange}
          renderExtraFooter={() => (
            <div style={footerStyles}>
              <Button
                shape="link"
                onClick={() => {
                  this.setState({
                    value: data.map(item => item.value)
                  });
                }}
              >
                全选
              </Button>


              <Button
                shape="link"
                onClick={() => {
                  this.setState({
                    value: []
                  });
                }}
              >
                反选
              </Button>

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

ReactDOM.render(<ExtraFooterExample />);

```
<!--end-code-->

在某些情况下，需要支持全选功能，或者需要在页脚放一个按钮，可以通过 `renderExtraFooter` 属性配置页脚渲染的内容。
```html
 <CheckPicker
    data={data}
    placeholder="请选择"
    ref={(ref) => {
      this.picker = ref;
    }}
    value={this.state.value}
    onChange={this.handleChange}
    renderExtraFooter={() => (
      <div style={footerStyles}>
        <Button
          shape="default"
          onClick={() => {
            this.picker.close();
          }}
        >
          确定
        </Button>
      </div>
    )}
  />

```