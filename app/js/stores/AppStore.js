import EventEmitter from 'events';
import assign from 'object-assign';

import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';

const AppStore = assign({}, EventEmitter.prototype, {
  navigate(to) {
    const page = to + 1;
    const pages = document.getElementById('main-pages');
    const active = pages.getElementsByClassName('pages__page-active')[0];
    if (active) {
      active.setAttribute('class', active.getAttribute('class').replace(' pages__page-active', ''));
    }
    pages.children[page].setAttribute('class',
      `${pages.children[page].getAttribute('class')} pages__page-active`);
  },
});

AppStore.dispatchToken = AppDispatcher.register((action) => {
  switch (action.type) {
    case AppConstants.Actions.NAVIGATE:
      AppStore.navigate(action.page);
      break;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
});

export default AppStore;
