### 自定义选项

<!--start-code-->
```js

class CustomExample extends React.Component {
  render() {
    return (
      <div className="example-item">
        <Picker
          data={data}
          defaultValue={'Julius'}
          groupBy="role"
          renderMenuItem={(label, item) => {
            return <div><i className="icon icon-user" /> {label}</div>;
          }}
          renderMenuGroup={(label, item) => {
            return (
              <div>
                <i className="icon icon-group" /> {label} - ({item.children.length})
              </div>
            );
          }}
          renderValue={(label, value) => {
            return (
              <div>
                <i className="icon icon-user" /> {label}
              </div>
            );
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
<SelectPicker
  data={data}
  defaultValue={'Julius'}
  groupBy="role"
  renderMenuItem={(label, item) => {
    return <div><i className="icon icon-user" /> {label}</div>;
  }}
  renderMenuGroup={(label, item) => {
    return (
      <div>
        <i className="icon icon-group" /> {label} - ({item.children.length})
      </div>
    );
  }}
  renderValue={(label, item) => {
    return (
      <div>
        <i className="icon icon-user" /> {label}
      </div>
    );
  }}
/>
```
- `renderMenuItem` 回调函数可以自定义选项；
- `renderMenuGroup` 回调函数可以自定义选项组；
- `renderValue` 回调函数可以自定义被选中的选项。

