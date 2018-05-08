// @flow

import * as React from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import { IntlProvider, FormattedMessage } from 'rsuite-intl';
import OverlayTrigger from 'rsuite-utils/lib/Overlay/OverlayTrigger';
import { Toggle, MenuWrapper, constants } from 'rsuite-utils/lib/Picker';

import { findNodeOfTree, getUnhandledProps, prefix } from 'rsuite-utils/lib/utils';

import stringToObject from './utils/stringToObject';
import DropdownMenu from './DropdownMenu';
import defaultLocale from './locale';

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
  classPrefix: string,
  data: Array<any>,
  className?: string,
  menuClassName?: string,
  childrenKey?: string,
  valueKey: string,
  labelKey: string,
  renderMenu?: (itemLabel: React.Node, item: Object) => React.Node,
  renderValue?: (activePaths?: Array<any>) => React.Node,
  renderExtraFooter?: () => React.Node,
  disabled?: boolean,
  value?: any,
  defaultValue?: any,
  placeholder?: string,
  onChange?: (value: any, event: DefaultEvent) => void,
  onOpen?: () => void,
  onClose?: () => void,
  onSelect?: (value: any, activePaths: Array<any>, event: DefaultEvent) => void,
  locale?: Object,
  cleanable?: boolean,
  open?: boolean,
  defaultOpen?: boolean,
  placement?: PlacementEighPoints,

  /**
   * Only for `DropdownMenu`
   */
  renderMenuItem?: (itemLabel: React.Node, item: Object) => React.Node,
  menuWidth?: number,
  menuHeight?: number,
  disabledItemValues?: Array<any>
};

type States = {
  selectNode?: any,
  value?: any,
  activePaths: Array<any>,
  items?: Array<any>,
  tempActivePaths?: Array<any>,
  filteredData?: Array<any>
};

class Dropdown extends React.Component<Props, States> {
  static defaultProps = {
    classPrefix: `${namespace}-cascader`,
    data: [],
    disabledItemValues: [],
    childrenKey: 'children',
    valueKey: 'value',
    labelKey: 'label',
    locale: defaultLocale,
    cleanable: true,
    placement: 'bottomLeft'
  };

  constructor(props: Props) {
    super(props);
    const { data, value, defaultValue } = props;
    const nextValue = value || defaultValue;

    this.state = {
      selectNode: null,
      value: nextValue,
      /**
       * 选中值的路径
       */
      activePaths: [],
      /**
       * 用于展示面板的数据列表，是一个二维的数组
       * 是通过 data 树结构转换成的二维的数组，其中只包含页面上展示的数据
       */
      items: [],
      filteredData: _.cloneDeep(data)
    };
  }

  componentWillMount() {
    this.updateStateForCascade();
  }

  componentWillReceiveProps(nextProps: Props) {
    const { value, data, valueKey } = nextProps;

    if (!_.isEqual(value, this.props.value)) {
      this.setState({ value });
      this.updateStateForCascade(nextProps);
    }

    if (!_.isEqual(data, this.state.filteredData)) {
      this.setState(
        {
          filteredData: data
        },
        () => {
          /**
           * 如果是异步加载更新了 data,
           * 首先获取到被点击节点的值 `selectNodeValue`， 然后再拿到新增后的 `newChildren`,
           * 把这个两个数据通过交给 updateStateForCascade 处理。
           */

          const selectNodeValue = _.get(this.state, ['selectNode', valueKey]);
          const newChildren =
            _.get(findNodeOfTree(data, item => _.isEqual(item[valueKey], selectNodeValue)), [
              'children'
            ]) || [];

          this.updateStateForCascade(
            nextProps,
            selectNodeValue,
            newChildren.map(item => this.stringToObject(item))
          );
        }
      );
    }
  }

  getValue(nextProps?: Props) {
    const { value } = nextProps || this.props;
    return _.isUndefined(value) ? this.state.value : value;
  }

  handleSelect = (node: any, activePaths: Array<any>, isLeafNode: boolean, event: DefaultEvent) => {
    const { onChange, onSelect, valueKey } = this.props;
    const prevValue = this.getValue();
    const value = node[valueKey];
    onSelect && onSelect(node, activePaths, event);

    this.setState({
      selectNode: node
    });

    /**
     * 只有在叶子节点的时候才当做是可以选择的值
     * 一个节点的 children 为 null 或者 undefined 的是就是叶子节点
     */
    if (isLeafNode) {
      this.setState({ value });
      if (!_.isEqual(value, prevValue)) {
        onChange && onChange(value, event);
      }

      if (_.isUndefined(this.props.value)) {
        this.setState({ activePaths });
      }

      this.closeDropdown();
    }
  };

  trigger = null;

  bindTriggerRef = (ref: React.ElementRef<*>) => {
    this.trigger = ref;
  };

  menuContainer = null;

  bindMenuContainerRef = (ref: React.ElementRef<*>) => {
    this.menuContainer = ref;
  };

  container = null;

  bindContainerRef = (ref: React.ElementRef<*>) => {
    this.container = ref;
  };

  closeDropdown = () => {
    if (this.trigger) {
      this.trigger.hide();
    }
  };

