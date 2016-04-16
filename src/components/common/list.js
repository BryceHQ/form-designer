import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import Avatar from 'material-ui/lib/avatar';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';

const styles = {
  listItem: {
    padding: '10px',
  },
  list: {
    width: '400px',
    padding: '0px 20px',
  },
};

const SimpleList = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    placeholder: React.PropTypes.string,
    data: React.PropTypes.array,
  },

  getDefaultProps(){
    return {
      placeholder: '这里什么也没有...',
      data: [],
    };
  },

  render() {
    var {data, placeholder} = this.props;
    var children = [];
    var me = this;
    if(data && data.length){
      data.forEach(function(item, i){
        children.push(
          <ListItem key={i} innerDivStyle={styles.listItem} onTouchTap={me._handleTouchTab.bind(me, item, i)}
            primaryText={
              <div>
                <span className = "text-name">{item.name}</span>
                <span className = "text-info">
                  {item.value}
                </span>
              </div>
            }
          />
        );
      });
    } else {
      children.push(
        <ListItem key = {0} innerDivStyle = {styles.listItem}
          primaryText={
            <div>
              <span className = "text-name">{placeholder}</span>
            </div>
          }
        />
      );
    }
    return (
      <List style = {styles.list}>
        {children}
      </List>
    );
  },

  _handleTouchTab(data, index){
    if(this.props.onTouchTap){
      this.props.onTouchTap(data, index);
    }
  }
});

export default SimpleList;
