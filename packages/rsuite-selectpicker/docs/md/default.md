### 默认

<!--start-code-->
```js

class SimpleExample extends React.Component {
  render() {
    return (
      <div className="example-item">
        <Picker
          data={data}
          placeholder="请选择"
        />
        <br />
        <Picker
          data={[
            { id: 1, text: 11 },
            { id: 2, text: 22 },
            { id: 3, text: 33 },
          ]}
          labelKey="text"
          valueKey="id"
          placeholder="请选择"
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
  placeholder="请选择"
/>
```
- 初始化一个 `SelectPicker`, 只需要设置一个 `data` 属性， 需要注意的 [data](https://github.com/rsuite/rsuite-selectpicker/blob/master/docs/data/users.js) 是一个数组;
- 数组中的选项包括 `label` 和 `value` 两个属性， `label` 是选项显示内容，`value` 是选项的值。 在`<SelectPicker>` 组件中对应有两个属性用于自定义这两个属性，分别是 `labelKey` 和 `valueKey`, 默认值是 `label` 和 `value`。如果需要修改可以参考:

```html
<SelectPicker
  data={data}
  defaultValue={'Julius'}
  labelKey="text"
  valueKey="id"
/>
```
