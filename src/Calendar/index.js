// @flow

import * as React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { IntlProvider } from 'rsuite-intl';

import withLocale from '../IntlProvider/withLocale';
import Calendar from './Calendar';

import { defaultProps, getUnhandledProps, prefix, createChainedFunction } from '../utils';
import disabledTime, { calendarOnlyProps } from '../utils/disabledTime';

type Props = {
  disabledDate?: (date?: moment$Moment) => boolean,
  defaultValue?: moment$Moment,
  value?: moment$Moment,
  calendarDefaultDate?: moment$Moment,
  locale?: Object,
  onChangeCalendarDate?: (date: moment$Moment, event?: SyntheticEvent<*>) => void,
  onToggleMonthDropdown?: (toggle: boolean) => void,
  onSelect?: (date: moment$Moment, event?: SyntheticEvent<*>) => void,
  onPrevMonth?: (date: moment$Moment) => void,
  onNextMonth?: (date: moment$Moment) => void,
  isoWeek?: boolean,
  limitStartYear?: number,
  limitEndYear?: number
};

type States = {
  value?: moment$Moment,
  showMonth?: boolean,
  pageDate: moment$Moment
};

class EnhanceCalendar extends React.Component<Props, States> {
  static defaultProps = {
    limitStartYear: 5,
    limitEndYear: 5
  };

  constructor(props: Props) {
    super(props);

    const { defaultValue, value, calendarDefaultDate } = props;
    const activeValue = value || defaultValue;

    this.state = {
      value: activeValue,
      calendarState: undefined,
      pageDate: activeValue || calendarDefaultDate || moment() // display calendar date
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    const { value } = this.props;
    if (nextProps.value && !nextProps.value.isSame(value, 'day')) {
      this.setState({
        pageDate: nextProps.value
      });
    }
  }
  onMoveForword = (nextPageDate: moment$Moment) => {
    const { onNextMonth, onChangeCalendarDate } = this.props;
    this.setState({
      pageDate: nextPageDate
    });
    onNextMonth && onNextMonth(nextPageDate);
    onChangeCalendarDate && onChangeCalendarDate(nextPageDate);
  };

  onMoveBackward = (nextPageDate: moment$Moment) => {
    const { onPrevMonth, onChangeCalendarDate } = this.props;
    this.setState({
      pageDate: nextPageDate
    });
    onPrevMonth && onPrevMonth(nextPageDate);
    onChangeCalendarDate && onChangeCalendarDate(nextPageDate);
  };

  getValue = () => {
    const value = this.props.value || this.state.value;
    return value ? value.clone() : null;
  };

  calendar = null;

  handleChangePageDate = (nextPageDate: moment$Moment) => {
    this.setState({
      pageDate: nextPageDate,
      showMonth: false
    });
    this.handleAllSelect(nextPageDate);
  };

  handleChangePageTime = (nextPageTime: moment$Moment) => {
    this.setState({
      pageDate: nextPageTime
    });
    this.handleAllSelect(nextPageTime);
  };

  showMonthDropdown() {
    this.setState({ showMonth: true });
  }

  hideMonthDropdown() {
    this.setState({ showMonth: false });
  }

  toggleMonthDropdown = () => {
    const { showMonth } = this.state;
    const { onToggleMonthDropdown } = this.props;

    if (showMonth) {
      this.hideMonthDropdown();
    } else {
      this.showMonthDropdown();
    }
    onToggleMonthDropdown && onToggleMonthDropdown(!showMonth);
  };

  handleAllSelect = (nextValue: moment$Moment, event?: SyntheticEvent<*>) => {
    const { onSelect, onChangeCalendarDate } = this.props;
    onSelect && onSelect(nextValue, event);
    onChangeCalendarDate && onChangeCalendarDate(nextValue, event);
  };
  handleSelect = (nextValue: moment$Moment) => {
    const { pageDate } = this.state;
    this.setState({
      pageDate: nextValue
    });

    this.handleAllSelect(nextValue);
  };
  render() {
    const { isoWeek, limitStartYear, limitEndYear, disabledDate, locale } = this.props;
    const { showMonth, pageDate } = this.state;
    const calendarProps = _.pick(this.props, calendarOnlyProps);

    return (
      <IntlProvider locale={locale}>
        <Calendar
          {...calendarProps}
          disabledDate={disabledDate}
          limitStartYear={limitStartYear}
          limitEndYear={limitEndYear}
          format="YYYY-MM-DD"
          isoWeek={isoWeek}
          calendarState={showMonth ? 'DROP_MONTH' : undefined}
          pageDate={pageDate}
          onMoveForword={this.onMoveForword}
          onMoveBackward={this.onMoveBackward}
          onSelect={this.handleSelect}
          onToggleMonthDropdown={this.toggleMonthDropdown}
          onChangePageDate={this.handleChangePageDate}
          onChangePageTime={this.handleChangePageTime}
        />
      </IntlProvider>
    );
  }
}

export default withLocale(['Calendar'])(EnhanceCalendar);
