// @flow

import * as React from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import { IntlProvider, FormattedMessage } from 'rsuite-intl';
import OverlayTrigger from 'rsuite-utils/lib/Overlay/OverlayTrigger';
import {
  reactToString,
  filterNodesOfTree,
  findNodeOfTree,
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
  value?: any,
  defaultValue?: any,
  renderMenu?: (menu: React.Node) => React.Node,
  renderMenuItem?: (itemLabel: React.Node, item: Object) => React.Node,
  renderMenuGroup?: (title: React.Node, item: Object) => React.Node,
  renderValue?: (value: any, item: Object) => React.Node,
  renderExtraFooter?: () => React.Node,
  onChange?: (value: any, event: DefaultEvent) => void,
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
  value?: any,
  // Used to focus the active item  when trigger `onKeydown`
  focusItemValue?: any,
  searchKeyword: string,
  filteredData?: Array<any>
};

class Dropdown extends React.Component<Props, States> {
  static defaultProps = {
    classPrefix: `${namespace}-select`,
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
    const nextValue = value || defaultValue;

    this.state = {
      value: nextValue,
      focusItemValue: nextValue,
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
    return _.isUndefined(value) ? this.state.value : value;
  }

  menuContainer = {
    menuItems: null
  };

  bindMenuContainerRef = (ref: React.ElementRef<*>) => {
    this.menuContainer = ref;
  };

  searchBarContainer = null;

  bindSearchBarContainerRef = (ref: React.ElementRef<*>) => {
    this.searchBarContainer = ref;
  };

  trigger = null;

  bindTriggerRef = (ref: React.ElementRef<*>) => {
    this.trigger = ref;
  };

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
    const { focusItemValue } = this.state;
    if (!focusItemValue) {
      return;
    }
    this.setState({ value: focusItemValue }, () => {
      onChange && onChange(focusItemValue, event);
      this.closeDropdown();
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

  handleSelect = (value: any, item: Object, event: DefaultEvent) => {
    const { onChange, onSelect } = this.props;
    this.setState(
      {
        value,
        focusItemValue: value
      },
      () => {
        onSelect && onSelect(value, item, event);
        onChange && onChange(value, event);
        this.closeDropdown();
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
        focusItemValue: null
      },
      () => {
        onChange && onChange(null, event);
      }
    );
  };

  handleExited = () => {
    const { onClose } = this.props;
    onClose && onClose();
    const value = this.getValue();
    this.setState({
      focusItemValue: value
    });
  };

  addPrefix = (name: string) => prefix(this.props.classPrefix)(name);

  renderDropdownMenu() {
    const {
      data,
      labelKey,
      groupBy,
      searchable,
      placement,
      locale,
      renderMenu,
      renderExtraFooter,
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
        activeItemValue={this.getValue()}
        focusItemValue={focusItemValue}
        data={filteredData}
        group={!_.isUndefined(groupBy)}
        onSelect={this.handleSelect}
      />
    );

    return (
      <MenuWrapper className={classes} onKeyDown={this.handleKeyDown}>
        {searchable && (
          <SearchBar
            ref={this.bindSearchBarContainerRef}
            placeholder={locale.searchPlaceholder}
            onChange={this.handleSearch}
            value={this.state.searchKeyword}
          />
        )}

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
    const hasValue = !!value;

    // Find active `MenuItem` by `value`
    const activeItem = findNodeOfTree(data, item => _.eq(item[valueKey], value));

    let activeItemLabel = placeholder;

    if (activeItem && activeItem[labelKey]) {
      activeItemLabel = activeItem[labelKey];

      if (renderValue) {
        activeItemLabel = renderValue(activeItemLabel, activeItem);
      }
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
        >
          <OverlayTrigger
            ref={this.bindTriggerRef}
            open={open}
            defaultOpen={defaultOpen}
            disabled={disabled}
            trigger="click"
            placement={placement}
            onEntered={onOpen}
            onExited={this.handleExited}
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
