// @flow

import * as React from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import { IntlProvider, FormattedMessage } from 'rsuite-intl';
import OverlayTrigger from 'rsuite-utils/lib/Overlay/OverlayTrigger';
import {
  reactToString,
  filterNodesOfTree,
  getDataGroupBy,
  getUnhandledProps,
  prefix
} from 'rsuite-utils/lib/utils';

import { SearchBar, Toggle, MenuWrapper, constants } from 'rsuite-utils/lib/Picker';

import DropdownMenu from './DropdownMenu';
import defaultLocale from './locale';

const { namespace } = constants;

type DefaultEvent = SyntheticEvent<*>;
type DefaultEventFunction = (event: DefaultEvent) => void;
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
  data: Array<any>,
  locale: Object,
  classPrefix?: string,
  className?: string,
  menuClassName?: string,
  disabled?: boolean,
  disabledItemValues?: Array<any>,
  maxHeight?: number,
  valueKey?: string,
  labelKey?: string,
  value?: Array<any>,
  defaultValue?: Array<any>,
  renderMenu?: (menu: React.Node) => React.Node,
  renderMenuItem?: (itemLabel: React.Node, item: Object) => React.Node,
  renderMenuGroup?: (title: React.Node, item: Object) => React.Node,
  renderValue?: (value: Array<any>, items: Array<any>) => React.Node,
  renderExtraFooter?: () => React.Node,
  onChange?: (value: Array<any>, event: DefaultEvent) => void,
  onSelect?: (value: any, item: Object, event: DefaultEvent) => void,
  onGroupTitleClick?: DefaultEventFunction,
  onSearch?: (searchKeyword: string, event: DefaultEvent) => void,
  onOpen?: () => void,
  onClose?: () => void,
  /**
   * group by key in `data`
   */
  groupBy?: any,
  placeholder?: React.Node,
  searchable?: boolean,
  cleanable?: boolean,
  open?: boolean,
  defaultOpen?: boolean,

  /**
   * 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight' |
   * 'leftTop' | 'rightTop' | 'leftBottom' | 'rightBottom'
   */
  placement?: PlacementEighPoints
};

type States = {
  value?: Array<any>,
  // Used to focus the active item  when trigger `onKeydown`
  focusItemValue?: Array<any>,
  searchKeyword: string,
  filteredData?: Array<any>
};

class Dropdown extends React.Component<Props, States> {
  static defaultProps = {
    classPrefix: `${namespace}-check`,
    data: [],
    disabledItemValues: [],
    maxHeight: 320,
    valueKey: 'value',
    labelKey: 'label',
    locale: defaultLocale,
    searchable: true,
    cleanable: true,
    placement: 'bottomLeft'
  };