  handleClean = (event: DefaultEvent) => {
    const { disabled, onChange } = this.props;
    if (disabled) {
      return;
    }
    this.setState(
      {
        value: null,
        activePaths: []
      },
      () => {
        onChange && onChange(null, event);
      }
    );
  };

  handleEntered = () => {
    const { onOpen } = this.props;
    this.updateStateForCascade();
    onOpen && onOpen();
  };

  /**
   * 在 data 对象中的数据类型是字符串比如: ['foo']
   * 通过这个行数可以把值转换成 [{name:'foo':value:'foo'}]
   */
  stringToObject(value: any) {
    const { labelKey, valueKey } = this.props;
    return stringToObject(value, labelKey, valueKey);
  }

  updateStateForCascade(nextProps?: Props, selectNodeValue?: any, newChildren?: Array<any>) {
    const { data, valueKey, childrenKey } = nextProps || this.props;
    const activeItemValue = selectNodeValue || this.getValue(nextProps);
    const nextItems = [];
    const nextPathItems = [];
    const findNode = items => {
      for (let i = 0; i < items.length; i += 1) {
        items[i] = this.stringToObject(items[i]);
        items[i].active = false;
        let children = items[i][childrenKey];

        if (_.isEqual(items[i][valueKey], activeItemValue)) {
          return {
            items,
            active: items[i]
          };
        } else if (children) {
          let v = findNode(children);
          if (v) {
            nextItems.push(
              children.map(item => ({
                ...this.stringToObject(item),
                parent: items[i]
              }))
            );
            nextPathItems.push(v.active);
            return {
              items,
              active: items[i]
            };
          }
        }
      }
      return null;
    };

    const nextData = _.cloneDeep(data);
    const activeItem = findNode(nextData);

    nextItems.push(nextData);

    if (activeItem) {
      nextPathItems.push(activeItem.active);
    }

    /**
     * 如果是异步更新 data 后，获取到的一个 selectNodeValue，则不更新 activePaths
     * 但是需要更新 items， 因为这里的目的就是把异步更新后的的数据展示出来
     */
    if (selectNodeValue) {
      this.setState({
        items: [...nextItems.reverse(), newChildren],
        tempActivePaths: nextPathItems.reverse()
      });
    } else {
      this.setState({
        items: nextItems.reverse(),
        activePaths: nextPathItems.reverse()
      });
    }
  }

  addPrefix = (name: string) => prefix(this.props.classPrefix)(name);

  renderDropdownMenu() {
    const { items, tempActivePaths, activePaths } = this.state;
    const { renderMenu, placement, renderExtraFooter, menuClassName } = this.props;
    const classes = classNames(
      this.addPrefix('menu'),
      menuClassName,
      `${namespace}-placement-${_.kebabCase(placement)}`
    );

    const menuProps = _.pick(
      this.props,
      DropdownMenu.handledProps.filter(name => name !== 'classPrefix')
    );

    return (
      <MenuWrapper className={classes}>
        <DropdownMenu
          {...menuProps}
          ref={this.bindMenuContainerRef}
          cascadeItems={items}
          renderMenu={renderMenu}
          cascadePathItems={tempActivePaths || activePaths}
          activeItemValue={this.getValue()}
          onSelect={this.handleSelect}
        />
        {renderExtraFooter && renderExtraFooter()}
      </MenuWrapper>
    );
  }

  render() {
    const {
      data,
      valueKey,
      labelKey,
      className,
      placeholder,
      renderValue,
      disabled,
      cleanable,
      locale,
      open,
      defaultOpen,
      onClose,
      placement,
      classPrefix,
      ...rest
    } = this.props;

    const { activePaths } = this.state;
    const unhandled = getUnhandledProps(Dropdown, rest);
    const value = this.getValue();
    const hasValue = !!value;

    let activeItemLabel: any = placeholder;

    if (renderValue) {
      activeItemLabel = renderValue(activePaths);
    } else if (activePaths.length > 0) {
      activeItemLabel = [];
      activePaths.forEach((item, index) => {
        let key = item[valueKey] || item[labelKey];
        activeItemLabel.push(<span key={key}>{item[labelKey]}</span>);
        if (index < activePaths.length - 1) {
          activeItemLabel.push(
            <span className="separator" key={`${key}-separator`}>
              {' '}
              /{' '}
            </span>
          );
        }
      });
    }

    const classes = classNames(
      classPrefix,
      className,
      `${namespace}-placement-${_.kebabCase(placement)}`,
      {
        [this.addPrefix('has-value')]: hasValue,
        [this.addPrefix('disabled')]: disabled
      }
    );

    return (
      <IntlProvider locale={locale}>
        <div
          {...unhandled}
          className={classes}
          tabIndex={-1}
          role="menu"
          ref={this.bindContainerRef}
        >
          <OverlayTrigger
            ref={this.bindTriggerRef}
            open={open}
            defaultOpen={defaultOpen}
            disabled={disabled}
            trigger="click"
            placement={placement}
            onEnter={this.handleEntered}
            onExited={onClose}
            speaker={this.renderDropdownMenu()}
          >
            <Toggle
              onClean={this.handleClean}
              cleanable={cleanable && !disabled}
              hasValue={!!value}
            >
              {activeItemLabel || <FormattedMessage id="placeholder" />}
            </Toggle>
          </OverlayTrigger>
        </div>
      </IntlProvider>
    );
  }
}

export default Dropdown;
