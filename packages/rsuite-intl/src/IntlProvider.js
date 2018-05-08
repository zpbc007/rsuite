import React from 'react';
import PropTypes from 'prop-types';

class IntlProvider extends React.Component {

  static propTypes = {
    locale: PropTypes.object
  };

  static childContextTypes = {
    locale: PropTypes.object
  };

  getChildContext() {
    const { locale } = this.props;
    return { locale };
  }
  render() {
    return React.Children.only(this.props.children);
  }
}

export default IntlProvider;
