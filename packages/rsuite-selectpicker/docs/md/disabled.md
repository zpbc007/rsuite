### 禁用

<!--start-code-->
```js

class DisabledExample extends React.Component {
  render() {
    return (
      <div className="example-item">
        <p><code>禁用组件</code></p>
        <Picker
          data={data}
          defaultValue={'Julius'}
          disabled
        />
        <hr />
        <p><code>禁用选项</code></p>
        <Picker
          data={data}
          defaultValue={'Julius'}
          disabledItemValues={['Eugenia', 'Travon', 'Vincenza']}
        />
      </div>
    );
  }
}

ReactDOM.render(<DisabledExample />);

```
<!--end-code-->


```html
<SelectPicker
  data={data}
  defaultValue={'Julius'}
  disabled
/>
```

> 添加 `disabled` 属性即可让 `SelectPicker` 处于禁用状态。


```html
<SelectPicker
  data={data}
  defaultValue={'Julius'}
  disabledItemValues={['Eugenia', 'Travon', 'Vincenza']}
/>
```

> 配置 `disabledItemValues` 属性，可以让部分选项处于禁用状态.
