import React from 'react';
// import MobileTearSheet from '../../../MobileTearSheet';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';
let SelectableList = SelectableContainerEnhance(List);

// function wrapState(ComposedComponent) {
//   const StateWrapper = React.createClass({
//     getInitialState() {
//       return {selectedIndex: 1};
//     },
//     handleUpdateSelectedIndex(e, index) {
//       this.setState({
//         selectedIndex: index,
//       });
//     },
//     render() {
//       return (
//         <ComposedComponent
//           {...this.props}
//           {...this.state}
//           valueLink={{value: this.state.selectedIndex, requestChange: this.handleUpdateSelectedIndex}}
//         />
//       );
//     },
//   });
//   return StateWrapper;
// }

//SelectableList = wrapState(SelectableList);

const MySelectableList = React.createClass({
  getDefaultProps() {
    return {value: 1};
  },

  getInitialState() {
    return {selectedIndex: this.props.value};
  },

  componentWillReceiveProps(nextProps){
    if(nextProps.value !== this.state.selectedIndex){
      this.setState({
        selectedIndex: nextProps.value
      });
    }
  },

  handleUpdateSelectedIndex(e, index) {
    this.setState({
      selectedIndex: index,
    });
    if(this.props.onSelectedChange){
      this.props.onSelectedChange(index);
    }
  },

  render() {
    let {value, style, subheader, subheaderStyle, children} = this.props;
    return (
      <SelectableList {...this.props}
        valueLink={{value: this.state.selectedIndex, requestChange: this.handleUpdateSelectedIndex}}
      >
        {children}
      </SelectableList>
    );
  },
});

export default MySelectableList;
