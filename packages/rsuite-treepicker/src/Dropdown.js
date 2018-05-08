// @flow

import * as React from 'react';
import classNames from 'classnames';
import { findDOMNode } from 'react-dom';
import { toggleClass, hasClass } from 'dom-lib';
import { IntlProvider, FormattedMessage } from 'rsuite-intl';
import OverlayTrigger from 'rsuite-utils/lib/Overlay/OverlayTrigger';
import _ from 'lodash';
import {
  reactToString,
  filterNodesOfTree,
  getUnhandledProps,
  prefix,
} from 'rsuite-utils/lib/utils';

import {
  SearchBar,
  Toggle,
  MenuWrapper,
  constants,
} from 'rsuite-utils/lib/Picker';

import TreeNode from './TreeNode';
import defaultLocale from './locale/index';

const { namespace } = constants;

type DefaultEvent = SyntheticEvent<*>;
type PlacementEighPoints =
  | 'bottomLeft'
  | 'bottomRight'
  | 'topLeft'
  | 'topRight'
  | 'leftTop'
  | 'rightTop'
  | 'leftBottom'
  | 'rightBottom';

type Props = {
  className?: string,
  menuClassName?: string,
  height?: number,
  data: Array<any>,
  defaultValue?: any,
  value?: any,
  disabledItemValues?: Array<any>,
  valueKey?: string,
  labelKey?: string,
  childrenKey?: string,
  defaultExpandAll?: boolean,
  inline?: boolean,
  classPrefix?: string,
  disabled?: boolean,
  open?: boolean,
  defaultOpen?: boolean,
  locale: Object,
  placeholder?: React.Node,
  cleanable?: boolean,
  searchable?: boolean,
  onSearch?: (searchKeyword: string, event: DefaultEvent) => void,
  onOpen?: () => void,
  onClose?: () => void,
  onChange?: (value: any) => void,
  onExpand?: (activeNode: any, labyer: number) => void,
  onSelect?: (activeNode: any, layer: number, event: DefaultEvent) => void,
  renderTreeNode?: (nodeData: Object) => React.Node,
  renderTreeIcon?: (nodeData: Object) => React.Node,
  renderValue?: (
    activeNode: ?Object,
    placeholder: string | React.Node,
  ) => React.Node,
  renderMenu?: (menu: string | React.Node) => React.Node,
  renderExtraFooter?: () => React.Node,
  placement?: PlacementEighPoints,
};

type State = {
  data: Array<any>,
  filterData: Array<any>,
  searchKeyword: string,
  value: any,
  activeNode?: ?Object,
};

class Dropdown extends React.Component<Props, State> {
  static defaultProps = {
    classPrefix: `${namespace}-tree`,
    defaultExpandAll: false,
    inline: false,
    disabled: false,
    valueKey: 'value',
    labelKey: 'label',
    childrenKey: 'children',
    locale: defaultLocale,
    cleanable: true,
    searchable: true,
    placement: 'bottomLeft',
  };

  constructor(props: Props) {
    super(props);
    this.isControlled =
      'value' in props && 'onChange' in props && props.onChange;
    const { value, defaultValue, data, valueKey } = props;
    const nextValue = value || defaultValue;
    this.getNodeByKey(data, valueKey, nextValue, props);

    this.state = {
      data: [],
      filterData: [],
      searchKeyword: '',
      value: nextValue,
      activeNode: this.node,
    };
  }

