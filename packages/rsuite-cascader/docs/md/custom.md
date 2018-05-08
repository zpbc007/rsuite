
### 自定义选项

<!--start-code-->
```js
class CustomExample extends React.Component {
  render() {
    return (
      <div className="example-item">
        <Cascader
          data={data}
          valueKey="name"
          labelKey="name"
          renderMenuItem={(label, item) => {
            return <div><i className="icon icon-circle" /> {label}</div>;
          }}
          renderValue={(activePaths) => {
            return activePaths.map(item => item.name).join(' : ');
          }}
        />

      </div>
    );
  }
}
ReactDOM.render(<CustomExample />);
```
<!--end-code-->


```html
<Cascader
  data={data}
  valueKey="name"
  labelKey="name"
  renderMenuItem={(label, item) => {
    return <div><i className="icon icon-circle" /> {label}</div>;
  }}
  renderValue={(activePaths) => {
    return activePaths.map(item => item.name).join(' : ');
  }}
/>

```
- `renderMenuItem` 回调函数可以自定义选项；
- `renderValue` 回调函数可以自定义被选中的选项。

