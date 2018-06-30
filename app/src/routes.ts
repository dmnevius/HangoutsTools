import Home from './pages/home/home.vue';

export default [
  {
    path: '/home',
    component: Home,
  }, {
    path: '/',
    redirect: '/home',
  },
];
