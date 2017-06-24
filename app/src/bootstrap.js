import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.css';
import routes from './routes';

Vue.use(VueRouter);
Vue.use(VueMaterial);

const router = new VueRouter({
  routes,
});

Vue.router = router;

Vue.material.registerTheme('hangouts', {
  primary: 'green',
  accent: 'teal',
});

Vue.material.setCurrentTheme('hangouts');

export default router;
