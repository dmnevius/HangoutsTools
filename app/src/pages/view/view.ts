import Component from 'vue-class-component';
import Vue from 'vue';
import project from '../../store/project';

@Component({})

export default class ViewPage extends Vue {
  get channels() {
    return project.state.channels;
  }
  get users() {
    return project.state.users;
  }
  get messages() {
    return project.state.messages;
  }
}
