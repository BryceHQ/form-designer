import React from 'react';

import DropDownArrow from 'material-ui/lib/svg-icons/navigation/arrow-drop-down';
import Clearfix from 'material-ui/lib/clearfix';
import Transitions from 'material-ui/lib/styles/transitions';
import Popover from 'material-ui/lib/popover/popover';
import PopoverAnimationFromTop from 'material-ui/lib/popover/popover-animation-from-top';

import theme from '../../theme';
let {spacing} = theme;

const styles = {
  label: {
    color: 'black',
    lineHeight: `${spacing.toolbarHeight}px`,
    opacity: 1,
    position: 'relative',
    paddingLeft: `${spacing.gutter}px`,
    paddingRight: `${spacing.gutter+spacing.iconSize}px`,
    top: 0,
  },
  labelWhenOpen: {
    opacity: 0,
    top: (spacing.toolbarHeight / 8),
  },
  root: {
    display: 'inline-block',
    fontSize: spacing.fontSize,
    height: spacing.desktopSubheaderHeight,
    outline: 'none',
    position: 'relative',
    transition: Transitions.easeOut(),
  },
  underline: {
    borderTop: `solid 1px #D5EB6D`,
    bottom: 1,
    left: 0,
    margin: `-1px ${spacing.gutter}px`,
    right: 0,
    position: 'absolute',
  },
  control: {
    cursor: 'pointer',
    height: '100%',
    position: 'relative',
    width: '100%',
  },
  icon: {
    // fill: ,
    position: 'absolute',
    right: 16,
    top: 8,
  },
};

const Btn = React.createClass({
  propTypes: {
    transition: React.PropTypes.string,
  },

  getInitialState() {
    return {
      open: false,
    };
  },

  render() {
    let {open, anchorEl} = this.state;
    let {children, transition, duang} = this.props;
    return (
      <div ref="root" onClick={this._onControlTouchTap}>
        <Clearfix style={styles.control}>
          <div style={styles.label}>
            {"displayValue"}
          </div>
          <DropDownArrow style={styles.icon}/>
        </Clearfix>
        <Popover
          anchorOrigin={{horizontal: 'left', vertical: 'top'}}
          anchorEl={anchorEl}
          animation={PopoverAnimationFromTop}
          open={open}
          onRequestClose={this._onPanelrequestClose}
        >
         hello
        </Popover>
      </div>
    );
  },

  _onControlTouchTap(event) {
    event.preventDefault();
    this.setState({
      open: !this.state.open,
      anchorEl: this.refs.root,
    });
  },

  _onPanelrequestClose() {
    this.setState({
      open: false,
      anchorEl: null,
    });
  },
});

export default Btn;
