import defaultPage from './pages/default/default.vue';

export default [
  {
    path: '/home',
    component: defaultPage,
  }, {
    path: '/',
    redirect: '/home',
  },
];
