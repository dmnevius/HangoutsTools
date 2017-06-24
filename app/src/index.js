import router from './bootstrap';
import store from './store';

export default {
  router,
  store,
  methods: {
    home() {
      this.$router.push('home');
    },
  },
};
