// @flow

import * as React from 'react';
import classNames from 'classnames';
import { hasClass } from 'dom-lib';

type DefaultEvent = SyntheticEvent<*>;

type Props = {
  classPrefix: string,
  value?: any,
  label?: any,
  nodeData: Object,
  active?: boolean,
  hasChildren?: boolean,
  labelClickableExpand?: boolean,
  disabled?: boolean,
  layer: number,
  onTreeToggle?: (nodeData: Object, layer: number, event: DefaultEvent) => void,
  onSelect?: (nodeData: Object, layer: number, event: DefaultEvent) => void,
  onRenderTreeIcon?: (nodeData: Object) => React.Node,
  onRenderTreeNode?: (nodeData: Object) => React.Node,
};

const INITIAL_PADDING = 12;
const PADDING = 16;

class TreeNode extends React.Component<Props> {
  /**
   * 展开收缩节点
   */
  handleTreeToggle = (event: DefaultEvent) => {
    const { labelClickableExpand, onTreeToggle, layer, nodeData } = this.props;
    if (labelClickableExpand) {
      return;
    }
    onTreeToggle && onTreeToggle(nodeData, layer, event);
  };

  handleSelect = (event: DefaultEvent) => {
    const {
      classPrefix,
      onTreeToggle,
      onSelect,
      hasChildren,
      labelClickableExpand,
      layer,
      disabled,
      nodeData,
    } = this.props;

    if (disabled) {
      return;
    }

    // 如果点击的是展开 icon 就 return
    if (event.target instanceof HTMLElement) {
      if (
        hasClass(
          event.target.parentNode,
          `${classPrefix}-node-expand-icon-wrapper`,
        )
      ) {
        return;
      }
    }

    // 点击title的时候，如果 title 设置为可以点击，同时又拥有子节点，则可以展开数据
    if (labelClickableExpand && hasChildren) {
      onTreeToggle && onTreeToggle(nodeData, layer, event);
    }

    onSelect && onSelect(nodeData, layer, event);
  };

  renderIcon = () => {
    const { classPrefix, onRenderTreeIcon, hasChildren, nodeData } = this.props;
    let expandIcon = <i className={`${classPrefix}-node-expand-icon icon`} />;
    if (nodeData !== undefined && typeof onRenderTreeIcon === 'function') {
      expandIcon = onRenderTreeIcon && onRenderTreeIcon(nodeData);
    }

    return hasChildren ? (
      <div
        role="button"
        tabIndex="-1"
        data-ref={nodeData.refKey}
        className={`${classPrefix}-node-expand-icon-wrapper`}
        onClick={this.handleTreeToggle}
      >
        {expandIcon}
      </div>
    ) : null;
  };

  renderLabel = () => {
    const {
      nodeData,
      onRenderTreeNode,
      label,
      classPrefix,
      layer,
    } = this.props;
    let newLabel = label;
    newLabel =
      typeof onRenderTreeNode === 'function'
        ? onRenderTreeNode(nodeData)
        : label;
    const key = nodeData ? nodeData.refKey : '';
    return (
      <span
        className={`${classPrefix}-node-label`}
        title={newLabel}
        data-layer={layer}
        data-key={key}
        role="button"
        tabIndex="-1"
        onClick={this.handleSelect}
      >
        {newLabel}
      </span>
    );
  };

  render() {
    const { classPrefix, active, layer, disabled } = this.props;

    const disabledClass = `${classPrefix}-node-disabled`;
    const activeClass = `${classPrefix}-node-active`;
    const classes = classNames(`${classPrefix}-node`, {
      'text-muted': disabled,
      [disabledClass]: disabled,
      [activeClass]: active,
    });

    const styles = { paddingLeft: layer * PADDING + INITIAL_PADDING };

    return (
      <div style={styles} className={classes}>
        {this.renderIcon()}
        {this.renderLabel()}
      </div>
    );
  }
}

export default TreeNode;
