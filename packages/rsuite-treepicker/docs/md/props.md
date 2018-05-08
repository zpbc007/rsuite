| 属性名称           | 类型                                | 默认值        | 描述                            |
| ------------------ | ----------------------------------- | ------------- | ------------------------------- |
| classPrefix        | string                              |               | class 的前缀                    |
| className          | string                              |               | Picker 的自定义 className       |
| menuClassName      | string                              |               | Picker Menu 的自定义 className  |
| style              | object                              |               | style 样式                      |
| value              | array                               |               | 当前选中的值                    |
| defaultValue       | array                               |               | 默认选中的值                    |
| data               | array                               |               | tree 数据                       |
| valueKey           | string                              | "value"       | tree 数据结构 value 属性名称    |
| labelKey           | string                              | "label"       | tree 数据结构 label 属性名称    |
| childrenKey        | string                              | "children"    | tree 数据结构 children 属性名称 |
| disabledItemValues | array                               |               | 禁用节点列表                    |
| defaultExpandAll   | bool                                | false         | 默认展开所有节点                |
| cascade            | bool                                | false         | 是否级联选择                    |
| inline             | bool                                | false         | 是否内联显示 tree               |
| open               | bool                                | false         | 打开（受控）                    |
| defaultOpen        | bool                                | false         | 默认打开                        |
| locale             | object                              |               | 本地语言                        |
| placeholder        | React.Node                          | Please Select | 占位符                          |
| disabled           | bool                                | false         | 是否禁用 Picker                 |
| cleanable          | bool                                | true          | 是否可以清除                    |
| seasrchable        | bool                                | true          | 是否可以搜索                    |
| onSearch           | function(searchKeyword, event)      |               | 搜索回调函数                    |
| onOpen             | function()                          |               | 展开 Dropdown 的回调函数        |
| onClose            | function()                          |               | 关闭 Dropdown 的回调函数        |
| onChange           | function(value)                     |               | 数据改变的回调函数              |
| onExpand           | function(activeNode, layer)         |               | 树节点展示时的回调              |
| onSelect           | function(activeNode, layer, values) |               | 选择树节点后的回调函数          |
| renderTreeNode     | function(nodeData)                  |               | 自定义渲染 tree 节点            |
| renderTreeIcon     | function(nodeData)                  |               | 自定义渲染 图标                 |
| renderValue        | function(activeNode, placeholder)   |               | 自定义渲染 placeholder          |
| renderMenu         | function(menu)                      |               | 自定义渲染 Dropdown Menu        |
| renderExtraFooter  | ()=>React.Node                      |               | 自定义页脚内容                  |
| placement          | enum: Placement()                   | `bottomLeft`  | 打开位置                        |

<br/>
`Placement` 取值如下：
- `bottomLeft`
- `bottomRight`
- `leftBottom`
- `rightBottom`
- `topLeft`
- `topRight`
- `leftTop`
- `rightTop`
