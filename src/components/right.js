import React from 'react';

const Right = React.createClass({

  render() {
    return (
      <div className = "container">
        {this.props.children}
      </div>
    );
  },
});

export default Right;
