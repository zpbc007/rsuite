

### 默认

<!--start-code-->
```js
class SimpleExample extends React.Component {
  render() {
    return (
      <div className="example-item">
        <CheckPicker
          data={data}
          placeholder="请选择"
        />
        <br />
        <CheckPicker
          data={[
            { id: 1, text: 11 },
            { id: 2, text: 22 },
            { id: 3, text: 33 },
          ]}
          onOpen={()=>{
            console.log('open');
          }}
          onClose={()=>{
            console.log('close');
          }}
          disabledItemValues={[1]}
          defaultValue={[2]}
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
<CheckPicker
  data={data}
  defaultValue={['Julius']}
  placeholder="请选择"
/>
```
- 初始化一个 `CheckPicker`, 只需要设置一个 `data` 属性， 需要注意的 [data](https://github.com/rsuite/rsuite-checkpicker/blob/master/docs/data/users.js) 是一个数组;
- 数组中的选项包括 `label` 和 `value` 两个属性， `label` 是选项显示内容，`value` 是选项的值。 在`<CheckPicker>` 组件中对应有两个属性用于自定义这两个属性，分别是 `labelKey` 和 `valueKey`, 默认值是 `label` 和 `value`。如果需要修改可以参考:

```html
<CheckPicker
  data={data}
  labelKey="text"
  valueKey="id"
/>
```