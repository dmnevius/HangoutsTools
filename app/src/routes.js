import defaultPage from './pages/default/default.vue';
import viewPage from './pages/view/view.vue';

export default [
  {
    path: '/home',
    component: defaultPage,
  }, {
    path: '/view',
    component: viewPage,
  }, {
    path: '/',
    redirect: '/home',
  },
];