  componentWillMount() {
    const formattedData = this.initTreeData();
    const filterData = this.getFilterData(formattedData);
    this.setState({
      data: formattedData,
      filterData,
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    const { value, data, valueKey } = nextProps;

    if (!_.isEqual(this.props.data, data)) {
      const formattedData = this.initTreeData(data);
      const filterData = this.getFilterData(formattedData);
      // 初始化activeNode
      this.getNodeByKey(data, valueKey, value);
      this.setState({
        data: formattedData,
        filterData,
        activeNode: this.node,
      });
    }

    if (!_.isEqual(this.props.value, value)) {
      this.setState({
        value,
      });
    }
  }

  /**
   * 根据value获取对应的node，必须传入要比较的对象属性名
   */
  getNodeByKey = (
    nodes: Array<any>,
    key?: string,
    value?: string,
    props?: Props = this.props,
  ) => {
    const { childrenKey } = props;
    if (value && !_.isUndefined(value)) {
      nodes.forEach((node: Object) => {
        if (node[childrenKey]) {
          this.getNodeByKey(node[childrenKey], key, value);
        }
        if (key && _.isEqual(node[key], value)) {
          this.node = node;
        }
      });
    }
  };

  getExpandState(node: Object) {
    const { childrenKey, defaultExpandAll } = this.props;
    if (node[childrenKey] && node[childrenKey].length) {
      if ('expand' in node) {
        return !!node.expand;
      } else if (defaultExpandAll) {
        return true;
      }
      return false;
    }
    return false;
  }

  getActiveElementOption(options: Array<any>, value: string) {
    for (let i = 0; i < options.length; i += 1) {
      if (options[i].value === value) {
        return options[i];
      } else if (options[i].children && options[i].children.length) {
        let active = this.getActiveElementOption(options[i].children, value);
        if (!_.isEmpty(active)) {
          return active;
        }
      }
    }
    return {};
  }

  getFocusableMenuItems = () => {
    const { filterData } = this.state;
    const { childrenKey, disabledItemValues = [], valueKey } = this.props;

    let items = [];
    const loop = (nodes: Array<any>) => {
      nodes.forEach((node: Object) => {
        const disabled =
          disabledItemValues.filter((disabledItem) =>
            _.isEqual(disabledItem, node[valueKey]),
          ).length > 0;
        if (!disabled) {
          items.push(node);
          if (!node.expand) {
            return;
          }
          if (node[childrenKey]) {
            loop(node[childrenKey]);
          }
        }
      });
    };

    loop(filterData);
    return items;
  };

  getItemsAndActiveIndex() {
    const items = this.getFocusableMenuItems();

    let activeIndex = -1;
    items.forEach((item, index) => {
      if (document.activeElement !== null) {
        if (item.refKey === document.activeElement.getAttribute('data-key')) {
          activeIndex = index;
        }
      }
    });
    return { items, activeIndex };
  }

  getActiveItem() {
    const { filterData = [] } = this.state;
    let nodeData: Object = {};
    if (document.activeElement !== null) {
      const activeItem = document.activeElement;
      const { key, layer } = activeItem.dataset;
      this.getNodeByKey(filterData, 'refKey', key);
      if (this.node) {
        nodeData = this.node;
      }
      return {
        nodeData,
        layer,
      };
    }
    return {};
  }

  getElementByDataKey = (dataKey: string) => {
    const ele = findDOMNode(this.nodeRefs[dataKey]);
    if (ele instanceof Element) {
      return ele.querySelector('.rs-picker-tree-view-node-label');
    }
    return null;
  };

  getFilterData(data: Array<any>, word?: string) {
    const { labelKey } = this.props;
    return filterNodesOfTree(data, (item) =>
      this.shouldDisplay(item[labelKey], word),
    );
  }

  node = null;

  isControlled = null;

  tempNode = [];

  treeView = null;

  trigger = null;

  container = null;

  nodeRefs = {};

  /**
   * 初始化树节点
   */
  initTreeData = (data?: Array<any>) => {
    const { childrenKey } = this.props;
    this.tempNode = data || this.props.data;
    let level = 0;
    const loop = (nodes, ref) => {
      nodes.forEach((node, index) => {
        node.refKey = `${ref}-${index}`;
        node.expand = this.getExpandState(node);
        if (node[childrenKey]) {
          loop(node[childrenKey], node.refKey);
        }
      });
    };
    loop(this.tempNode, level);

    return this.tempNode;
  };

  selectActiveItem = (event: DefaultEvent) => {
    const { nodeData, layer } = this.getActiveItem();
    this.handleNodeSelect(nodeData, +layer, event);
  };

  focusNextMenuItem() {
    this.focusNextItem();
  }

  focusNextItem() {
    const { items, activeIndex } = this.getItemsAndActiveIndex();
    if (items.length === 0) {
      return;
    }
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    const node = this.getElementByDataKey(items[nextIndex].refKey);
    if (node !== null) {
      node.focus();
    }
  }

  focusPreviousItem() {
    const { items, activeIndex } = this.getItemsAndActiveIndex();

    if (items.length === 0) {
      return;
    }

    let prevIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    prevIndex = prevIndex >= 0 ? prevIndex : 0;
    const node = this.getElementByDataKey(items[prevIndex].refKey);
    if (node !== null) {
      node.focus();
    }
  }

  closeDropdown = () => {
    if (this.trigger) {
      this.trigger.hide();
    }
  };

  addPrefix = (name: string) => prefix(this.props.classPrefix)(name);

  shouldDisplay = (
    label: any,
    searchKeyword?: string = this.state.searchKeyword,
  ) => {
    if (!_.trim(searchKeyword)) {
      return true;
    }
    const keyword = searchKeyword.toLocaleLowerCase();
    if (typeof label === 'string') {
      return label.toLocaleLowerCase().indexOf(keyword) >= 0;
    } else if (React.isValidElement(label)) {
      const nodes = reactToString(label);
      return (
        nodes
          .join('')
          .toLocaleLowerCase()
          .indexOf(keyword) >= 0
      );
    }
    return false;
  };

  // 展开，收起节点
  handleTreeToggle = (nodeData: Object, layer: number, event: DefaultEvent) => {
    const { classPrefix = '', onExpand } = this.props;
    const openClass = `${classPrefix}-view-open`;
    toggleClass(findDOMNode(this.nodeRefs[nodeData.refKey]), openClass);
    nodeData.expand = hasClass(
      findDOMNode(this.nodeRefs[nodeData.refKey]),
      openClass,
    );
    onExpand && onExpand(nodeData, layer);
  };

  handleNodeSelect = (nodeData: Object, layer: number, event: DefaultEvent) => {
    const { valueKey, onChange, onSelect } = this.props;
    if (!this.isControlled) {
      this.setState({
        activeNode: nodeData,
        value: nodeData[valueKey],
      });
    } else {
      this.setState({
        activeNode: nodeData,
      });
    }

    onChange && onChange(nodeData[valueKey]);
    onSelect && onSelect(nodeData, layer, event);
    this.closeDropdown();
  };

  handleKeyDown = (event: SyntheticKeyboardEvent<*>) => {
    switch (event.keyCode) {
      // down
      case 40:
        this.focusNextItem();
        event.preventDefault();
        break;
      // up
      case 38:
        this.focusPreviousItem();
        event.preventDefault();
        break;
      // enter
      case 13:
        this.selectActiveItem(event);
        event.preventDefault();
        break;
      default:
    }
  };

  handleToggleKeyDown = (event: SyntheticKeyboardEvent<*>) => {
    if (!this.treeView) {
      return;
    }

    if (
      event.target.className === `${namespace}-toggle` ||
      event.target.className === `${namespace}-search-bar-input`
    ) {
      switch (event.keyCode) {
        // down
        case 40:
          this.focusNextItem();
          event.preventDefault();
          break;
        default:
      }
    }
  };

  handleSearch = (value: string, event: DefaultEvent) => {
    const { onSearch, data } = this.props;
    this.setState({
      searchKeyword: value,
      filterData: this.getFilterData(data, value),
    });

    onSearch && onSearch(value, event);
  };

  handleClean = () => {
    const { onChange } = this.props;
    this.setState({
      activeNode: null,
    });

    onChange && onChange(null);
  };

  renderDropdownMenu() {
    const {
      searchable,
      placement,
      renderExtraFooter,
      locale,
      renderMenu,
    } = this.props;

    const classes = classNames(
      this.addPrefix('menu'),
      `${namespace}-placement-${_.kebabCase(placement)}`,
    );

    return (
      <MenuWrapper className={classes}>
        {searchable ? (
          <SearchBar
            placeholder={locale.searchPlaceholder}
            key="searchBar"
            onChange={this.handleSearch}
            value={this.state.searchKeyword}
          />
        ) : null}
        {renderMenu ? renderMenu(this.renderTree()) : this.renderTree()}
        {renderExtraFooter && renderExtraFooter()}
      </MenuWrapper>
    );
  }

  renderNode(
    itemData: Object,
    index: number,
    layer: number,
    classPrefix: string,
  ) {
    const { activeNode } = this.state;
    const {
      disabledItemValues = [],
      defaultExpandAll,
      valueKey,
      labelKey,
      childrenKey,
      renderTreeNode,
      renderTreeIcon,
    } = this.props;

    const { hasChildren } = itemData;
    const children = itemData[childrenKey];
    const value = itemData[valueKey];
    const hasNotEmptyChildren =
      hasChildren !== undefined
        ? hasChildren
        : children && Array.isArray(children) && children.length > 0;
    const active = activeNode ? _.isEqual(activeNode[valueKey], value) : false;
    const props = {
      value,
      label: itemData[labelKey],
      nodeData: itemData,
      onTreeToggle: this.handleTreeToggle,
      onRenderTreeNode: renderTreeNode,
      onRenderTreeIcon: renderTreeIcon,
      onSelect: this.handleNodeSelect,
      active,
      hasChildren: !!children,
      disabled:
        disabledItemValues.filter((disabledItem) =>
          _.isEqual(disabledItem, value),
        ).length > 0,
      children,
      index,
      layer,
      parent,
      defaultExpandAll,
    };

    const refKey = itemData.refKey;

    if (props.hasChildren) {
      layer += 1;

      // 是否展开树节点且子节点不为空
      const openClass = `${classPrefix}-open`;
      let childrenClass = classNames(`${classPrefix}-node-children`, {
        [openClass]: defaultExpandAll && hasNotEmptyChildren,
      });

      let nodes = children || [];
      return (
        <div
          className={childrenClass}
          key={itemData.refKey}
          ref={(ref) => {
            this.nodeRefs[refKey] = ref;
          }}
        >
          <TreeNode
            classPrefix={classPrefix}
            key={itemData.refKey}
            ref={(ref) => {
              this.nodeRefs[refKey] = ref;
            }}
            {...props}
          />
          <div className={`${classPrefix}-children`}>
            {nodes.map((child, i) =>
              this.renderNode(child, i, layer, classPrefix),
            )}
          </div>
        </div>
      );
    }

    return (
      <TreeNode
        classPrefix={classPrefix}
        key={itemData.refKey}
        ref={(ref) => {
          this.nodeRefs[refKey] = ref;
        }}
        {...props}
      />
    );
  }

  renderTree() {
    // 树节点的层级
    let layer = 0;
    const { filterData } = this.state;
    const { menuClassName, height } = this.props;
    const treeViewClass = classNames(this.addPrefix('view'));
    const classes = classNames(treeViewClass, menuClassName);
    const nodes = filterData.map((dataItem, index) => {
      return this.renderNode(dataItem, index, layer, treeViewClass);
    });
    const styles = {
      height,
    };
    const treeNodesClass = `${treeViewClass}-nodes`;
    return (
      <div
        ref={(ref) => {
          this.treeView = ref;
        }}
        className={classes}
        style={styles}
        onKeyDown={this.handleKeyDown}
      >
        <div className={treeNodesClass}>{nodes}</div>
      </div>
    );
  }

  render() {
    const { activeNode } = this.state;
    const {
      inline,
      locale,
      open,
      defaultOpen,
      disabled,
      className,
      placement,
      classPrefix,
      placeholder,
      cleanable,
      renderValue,
      valueKey,
      labelKey,
      onOpen,
      onClose,
      ...rest
    } = this.props;

    const classes = classNames(
      classPrefix,
      {
        [this.addPrefix('has-value')]: !!activeNode,
        [this.addPrefix('disabled')]: disabled,
      },
      `${namespace}-placement-${_.kebabCase(placement)}`,
      className,
    );

    let placeholderText = null;
    if (activeNode) {
      placeholderText = activeNode[labelKey];
    } else if (placeholder) {
      placeholderText = placeholder;
    }

    if (renderValue && activeNode) {
      placeholderText = renderValue(activeNode, placeholderText);
    }

    const unhandled = getUnhandledProps(Dropdown, rest);
    return !inline ? (
      <IntlProvider locale={locale}>
        <div
          {...unhandled}
          className={classes}
          onKeyDown={this.handleToggleKeyDown}
          tabIndex={-1}
          role="menu"
          ref={(ref) => {
            this.container = ref;
          }}
        >
          <OverlayTrigger
            ref={(ref) => {
              this.trigger = ref;
            }}
            open={open}
            defaultOpen={defaultOpen}
            disabled={disabled}
            trigger="click"
            placement={placement}
            onEntered={onOpen}
            onExited={onClose}
            speaker={this.renderDropdownMenu()}
          >
            <Toggle
              onClean={this.handleClean}
              cleanable={cleanable && !disabled}
              hasValue={activeNode !== null}
            >
              {placeholderText || <FormattedMessage id="placeholder" />}
            </Toggle>
          </OverlayTrigger>
        </div>
      </IntlProvider>
    ) : (
      this.renderTree()
    );
  }
}

export default Dropdown;
