import router from './bootstrap';
import store from './store';

export default {
  router,
  store,
  methods: {
    navigate(to) {
      this.$router.push(`/${to}`);
    },
  },
};