  constructor(props: Props) {
    super(props);
    const { data, value, defaultValue, groupBy, valueKey, labelKey } = props;

    const nextValue = _.clone(value || defaultValue) || [];

    this.state = {
      value: nextValue,
      // Used to hover the active item  when trigger `onKeydown`
      focusItemValue: nextValue ? nextValue[0] : undefined,
      searchKeyword: '',
      filteredData: data
    };

    if (groupBy === valueKey || groupBy === labelKey) {
      throw Error('`groupBy` can not be equal to `valueKey` and `labelKey`');
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const { value, data } = nextProps;
    if (!_.isEqual(value, this.props.value) || !_.isEqual(data, this.props.data)) {
      this.setState({
        value,
        focusItemValue: value,
        filteredData: data
      });
    }
  }

  getFocusableMenuItems = () => {
    const { labelKey } = this.props;
    const { menuItems } = this.menuContainer;
    if (!menuItems) {
      return [];
    }
    const items = Object.values(menuItems).map((item: any) => item.props.getItemData());

    return filterNodesOfTree(items, item => this.shouldDisplay(item[labelKey]));
  };

  getValue() {
    const { value } = this.props;
    const nextValue = _.isUndefined(value) ? this.state.value : value;
    return _.clone(nextValue) || [];
  }

  /**
   * Index of keyword  in `label`
   * @param {node} label
   */
  shouldDisplay(label: any) {
    const { searchKeyword } = this.state;
    if (!_.trim(searchKeyword)) {
      return true;
    }

    const keyword = searchKeyword.toLocaleLowerCase();

    if (typeof label === 'string' || typeof label === 'number') {
      return `${label}`.toLocaleLowerCase().indexOf(keyword) >= 0;
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
  }

  findNode(focus: Function) {
    const items = this.getFocusableMenuItems();
    const { valueKey } = this.props;
    const { focusItemValue } = this.state;

    for (let i = 0; i < items.length; i += 1) {
      if (_.eq(focusItemValue, items[i][valueKey])) {
        focus(items, i);
        return;
      }
    }

    focus(items, -1);
  }
  focusNextMenuItem() {
    const { valueKey } = this.props;
    this.findNode((items, index) => {
      const focusItem = items[index + 1];
      if (!_.isUndefined(focusItem)) {
        this.setState({ focusItemValue: focusItem[valueKey] });
      }
    });
  }
  focusPrevMenuItem() {
    const { valueKey } = this.props;
    this.findNode((items, index) => {
      const focusItem = items[index - 1];
      if (!_.isUndefined(focusItem)) {
        this.setState({ focusItemValue: focusItem[valueKey] });
      }
    });
  }

  selectFocusMenuItem(event: DefaultEvent) {
    const { onChange } = this.props;
    const value = this.getValue();
    const { focusItemValue } = this.state;

    if (!focusItemValue) {
      return;
    }

    if (!value.some(v => _.isEqual(v, focusItemValue))) {
      value.push(focusItemValue);
    } else {
      _.remove(value, itemVal => _.isEqual(itemVal, focusItemValue));
    }

    this.setState({ value }, () => {
      onChange && onChange(value, event);
    });
  }

  handleKeyDown = (event: SyntheticKeyboardEvent<*>) => {
    if (!this.menuContainer) {
      return;
    }

    switch (event.keyCode) {
      // down
      case 40:
        this.focusNextMenuItem();
        event.preventDefault();
        break;
      // up
      case 38:
        this.focusPrevMenuItem();
        event.preventDefault();
        break;
      // enter
      case 13:
        this.selectFocusMenuItem(event);
        event.preventDefault();
        break;
      // esc | tab
      case 27:
      case 9:
        this.closeDropdown();
        event.preventDefault();
        break;
      default:
    }
  };

  handleSelect = (nextValue: any, checked: boolean, item: Object, event: DefaultEvent) => {
    const { onChange, onSelect } = this.props;
    const value = this.getValue();

    if (checked) {
      value.push(nextValue);
    } else {
      _.remove(value, itemVal => _.isEqual(itemVal, nextValue));
    }

    this.setState(
      {
        value,
        focusItemValue: nextValue
      },
      () => {
        onSelect && onSelect(value, item, event);
        onChange && onChange(value, event);
      }
    );
  };

  handleSearch = (searchKeyword: string, event: DefaultEvent) => {
    const { onSearch } = this.props;
    this.setState({
      searchKeyword,
      focusItemValue: undefined
    });
    onSearch && onSearch(searchKeyword, event);
  };

  closeDropdown = () => {
    const value = this.getValue();
    if (this.trigger) {
      this.trigger.hide();
    }
    this.setState({
      focusItemValue: value ? value[0] : undefined
    });
  };

  handleClean = (event: DefaultEvent) => {
    const { disabled, onChange } = this.props;
    if (disabled) {
      return;
    }
    this.setState({ value: [] }, () => {
      onChange && onChange([], event);
    });
  };

  handleExited = () => {
    const { onClose } = this.props;
    const value = this.getValue();
    onClose && onClose();
    this.setState({
      focusItemValue: value ? value[0] : undefined
    });
  };

  addPrefix = (name: string) => prefix(this.props.classPrefix)(name);

  container = null;

  bindContainerRef = (ref: React.ElementRef<*>) => {
    this.container = ref;
  };

  trigger = null;

  bindTriggerRef = (ref: React.ElementRef<*>) => {
    this.trigger = ref;
  };

  menuContainer = {
    menuItems: null
  };

  bindMenuContainerRef = (ref: React.ElementRef<*>) => {
    this.menuContainer = ref;
  };

  renderDropdownMenu() {
    const {
      data,
      labelKey,
      groupBy,
      searchable,
      renderExtraFooter,
      locale,
      placement,
      renderMenu,
      menuClassName
    } = this.props;

    const { focusItemValue } = this.state;

    const classes = classNames(
      this.addPrefix('menu'),
      menuClassName,
      `${namespace}-placement-${_.kebabCase(placement)}`
    );

    let filteredData = filterNodesOfTree(data, item => this.shouldDisplay(item[labelKey]));

    // Create a tree structure data when set `groupBy`
    if (groupBy) {
      filteredData = getDataGroupBy(filteredData, groupBy);
    }

    const menuProps = _.pick(
      this.props,
      DropdownMenu.handledProps.filter(name => name !== 'classPrefix')
    );

    const menu = (
      <DropdownMenu
        {...menuProps}
        ref={this.bindMenuContainerRef}
        activeItemValues={this.getValue()}
        focusItemValue={focusItemValue}
        data={filteredData}
        group={!_.isUndefined(groupBy)}
        onSelect={this.handleSelect}
      />
    );

    return (
      <MenuWrapper className={classes} onKeyDown={this.handleKeyDown}>
        {searchable ? (
          <SearchBar
            placeholder={locale.searchPlaceholder}
            onChange={this.handleSearch}
            value={this.state.searchKeyword}
          />
        ) : null}
        {renderMenu ? renderMenu(menu) : menu}
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
      classPrefix,
      onOpen,
      onClose,
      placement,
      open,
      defaultOpen,
      ...rest
    } = this.props;

    const unhandled = getUnhandledProps(Dropdown, rest);
    const value = this.getValue();
    const hasValue = !!value && !!value.length;

    let selectedLabel = value && value.length ? `${value.length} selected` : placeholder;
    if (renderValue && hasValue) {
      selectedLabel = renderValue(
        value,
        data.filter(item => value.some(val => _.eq(item[valueKey], val)))
      );
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
          onKeyDown={this.handleKeyDown}
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
            onEntered={onOpen}
            onExited={onClose}
            speaker={this.renderDropdownMenu()}
          >
            <Toggle
              onClean={this.handleClean}
              cleanable={cleanable && !disabled}
              hasValue={hasValue}
            >
              {selectedLabel || <FormattedMessage id="placeholder" />}
            </Toggle>
          </OverlayTrigger>
        </div>
      </IntlProvider>
    );
  }
}

export default Dropdown;
