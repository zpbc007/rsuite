### 禁用

<!--start-code-->
```js
class DisabledExample extends React.Component {
  render() {
    return (
      <div className="example-item">
        <p><code>禁用组件</code></p>
        <CheckPicker
          data={data}
          defaultValue={['Julius']}
          disabled
        />
        <hr />
        <p><code>禁用选项</code></p>
        <CheckPicker
          data={data}
          defaultValue={['Julius']}
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
<CheckPicker
  data={data}
  defaultValue={['Julius']}
  disabled
/>
```

> 添加 `disabled` 属性即可让 `CheckPicker` 处于禁用状态。


```html
<CheckPicker
  data={data}
  defaultValue={['Julius']}
  disabledItemValues={['Eugenia', 'Travon', 'Vincenza']}
/>
```

> 配置 `disabledItemValues` 属性，可以让部分选项处于禁用状态.
