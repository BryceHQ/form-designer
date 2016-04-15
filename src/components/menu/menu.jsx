import React from 'react';
import lang from '../../lang.js';

import ListItem from 'material-ui/lib/lists/list-item';
import Colors from 'material-ui/lib/styles/colors';

import history from '../../history.js';


import Actions from '../../actions/actions.js';

import SelectableList from '../common/selectableList.jsx';

import History from './history.jsx';
import Open from './open.jsx';

const styles = {
  list: {
    position: 'absolute',
    height: '100%',
    width: '100px',
    backgroundColor: Colors.grey50,
  },
  body: {
    position: 'absolute',
    left: '100px',
    top: '63px',
  },
};

const Menu = React.createClass({

  _renderBody(index) {
    switch (index) {
      case 2:
        return (<Open data = {this.props.recent} placeholder = {this.props.placeholder}/>);

      // case 3:
      //   return (<div style={{padding: '20px'}}>保存到本地...</div>);

      case 4:
        return (<History data = {this.props.history} placeholder = {this.props.placeholder}/>);
      default:
        return null;
    }
  },

  render() {
    let {current, history} = this.props;

    let body = this._renderBody(current);

    return (
      <div>
        <SelectableList value = {current} onSelectedChange = {this._handleMenuSelect}
          style={styles.list}
        >
          <ListItem value={1} primaryText={lang.menu.new} />
          <ListItem value={2} primaryText={lang.menu.open} />
          {/*<ListItem value={3} primaryText={lang.menu.saveAs} />*/}
          <ListItem value={4} primaryText={lang.menu.history} />
        </SelectableList>

        <div style={styles.body}>
          {body}
        </div>
      </div>
    );
  },

  _handleMenuSelect(index) {
    if(index === 1){
      Actions.add();
    } else {
      Actions.menuSelect(index);
    }
  },

});

export default Menu;
