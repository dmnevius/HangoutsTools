import ChannelPage from './pages/view/channel/channel.vue';
import HomePage from './pages/home/home.vue';
import ViewPage from './pages/view/view.vue';

export default [
  {
    path: '/home',
    component: HomePage,
  }, {
    path: '/view',
    component: ViewPage,
  }, {
    path: '/view/channel/:id',
    component: ChannelPage,
  }, {
    path: '/',
    redirect: '/home',
  },
];
