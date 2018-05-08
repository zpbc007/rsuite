### 非受控与受控

<!--start-code-->
```js

class SimpleExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Julius'
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState({ value });
  }

  render() {
    return (
      <div className="example-item">
        <p><code>非受控</code></p>
        <Picker
          data={data}
          defaultValue={'Julius'}
        />
        <hr />
        <p><code>受控</code></p>
        <Picker
          data={data}
          value={this.state.value}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

ReactDOM.render(<SimpleExample />);
```
<!--end-code-->


```html
<SelectPicker
  data={data}
  defaultValue={'Julius'}
/>
```
> 如果在非受控组件下设置默认值，通过 `defaultValue` 参数设置。

```html
<SelectPicker
  data={data}
  value={this.state.value}
  onChange={this.handleChange}
/>
```

> 当设置 `value` 以后，`<SelectPicker>` 就变成了一个受控组件，必须通过 `state` 来控制值的变化，在 `onChange` 回调函数中可以得到选择后的值，然后更新到 `state` 中。
