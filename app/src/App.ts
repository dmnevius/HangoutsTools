import Component from 'vue-class-component';
import Vue from 'vue';
import router from './boostrap';
import store from './store';

@Component({
  router,
  store,
})

export default class App extends Vue {}
