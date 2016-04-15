//router

// import { browserHistory } from 'react-router';
//
// const costomHistory = {
//   host: browserHistory,
//   to(route) {
//     browserHistory.push(route);
//   },
//   home(){
//     browserHistory.push('/');
//   },
// };

import { hashHistory  } from 'react-router';

const costomHistory = {
  host: hashHistory,
  to(route) {
    window.location.hash = route;
  },
  home(){
    window.location.hash = '/';
  },
};

export default costomHistory;
