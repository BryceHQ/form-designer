/*
* 菜单-打开
*/
import React from 'react';

import ListItem from 'material-ui/lib/lists/list-item';

import history from '../../history.js';
import lang from '../../lang.js';

import Actions from '../../actions/actions.js';

import SimpleList from '../common/list.jsx';
import LinkButton from '../common/linkButton.jsx';

const styles = {
  list: {
    position: 'absolute',
    height: '100%',
    width: '100px',
  },
  body: {
    position: 'absolute',
    left: '100px',
    top: '63px',
  },
};

const Open = React.createClass({

  render() {

    return (
      <div>
        <SimpleList {...this.props} onTouchTap={this._handleTouchTab}/>
        <div className="align-center">
          <LinkButton onClick={() => history.to('/home')}>{lang.button.moreFiles}</LinkButton>
        </div>
      </div>
    );
  },

  _handleTouchTab(data, index) {
    if(data && data.id){
      history.to(`/file/${data.id}`);
    }
  },

});

export default Open;
