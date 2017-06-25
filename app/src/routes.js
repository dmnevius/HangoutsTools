import defaultPage from './pages/default/default.vue';
import viewPage from './pages/view/view.vue';
import settingsPage from './pages/settings/settings.vue';

export default [
  {
    path: '/home',
    component: defaultPage,
  }, {
    path: '/view',
    component: viewPage,
  }, {
    path: '/settings',
    component: settingsPage,
  }, {
    path: '/',
    redirect: '/home',
  },
];
