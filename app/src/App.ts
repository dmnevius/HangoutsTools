import Component from 'vue-class-component';
import Vue from 'vue';
import bus from './bus';
import router from './boostrap';
import store from './store';

@Component({
  router,
  store,
})

export default class App extends Vue {
  /**
   * Current error message
   */
  errorMessage: string = '';

  /**
   * Visibility of the error message
   */
  showError: boolean = false;

  created() {
    bus.$on('error', (message) => {
      this.errorMessage = message;
      this.showError = true;
    });
  }
}
