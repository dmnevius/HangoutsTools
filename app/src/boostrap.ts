import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css'
import routes from './routes';

Vue.use(VueRouter);
Vue.use(VueMaterial);

export default new VueRouter({
  routes,
});
