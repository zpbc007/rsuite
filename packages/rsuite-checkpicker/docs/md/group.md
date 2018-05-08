### 分组

<!--start-code-->
```js
class GroupExample extends React.Component {
  render() {
    return (
      <div className="example-item">
        <CheckPicker
          data={data}
          defaultValue={['Julius']}
          groupBy="role"
        />
      </div>
    );
  }
}

ReactDOM.render(<GroupExample />);

```
<!--end-code-->

```html
<CheckPicker
  data={data}
  defaultValue={['Julius']}
  groupBy="role"
/>

```

对数据进行分组，需要配置一个 `groupBy` 属性，对应设置的值是 [`data`](https://github.com/rsuite/rsuite-checkpicker/blob/master/docs/data/userGroups.js) 中需要分组的 `key`。
