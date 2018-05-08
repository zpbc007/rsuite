### 非受控与受控

<!--start-code-->
```js

class ControlledExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '虹口区'
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    console.log(value);
    this.setState({ value });
  }

  render() {
    return (
      <div className="example-item">
        <p><code>非受控</code></p>
        <Cascader
          data={data}
          valueKey="name"
          labelKey="name"
          defaultValue={'虹口区'}
        />
        <hr />
        <p><code>受控</code></p>
        <Cascader
          data={data}
          valueKey="name"
          labelKey="name"
          value={this.state.value}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
ReactDOM.render(<ControlledExample />);
```
<!--end-code-->

```html
<Cascader
  data={data}
  defaultValue={'虹口区'}
/>
```
> 如果在非受控组件下设置默认值，通过 `defaultValue` 参数设置。

```html
<Cascader
  data={data}
  value={this.state.value}
  onChange={this.handleChange}
/>
```

> 当设置 `value` 以后，`<Cascader>` 就变成了一个受控组件，必须通过 `state` 来控制值的变化，在 `onChange` 回调函数中可以得到选择后的值，然后更新到 `state` 中。

