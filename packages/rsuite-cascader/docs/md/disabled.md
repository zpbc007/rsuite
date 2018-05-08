
### 禁用

<!--start-code-->
```js

class DisabledExample extends React.Component {
  render() {
    return (
      <div className="example-item">
        <p><code>禁用组件</code></p>
        <Cascader
          data={data}
          valueKey="name"
          labelKey="name"
          defaultValue={'Julius'}
          disabled
        />
        <hr />
        <p><code>禁用选项</code></p>
        <Cascader
          data={data}
          valueKey="name"
          labelKey="name"
          defaultValue={'虹口区'}
          disabledItemValues={['北京', '广东', '天津']}
        />
      </div>
    );
  }
}
ReactDOM.render(<DisabledExample />);
```
<!--end-code-->

```html
<Cascader
  data={data}
  disabled
/>
```

> 添加 `disabled` 属性即可让 `Cascader` 处于禁用状态。


```html
<Cascader
  data={data}
  defaultValue={'虹口区'}
  disabledItemValues={['北京', '广东', '天津']}
/>
```

> 配置 `disabledItemValues` 属性，可以让部分选项处于禁用状态.

